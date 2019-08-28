var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic ="nick lucian brenda kevin sam fiscal patch fly damp ocean produce wish";

var nick = "the ureau";


module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 4000000,
      websockets: true
    },
    dev2: {
      host: "localhost",
      port: 8546,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () =>
      new HDWalletProvider("4bdc16637633fa4b4854670fbb83fa254756798009f52a1d3add27fb5f5a8e16","https://rinkeby.infura.io/v3/7f11ed6df93946658bf4c817620fbced"),
      network_id: 4
    }   
  }
};