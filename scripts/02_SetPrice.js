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

//rinkeby
saleAddress = '';

//mainnet
//saleAddress = '';

var price = ; //uint _price

module.exports =async function(callback) {
    let sale;
    
        sale = await TellorCommunitySale.at(saleAddress);
        console.log("Comunity Sale Contract");   
        await sale.setPrice(price);
        console.log("Price set at", price);

}
