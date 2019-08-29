
/**
* @title Deploy Sale Contract 
* @dev This allows Tellor deploy the community sale contract
*/

/*Imports*/
var TellorCommunitySale = artifacts.require("TellorCommunitySale");
var TokenInterface = artifacts.require("TokenInterface");

/*Helper functions*/
function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}

/*notes for validating contract
//solc: 0.5.8+commit.23d335f2.Emscripten.clang

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
