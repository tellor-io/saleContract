/**
* @title Set Price per Tribute
* @dev This allows Tellor set the price per Tribute in ETH
*/

var mnemonic = "nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish";

const Web3 = require('web3')
var HDWalletProvider = require("truffle-hdwallet-provider");
var web3 = new Web3(new HDWalletProvider('4bdc16637633fa4b4854670fbb83fa254756798009f52a1d3add27fb5f5a8e16',"https://rinkeby.infura.io/v3/7f11ed6df93946658bf4c817620fbced"));

/*Imports*/
var TellorCommunitySale = artifacts.require("TellorCommunitySale");
var TokenInterface = artifacts.require("TokenInterface");

/*Helper functions*/
function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}


/*Variables*/
//rinkeby
saleAddress = '0xc3Bc04c971281321f197ce12AdAd15872027c840';

//rinkeby
//tellorMaster = '0x3f1571E4DFC9f3A016D90e0C9824C56fD8107a3e';

//mainnet
//tellorMaster = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5';

var p = '.017732';//.017732; //uint _price (usd eth price/1) * p => (169.19/1)*P



module.exports =async function(callback) {
    let sale;
        console.log("begin");
        sale = await TellorCommunitySale.at(saleAddress);
        console.log("Comunity Sale Contract");   
        var price = await web3.utils.toWei(p, 'ether')
        await sale.setPrice(price);
        console.log("Price set at", price);

}
