
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
// truffle-flattener ./contracts/01_DeploySaleContract.sol > ./flat_files/01_DeploySaleContract.sol
// truffle exec scripts/01_DeployTellor.js --network rinkeby

/*Variables*/
//rinkeby
tellorMaster = '0x3f1571E4DFC9f3A016D90e0C9824C56fD8107a3e';

//mainnet
//tellorMaster = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5';

//Mainnet - 0x0ba45a8b5d5575935b8158a88c631e9f9c95a2e5

//Rinkeby - 0x3f1571e4dfc9f3a016d90e0c9824c56fd8107a3e

module.exports =async function(callback) {
    let sale;
    
        sale = await TellorCommunitySale.new(tellorMaster);
        console.log("Comunity Sale Contract Address", sale.address);   

}
