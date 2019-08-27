/** 
* This tests the oracle functions, including mining.
*/
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
const BN = require('bn.js');  
const helper = require("./helpers/test_helpers");
const SaleContract = artifacts.require("./TellorMaster.sol");


function promisifyLogWatch(_address,_event) {
  return new Promise((resolve, reject) => {
    web3.eth.subscribe('logs', {

      address: _address,
      topics: [web3.utils.sha3(_event)]
    }, (error, result) => {
        if (error){
          console.log('Error',error);
          reject(error);
        }
        else{
       	resolve(result);
        web3.eth.clearSubscriptions();
    	}
    })
  });
}

contract('Mining Tests', function(accounts) {
  let oracle;
  let oracle2;

    beforeEach('Setup contract for each test', async function () {
        oracleBase = await Oracle.new();
        oracle = await TellorMaster.new(oracleBase.address);
        oracle2 = await new web3.eth.Contract(oracleAbi,oracleBase.address);///will this instance work for logWatch? hopefully...
        //await web3.eth.sendTransaction({to: oracle.address,from:accounts[0],gas:7000000,data:oracle2.methods.init().encodeABI()})
        await web3.eth.sendTransaction({to: oracle.address,from:accounts[0],gas:7000000,data:oracle2.methods.requestData(api,"BTC/USD",1000,0).encodeABI()})
    });

    it("Get Symbol", async function(){
        let symbol = await oracle.getSymbol();
        assert.equal(symbol,"TT","the Symbol should be TT");
    });


});    