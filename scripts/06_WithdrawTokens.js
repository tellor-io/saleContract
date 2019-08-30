
/**
* @title Withdraw Tokens 
* @dev This allows Tellor to withdraw left over Tributes after the sale ends
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
var sale_address = '0xc3Bc04c971281321f197ce12AdAd15872027c840';

module.exports =async function(callback) {
    let sale;

        try{
        sale = await TellorCommunitySale.at(sale_address);
        console.log("ComunitySale Contract");
        await sale.withdrawTokens();
        console.log("Tokens withdrawn");
        } catch(error) {
        console.error(error);
        }        

}
