pragma solidity ^0.5.0;

import "./TokenInterface.sol";
import "./SafeMath.sol";

/**
* @title Tellor Community Sale
* @dev This contract allows for the sale of Tributes to early miners
*/

contract TellorCommunitySale{
    using SafeMath for uint256;

    /*Variables*/
    uint public tribPrice;
    uint public endDate;
    uint public saleAmount;
    address public tellorAddress;
    address payable public owner;
    TokenInterface tellor;

    mapping(address => uint) saleByAddress;
    mapping(address => bool) withdrawn;

    /*Events*/
    event NewPrice(uint _price);
    event NewAddress(address _newAddress, uint _amount);
    event NewSale(address _buyer,uint _amount);


    /*Constructor*/
    /*
    * @dev This sets the sale period to 7 days, and the TellorMaster address for the interface
    * @param _Tellor is the TellorMaster address
    */
    constructor(address _Tellor) public {
        owner = msg.sender;
        endDate = now + 7 days;
        tellorAddress = _Tellor;
        tellor = TokenInterface(_Tellor);
    }


    /**
    * @dev Allows the contract owner(Tellor) to set the price per Tribute
    * @param _price per Tribute
    */
    function setPrice(uint _price) external {
        require(msg.sender == owner);
        tribPrice = _price;
        emit NewPrice(_price);
    }


    /**
    * @dev Allows the contract owner(Tellor) to add approved addresses for the sale
    * It only allows for each address to be approved once and it checks that this contract contains 
    * enough Tellor Tributes available before authorizing
    * @param _address of approved party
    * @param _amount of tokens authorized for the party to buy
    */
    function enterAddress(address _address, uint _amount) external {
        require(msg.sender == owner);
        require(withdrawn[_address] == false);
        require(checkThisAddressTokens() > saleAmount.add(_amount));
        saleAmount += _amount;
        saleByAddress[_address] = _amount;
        emit NewAddress(_address,_amount);
    }


    /**
    * @dev Allows the contract owner(Tellor) to withdraw any Tributes left on this contract
    * after the sale's end date
    */
    function withdrawTokens() external{
        require(msg.sender == owner);
        require(now > endDate);
        tellor.transfer(owner,tellor.balanceOf(address(this)));
    }


    /**
    * @dev Allows the contract owner(Tellor) to withdraw ETH from this contract
    */
    function withdrawETH() external{
        require(msg.sender == owner);
        address(owner).transfer(address(this).balance);
    }
    

    /**
    * @dev Allows the approved addresses to pay ETH and withdraw the authorized number of Tributes
    */
    function () external payable{
        require(!withdrawn[msg.sender]);
        require (saleByAddress[msg.sender] > 0);
        require(msg.value >= tribPrice.mul(saleByAddress[msg.sender]));//are decimals an issue?
        withdrawn[msg.sender] = true;
        tellor.transfer(msg.sender,saleByAddress[msg.sender]*1e18); 
        emit NewSale(msg.sender,saleByAddress[msg.sender]);
    }    


    /*Getters*/

    /**
    * @dev Gets the amount of Tributes authorized for the specified address
    * @param _address of approved party
    */
    function getSaleByAddress(address _address) external view returns(uint){
        return saleByAddress[_address];
    }


    /**
    * @dev Checks if the approved party withdrew the amount of Tributes authorized
    * @param _address of approved party
    */
    function didWithdraw(address _address) external view returns(bool){
        return withdrawn[_address];
    }


    /**
    * @dev Checks if this contract has enough Tributes before approving more addresses 
    */
    function checkThisAddressTokens() public view returns(uint){
        return tellor.balanceOf(address(this));
    }

}
