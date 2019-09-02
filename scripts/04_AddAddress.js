
/**
* @title Approve address 
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
var sale_address = '0xc3Bc04c971281321f197ce12AdAd15872027c840';
var partyAddress = '0x0d7EFfEFdB084DfEB1621348c8C70cc4e871Eba4';
var amount= 1000;


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
