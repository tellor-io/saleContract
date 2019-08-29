<p align="center">
  <a href='https://www.tellor.io/'>
    <img src= './public/Tellor.png' width="250" height="200" alt='tellor.io' />
  </a>
</p>

<p align="center">
  <a href='https://twitter.com/WeAreTellor'>
    <img src= 'https://img.shields.io/twitter/url/http/shields.io.svg?style=social' alt='Twitter WeAreTellor' />
  </a> 
</p>

# Sale Contract

This contracted is intended to help miners buy the 1000 Tributes necessary for staking and becoming part of the Tellor network.


# Testing
Open two git terminals

On one terminal run:

```bash
git clone https://github.com/tellor-io/saleContract
cd saleContract
npm install
truffle compile
```

On the second termial run:

```bash  
Ganache-cli -a=16
```

On the first terminal run:

```bash
truffle test
```
