
/**
* @title Add Addresses 
* @dev This allows Tellor approve an address for Tribute sales
*/

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
var sale_address = '0xc3Bc04c971281321f197ce12AdAd15872027c840';

//mainnet
//var sale_address = '';
var approved_addresses = ['0x0d7EFfEFdB084DfEB1621348c8C70cc4e871Eba4',
'0xe0d7BAE200F0994B11423E8BE8F386060bBdd808',
'0x3564E17D5f6B7c9A3c6Bd6248BF7B3EeB4927e50'];
var approved_amount = ['1000' ,'1000' ,'1000' ];
var addressCount = 2;//address count - 1

module.exports =async function(callback) {
    let sale;

    
    for(let i = 0; i <= addressCount; i++){
        try{
        sale = await TellorCommunitySale.at(sale_address);
        console.log("ComunitySale Contract");
        let partyAddress = await approved_addresses[i];
        //let amount = await web3.utils.toWei(approved_amount[i], 'ether');
        let amount = await approved_amount[i];
        await sale.enterAddress(partyAddress,amount);
        console.log("Added:",partyAddress, amount);
        } catch(error) {
        console.error(error);
        }    
    }

}
