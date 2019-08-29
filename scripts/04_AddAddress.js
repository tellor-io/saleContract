
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
var sale_address = '';
var partyAddress = '';
var amount= ;
var addressCount = ;//address count - 1

module.exports =async function(callback) {
    let sale;

        try{
        sale = await TellorCommunitySale.at(sale_address);
        console.log("ComunitySale Contract");
        await sale.enterAddress(partyAddress,amount);
        console.log("Added:",partyAddress, amount);
        } catch(error) {
        console.error(error);
        }        

}
