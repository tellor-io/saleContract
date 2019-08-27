pragma solidity >=0.5.19;

contract TellorCommunitySale{
  address public owner;
  uint public tribPrice;
  uint public endDate;
  uint public saleAmount;
  TokenInterface tellor;

  mapping(address => uint) saleByAddress;
  mapping(address => bool) withdrawn;


  event NewPrice(uint price);
  event NewAddress(address newAddress);
  event NewSale(address _buyer,uint _amount);

  constructor(address _Tellor) public {
    owner = msg.sender;
    endDate = now + 7 days;
    tellor = TokenInterface(_Tellor);
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function setPrice(uint _price) external restricted {
    tribPrice = _price;
    emit NewPrice(_price);
  }

  function enterAddress(address _address, uint _amount) external restricted{
    require(withdrawn[_address] == false);
    require(checkThisAddressTokens > saleAmount + _amount);
    saleAmount += _amount;
    saleByAddress[_address] = _amount;
    emit NewAddress(_address,_amount);
  }

  function withdrawTokens() external restricted{
    require(now > endDate);
    tellor.transfer(owner,tellor.balanceOf(address(this)));
  }

  function withdrawETH() external restricted{
   require(now > endDate);
   address(owner).transfer(address(this).balance);
  }


  function () external payable{
    require(!withdrawn[msg.sender]);
    require(msg.value >= tribPrice * saleByAddress[msg.sender]);//are decimals an issue?
    tellor.transfer(msg.sender,saleByAddress[msg.sender])
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

  function checkThisAddressTokens() external view returns(uint){
    return Tellor.balanceOf(address(this));
  }

}
