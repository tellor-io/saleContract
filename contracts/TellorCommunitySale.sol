pragma solidity ^0.5.0;

import "./TokenInterface.sol";
import "./SafeMath.sol";

contract TellorCommunitySale{
  using SafeMath for uint256;

  address payable public owner;
  uint public tribPrice;
  uint public endDate;
  uint public saleAmount;
  address public tellorAddress;
  TokenInterface tellor;

  mapping(address => uint) saleByAddress;
  mapping(address => bool) withdrawn;


  event NewPrice(uint _price);
  event NewAddress(address _newAddress, uint _amount);
  event NewSale(address _buyer,uint _amount);

  constructor(address _Tellor) public {
    owner = msg.sender;
    endDate = now + 7 days;
    tellorAddress = _Tellor;
    tellor = TokenInterface(_Tellor);
  }


  function setPrice(uint _price) external {
    require(msg.sender == owner);
    tribPrice = _price;
    emit NewPrice(_price);

  }

  function enterAddress(address _address, uint _amount) external {
    require(msg.sender == owner);
    require(withdrawn[_address] == false);
    require(checkThisAddressTokens() > saleAmount.add(_amount));
    saleAmount += _amount;
    saleByAddress[_address] = _amount;
    emit NewAddress(_address,_amount);
  }

  function withdrawTokens() external{
    require(msg.sender == owner);
    require(now > endDate);
    tellor.transfer(owner,tellor.balanceOf(address(this)));
  }

  function withdrawETH() external{
    require(msg.sender == owner);
   address(owner).transfer(address(this).balance);
  }


  function () external payable{
    require(!withdrawn[msg.sender]);
    require (saleByAddress[msg.sender] > 0);
    require(msg.value >= tribPrice.mul(saleByAddress[msg.sender]));//are decimals an issue?
    tellor.transfer(msg.sender,saleByAddress[msg.sender]*1e18);
    withdrawn[msg.sender] = true;
    emit NewSale(msg.sender,saleByAddress[msg.sender]);
  }    


  //Getters
  function getSaleByAddress(address _addr) external view returns(uint){
    return saleByAddress[_addr];
  }

  function didWithdraw(address _addr) external view returns(bool){
    return withdrawn[_addr];
  }

  function checkThisAddressTokens() public view returns(uint){
    return tellor.balanceOf(address(this));
  }

}
