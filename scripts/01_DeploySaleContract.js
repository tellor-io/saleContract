
/**
* @title Sale Contract Approve addresses function
* @dev This allows Tellor approve an address for Tribute sales
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
tellorMaster = '';

//mainnet
//tellorMaster = '';

module.exports =async function(callback) {
    let sale;
    
        sale = await TellorCommunitySale.new(tellorMaster);
        console.log("Comunity Sale Contract Address", sale.address);   

}
