pragma solidity ^0.4.24;

import "./contracts/ownership/Ownable.sol";
import "./AegisEconomyCoin.sol";

contract BusinessAcc is Ownable {

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


	// ========================= Getter Methods ===============================

    function getAegisCoinAddress() 
    public 
    view 
    returns (address) 
    {
	        return aegisCoin;
    }


    // TODO: change owner address!
}