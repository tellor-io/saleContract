/**
* @title Set Price per Tribute
* @dev This allows Tellor set the price per Tribute in ETH
*/

/*Imports*/
var TellorCommunitySale = artifacts.require("TellorCommunitySale");
var TokenInterface = artifacts.require("TokenInterface");

/*Helper functions*/
function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}


/*Variables*/
saleAddress = '0xc3Bc04c971281321f197ce12AdAd15872027c840';
//rinkeby
//tellorMaster = '0x3f1571E4DFC9f3A016D90e0C9824C56fD8107a3e';

//mainnet
//tellorMaster = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5';

var price = 3; //uint _price

module.exports =async function(callback) {
    let sale;
        console.log("begin");
        sale = await TellorCommunitySale.at(saleAddress);
        console.log("Comunity Sale Contract");   
        await sale.setPrice(price);
        console.log("Price set at", price);

}
