pragma solidity ^0.4.24;

import "./contracts/ownership/Ownable.sol";
import "./AegisEconomyCoin.sol";

contract BusinessAcc is Ownable{

 	AegisEconomyCoin public aegisCoin;

 	/// Modifier to allow only aegisCoin contract to call a method
 	modifier onlyAdmin() {
 		require (msg.sender == address(aegisCoin));
 		_;
  	} 

 	/// @author Gagandeep_HashCode
    /// @notice Contructor for initial setup
	constructor (AegisEconomyCoin _address) 
	{
			require(_address != address(0));
			aegisCoin = _address;
			aegisCoin.setBusinessAcc(address(this));	
	}	


	/// @notice Function to set business funds to any address
	function setBusinessAccountForAegisCoin() 
	onlyOwner
	public
	{
			aegisCoin.setBusinessAcc(address(this));
	}


	/// @notice Function to transfer business funds to any address
	/// @param _receiver Receiver's address
	/// @param _value Amount of tokens to be sent
	function transferTokens(address _receiver, uint256 _value) 
	onlyAdmin 
	public 
	{
			aegisCoin.transfer(_receiver, _value);
	}


	// NO MORE REQUIRED
	// // TODO: function set approval that will be called by api every time funds are received so that
	// //       admin can make transferFrom calls easily
	// function setApprovalForFunds()
	// public
	// {
	//         uint256 currentTokenBalance = aegisCoin.balanceOf(address(this));
	// 		aegisCoin.approve(address(aegisCoin), currentTokenBalance);
	// }


	// ========================= Getter Methods ===============================


	/// @notice Function to fetch the current token balance
	/// @return _currentTokenBalance of business contract
    function getContractBalance() 
    public 
    view 
    returns (uint256 _currentTokenBalance) 
    {
	        _currentTokenBalance = aegisCoin.balanceOf(address(this));
	        return;
    }


    // function getAllowance(address _owner, address _spender) 
    // public 
    // view 
    // returns (uint256) 
    // {
	   //      return aegisCoin.allowance(_owner, _spender);
    // }

    // TODO: Maintain History
}