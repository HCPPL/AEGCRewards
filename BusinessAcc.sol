pragma solidity ^0.4.24;

import "./AegisEconomyCoin.sol";

contract BusinessAcc {

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
			// add coin address to use methods such as only admin and other related to admin
	}	

	/// @notice Function to transfer business funds to any address
	/// @param _receiver Receiver's address
	/// @param _value Amount of tokens to be sent
	function transferTokens(address _receiver, uint256 _value) 
	// onlyAdmin 
	public 
	{
			// approval required
			// as approval request should be from the owner of the funds. 
			// approval(_spender, _value) {}
			// Possible solution to override approval function with three params - _owner, _spender, _value
			aegisCoin.transferFrom(address(this), _receiver, _value);
	}

	// ========================= Getter Methods ===============================

	/* 
	 * TBD: Required?
	 */

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

    // TODO: Maintain History
}