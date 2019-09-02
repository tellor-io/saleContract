/** 
* This tests the oracle functions, including mining.
*/
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
const BN = require('bn.js');  
const SaleContract = artifacts.require("./TellorCommunitySale.sol");
const Token = artifacts.require("./test/ERC20.sol");



advanceTime = (time) => {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time],
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err); }
            return resolve(result);
        });
});}

async function expectThrow(promise){
  try {
    await promise;
  } catch (error) {
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      'Expected throw, got \'' + error + '\' instead',
    );
    return;
  }
  assert.fail('Expected throw not received');
};


contract('SaleTests', function(accounts) {

  let sale;
  let token;

    beforeEach('Setup contract for each test', async function () {
        token = await Token.new();
        sale = await SaleContract.new(token.address);
        await token._mint(accounts[0],web3.utils.toWei("15000",'ether'))
    });

    it("Get Owner,Tellor Address,EndDate", async function(){
        let tellor = await sale.tellorAddress.call()
        assert.equal(tellor,token.address,"the Address should be correct");
        let owner = await sale.owner();
        assert.equal(owner, accounts[0],"Owner Should Be correct");
        let endDate = await sale.endDate();
        assert(endDate > 0 , "End Date should be positive");
    });
    // it("Enter Address and Get Sale Amount and GetSaleByAddress and checkThisAddressTokens", async function(){
    //   await token.transfer(sale.address,web3.utils.toWei("15",'ether'))
    //   console.log(1)
    //   saleBal = await sale.checkThisAddressTokens()
    //   console.log(2)
    //   assert(saleBal == web3.utils.toWei("15",'ether'),"Address Balance should be correct")
    //   console.log(3)
    //   sale.enterAddress(accounts[1],web3.utils.toWei("1",'ether'))
    //   console.log(4)
    //   thisSale = await sale.getSaleByAddress(accounts[1])
    //   console.log("thissale", thisSale)
    //   console.log(5)
    //  // assert(thisSale ==web3.utils.toWei("1",'ether') ,"getSaleByAddress should work")
    //   console.log(6)
    //   //saleamt = await sale.saleAmount()
    //   //console.log(saleamt)
    //   //assert(await sale.saleAmount() == web3.utils.toWei("1",'ether'),"Sale Amount Should be correct")
    // });


    it("Set Price, Get tribPrice", async function(){
      let p = 3/200
      await sale.setPrice(web3.utils.toWei(p.toString(),'ether'))
      assert(await sale.tribPrice() == web3.utils.toWei(p.toString(),'ether'),"Price should be correct");
    });  

    it("Withdraw Tokens Test", async function(){
      await token.transfer(sale.address,web3.utils.toWei("15",'ether'))
      advanceTime(8*86400)
      bal1 = await token.balanceOf(accounts[0])
      await sale.withdrawTokens()
      bal2 = await token.balanceOf(accounts[0])
      bal = web3.utils.fromWei(bal1,"ether")
      assert(Number(bal) + 15 == 15000, "withdraw tokens should work")
    });
    it("Fallback Test and Withdraw ETH Test and did Withdraw", async function(){
      await token.transfer(sale.address,web3.utils.toWei("15",'ether'))
      await sale.enterAddress(accounts[1],10)
      let bal1 = await web3.eth.getBalance(accounts[0])
        bal1 = web3.utils.fromWei(bal1,'ether')
      await web3.eth.sendTransaction({from:accounts[1],to:sale.address,value:web3.utils.toWei("1","ether")})
      let balA = await web3.eth.getBalance(sale.address)
      assert(balA == web3.utils.toWei("1","ether"),"contract should have 10 ETH")
      await sale.withdrawETH();
      let bal2 = await web3.eth.getBalance(accounts[0])
        bal2 = web3.utils.fromWei(bal2,'ether')
      assert(Number(bal1) + .9 < Number(bal2), "withdraw ETH should work")
      
    });
    it("True Scenario Test - Sell 15e18 at 3$ a piece assuming 200$ ETH price", async function(){
      await token.transfer(sale.address,web3.utils.toWei("15000",'ether'))
      let p = 3/200
      await sale.setPrice(web3.utils.toWei(p.toString(),'ether'))
      console.log("after set price")
      saleBal = await sale.checkThisAddressTokens()
      console.log("before enter address")
      for(var i = 1; i<=15;i++){
          await sale.enterAddress(accounts[i],1000)
      }
      console.log("after enter address")
      p= p*1000
      for(var i = 1; i<=15;i++){
        await web3.eth.sendTransaction({from:accounts[i],to:sale.address,value:web3.utils.toWei(p.toString(),"ether")})
        bal = await token.balanceOf(accounts[i])
        console.log("bal",bal)
        assert(bal == web3.utils.toWei("1000",'ether'))
        
      }
      saleBal = await sale.checkThisAddressTokens()
      assert(saleBal == 0,"Address Balance should be correct")
      let bal1 = await web3.eth.getBalance(accounts[0])
      bal1 = web3.utils.fromWei(bal1,'ether')
      await sale.withdrawETH();
       let bal2 = await web3.eth.getBalance(accounts[0])
       bal2 = web3.utils.fromWei(bal2,'ether')
      let totalETH = 15 * p
      console.log("ETH Expected at 200$ price:  ",totalETH)
      assert(Number(bal1) + totalETH >= Number(bal2), "withdraw ETH should work")
    });
    it("Test Throws - Unauthorized Sale", async function(){
      await token.transfer(sale.address,web3.utils.toWei("1000",'ether'))
      console.log(1)
      await sale.enterAddress(accounts[1],1000)
      console.log(2)
      let bal1 = await web3.eth.getBalance(accounts[0])
      console.log(3)
      thisSale2 = await sale.getSaleByAddress(accounts[2])
      console.log("thissale acct2", thisSale2)
      await expectThrow(web3.eth.sendTransaction({from:accounts[2],to:sale.address,value:web3.utils.toWei("1","ether")}))
    });
    it("Test Throws All Restricted Functions", async function(){
      await expectThrow(sale.setPrice(web3.utils.toWei("1",'ether'),{from:accounts[2]}))
      await token.transfer(sale.address,web3.utils.toWei("15",'ether'))
      await expectThrow( sale.enterAddress(accounts[1],15,{from:accounts[4]})  )
      advanceTime(8*86400)
      await expectThrow(sale.withdrawTokens({from:accounts[2]}))
      await sale.enterAddress(accounts[1],10)
      await web3.eth.sendTransaction({from:accounts[1],to:sale.address,value:web3.utils.toWei("10","ether")})
      await expectThrow(sale.withdrawETH({from:accounts[3]}))
    });

});   