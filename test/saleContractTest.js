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
        await token._mint(accounts[0],15000e18)
    });

    it("Get Owner,Tellor Address,EndDate", async function(){
        let tellor = await sale.tellor()
        assert.equal(tellor.address,token.address,"the Address should be correct");
        let owner = await sale.owner();
        assert.equal(owner, accounts[0],"Owner Should Be correct");
        let endDate = await sale.endDate();
        assert(endDate > 0 , "End Date should be positive");
    });
    it("Enter Address and Get Sale Amount and GetSaleByAddress and checkThisAddressTokens", async function(){
      await token.transfer(sale.address,15e18)
      saleBal = await sale.checkThisAddressTokens()
      assert(saleBal == 15e18,"Address Balance should be correct")
      sale.enterAddress(accounts[1],1e18)
      thisSale = await sale.getSaleByAddress(accounts[1])
      assert(thisSale == 1e18,"getSaleByAddress should work")
      assert(sale.saleAmount() == 1e18,"Sale Amount Should be correct")
    });
    it("Set Price, Get tribPrice", async function(){
      await sale.setPrice(3* 1/200 * 1e18)
      assert(sale.tribPrice() == 3*1/200 * 1e18);
    });  

    it("Withdraw Tokens Test", async function(){
      await token.transfer(sale.address,15e18)
      advanceTime(7*86400)
      bal1 = await token.balanceOf(accounts[0])
      await sale.withdrawTokens()
      bal2 = await token.balanceOf(accounts[0])
      assert(bal1 + 15e18 == bal1, "withdraw tokens should work")
    });
    it("Fallback Test and Withdraw ETH Test and did Withdraw", async function(){
      await token.transfer(sale.address,15e18)
      sale.enterAddress(accounts[1],15e18)
      let bal1 = await web3.eth.getBalance(accounts[0])
      sale.sendTransaction({from:accounts[1],value:web3.toWei(10,"ether")})
      let balA = await web3.eth.getBalance(address)
      assert(balA == web3.toWei(10,"ether"))
      await sale.withdrawETH();
      let bal2 = await web3.eth.getBalance(accounts[0])
      assert(bal1 + 9.9e18 >= bal2, "withdraw ETH should work")
      assert(await sale.didWithdraw(accounts[1])==true, "Did Withdraw should work")
    });
    it("True Scenario Test - Sell 15e18 at 3$ a piece assuming 200$ ETH price", async function(){
      await token.transfer(sale.address,15000e18)
      await sale.setPrice(3* 1/200 * 1e18)
      saleBal = await sale.checkThisAddressTokens()
      for(var i = 1; i<=15;i++){
        sale.enterAddress(accounts[i],1000e18)
      }
      for(var i = 1; i<=15;i++){
        sale.sendTransaction({from:accounts[i],value:web3.toWei(3000/200,"ether")})
        bal = token.balanceOf(account[i])
        assert(bal == 1000e18)
        assert(await sale.didWithdraw(accounts[1])==true, "Did Withdraw should work")
      }
      saleBal = await sale.checkThisAddressTokens()
      assert(saleBal == 0,"Address Balance should be correct")
      let bal1 = await web3.eth.getBalance(accounts[0])
      await sale.withdrawETH();
       let bal2 = await web3.eth.getBalance(accounts[0])
      assert(bal1 + 14.900e18 >= bal2, "withdraw ETH should work")
    });
    it("Test Throws - Unauthorized Sale", async function(){
      await token.transfer(sale.address,15e18)
      await sale.enterAddress(accounts[1],15e18)
      let bal1 = await web3.eth.getBalance(accounts[0])
      await expectThrow(sale.sendTransaction({from:accounts[2],value:web3.utils.toWei(1,"ether")}))
    });
    it("Test Throws All Restricted Functions", async function(){
      await expectThrow(sale.setPrice(1,{from:accounts[2]}))
      await token.transfer(sale.address,15e18)
      await expectThrow( sale.enterAddress(accounts[1],15e18,{from:accounts[4]})  )
      advanceTime(7*86400)
      await expectThrow(sale.withdrawTokens({from:accounts[2]}))
      await sale.enterAddress(accounts[1],15e18)
      await sale.sendTransaction({from:accounts[1],value:web3.toWei(3000/200,"ether")})
      await expectThrow(sale.withdrawETH({from:accounts[3]}))
    });

});   