
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
var approved_addresses = [];
var approved_amount = [];
var addressCount = ;//address count - 1

module.exports =async function(callback) {
    let sale;
    let interface;
    
    for(let i = 0; i <= addressCount; i++){
        try{
        sale = await TellorCommunitySale.at(sale_address);
        console.log("ComunitySale Contract");
        let partyAddress = approved_addresses[i];
        let amount = approved_amount[i];
        await sale.enterAddress(partyAddress,amount);
        console.log("Added:",partyAddress, amount);
        } catch(error) {
        console.error(error);
        }    

}
