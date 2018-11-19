pragma solidity ^0.4.24;

import "./contracts/ownership/Ownable.sol";
import "./AegisEconomyCoin.sol";
import "./contracts/math/SafeMath.sol";


contract DevelopmentAcc is Ownable {	

 	AegisEconomyCoin public aegisCoin;

 	uint256 public developersFundPercentage; 
 	uint256 public votersFundPercentage; 
 	
 	uint256 public firstWinnerPercentage; 
 	uint256 public secondWinnerPercentage; 
 	uint256 public thirdWinnerPercentage; 

 	/// Modifier to allow only aegisCoin contract to call a method
 	modifier onlyAdmin() {
 		require (msg.sender == address(aegisCoin));
 		_;
  	} 
 	
	/// @author Gagandeep_HashCode
    /// @notice Contructor for initial setup
	constructor (AegisEconomyCoin _address, 
		uint256 _devPercentage, 
		uint256 _voterPercentage, 
		uint256 _firstWinnerPer, 
		uint256 _secondWinnerPer, 
		uint256 _thirdWinnerPer) 
	{
			require(_address != address(0));
			aegisCoin = _address;
			
			setDeveloperVoterPercentage(_devPercentage, _voterPercentage);
			setWinnersPercentage(_firstWinnerPer, _secondWinnerPer, _thirdWinnerPer);
	}	


    function setDevelopmentAccountForAegisCoin() 
	onlyOwner
	public
	{
			aegisCoin.setDevelopmentAcc(address(this));
	}

	/// @notice Function to transfer development funds to any address
	/// @param _receiver Receiver's address
	/// @param _value Amount of tokens to be sent
	function transferTokens(address _receiver, uint256 _value) 
	onlyAdmin 
	public 
	{
			aegisCoin.transfer(_receiver, _value);
	}


	// Set figures for developer and reviewers
	/// @notice Function to update distributive percentage figures for developers and voters
	/// @param _devPercentage Percentage value for developers
	/// @param _voterPercentage Percentage value for voters
	function setDeveloperVoterPercentage(uint256 _devPercentage, uint256 _voterPercentage) 
	private 
	{
			developersFundPercentage = _devPercentage;
			votersFundPercentage = _voterPercentage;
	}


	// Set figures for first, second and third winners
	/// @notice Function to update distributive percentage figures for first, second and third winners
	/// @param _firstWinnerPer Percentage value for first winner
	/// @param _secondWinnerPer Percentage value for second winner
	/// @param _thirdWinnerPer Percentage value for third winner
	function setWinnersPercentage(uint256 _firstWinnerPer,
	    uint256 _secondWinnerPer,
	    uint256 _thirdWinnerPer) 
	private 
	{
			firstWinnerPercentage = _firstWinnerPer;
			secondWinnerPercentage = _secondWinnerPer;
			thirdWinnerPercentage = _thirdWinnerPer;
	}

	// Set figures for developer and reviewers
	/// @notice Wrapper Function to update distributive percentage figures for developers and voters
	/// @param _devPercentage Percentage value for developers
	/// @param _voterPercentage Percentage value for voters
	function updateDeveloperVoterPercentage(uint256 _devPercentage, uint256 _voterPercentage) 
	public 
	{
        	// require ( _devPercentage.add(_voterPercentage) == 100); 
			setDeveloperVoterPercentage(_devPercentage, _voterPercentage);
	}


	// Set figures for first, second and third winners
	/// @notice Function to update distributive percentage figures for first, second and third winners
	/// @param _firstWinnerPer Percentage value for first winner
	/// @param _secondWinnerPer Percentage value for second winner
	/// @param _thirdWinnerPer Percentage value for third winner
	function updateWinnersPercentage(uint256 _firstWinnerPer,
	    uint256 _secondWinnerPer,
	    uint256 _thirdWinnerPer) 
	public 
	{
            // require ( _firstWinnerPer.add(_secondWinnerPer.add(_thirdWinnerPer)) == 100); 
			updateWinnersPercentage(_firstWinnerPer, _secondWinnerPer, _thirdWinnerPer);
	}


	// function createBacklog() {
	// 	// set reserved value and other variables here 
	// }


	// // Suggestions function to keep track of price winners
	// // for that mapping will be there and this method will be called (and will throw an event) whenever transactions are made to winners and reviewers
	// function releaseTokens(address _firstWinner, 
	// 	address _secondWinner, 
	// 	address _thirdWinner, 
	// 	uint256 _backlogTokenAmount,
	// 	uint256 _totalVoters)			// param: backlog-id - map backlog-id with totalVoters/TokensPerVoter
	// public 
	// {
	// 		// param: reviewers, first/second/third winner address and unique-id
	// 		// call releaseTokensForCompleteBackLog() method
	// 		uint256 tokensForDevelopers;
	// 		uint256 tokensForVoters;

	// 		uint256 tokensForFirstWinner;
	// 		uint256 tokensForSecondWinner;
	// 		uint256 tokensForThirdWinner;

	// 		(tokensForDevelopers, tokensForVoters) = calculateFunds(_backlogTokenAmount);

	// 		(tokensForFirstWinner, tokensForSecondWinner, tokensForThirdWinner) = calculateWinnerFunds(tokensForDevelopers);

	// 		uint256 tokensPerVoter = calculateVoterFunds(tokensForVoters, _totalVoters);

	// 		// do token amount check with reserved value and not with owner's balance before sending it to transfer function

	// 		aegisCoin.transfer(_firstWinner, tokensForFirstWinner);
	// 		aegisCoin.transfer(_secondWinner, tokensForSecondWinner);
	// 		aegisCoin.transfer(_thirdWinner, tokensForThirdWinner);

	// 		// TODO: transfer funds to all voters
	// } 

	// /// @notice Function to calculate token value for developers and voters as per the backlog amount given
	// /// @param _backlogAmount Amount of token assigned to the given backlog
	// /// @return _tokensForDev Amount of tokens reserved for developers
	// /// @return _tokensForVoters Amount of tokens reserved for voters
	// function calculateFunds(uint256 _backlogAmount)
	// private
	// returns (uint256 _tokensForDev, uint256 _tokensForVoters) 
	// {
	// 		_tokensForDev = (_backlogAmount.mul(developersFundPercentage)).div(100);
	// 		_tokensForVoters = (_backlogAmount.mul(votersFundPercentage)).div(100);
	// 		return;
	// }


	// function calculateWinnerFunds(uint256 _backlogAmountForDevelopers) 
	// private
	// returns (uint256 _tokensForFirstWinner, uint256 _tokensForSecondWinner, uint256 _tokensForThirdWinner)
	// {
	// 		_tokensForFirstWinner = (_backlogAmountForDevelopers.mul(firstWinnerPercentage)).div(100);
	// 		_tokensForSecondWinner = (_backlogAmountForDevelopers.mul(secondWinnerPercentage)).div(100);
	// 		_tokensForThirdWinner = (_backlogAmountForDevelopers.mul(thirdWinnerPercentage)).div(100);
	// 		return;
	// }


	// function calculateVoterFunds(uint256 _backlogAmountForVoters,uint256 _totalVoters)
	// private 
	// returns (uint256 _tokensPerVoter)
	// {
	// 		_tokensPerVoter = _backlogAmountForVoters.div(_totalVoters);
	// 		return;
	// }


	// // param: backlog-id 
	// // as backlog-id will be mapped with tokensPerVoter. We need not to recalculate or pass it from php. 
	// // this will be handled withing the smart contract
	// function releaseTokensForVoters(address[] _voters, uint256 _tokensPerVoter)  
	// public
	// {
	// 		// check if array length is 20
	// 		address[] voters = _voters;
	// 		// run loop from 0-20
	// 		// transfer(voters[i], _tokensPerVoter);
	// }



// /* 	// Need these in case we need to display status
// 	string public constant STATUS_CANCEL = "cancelled"; 
// 	string public constant STATUS_READY = "ready"; 
// 	string public constant STATUS_START = "started"; 
// 	string public constant STATUS_COMPLETE = "completed"; 
// 	string public constant STATUS_CLOSE = "closed";
//  */
// 	struct Status {
// 			// where status will be a struct with values as follows:
// 			// Status: -1 : cancelled/deleted	// backlog cancelled
// 			// 			0 : not started			// backlog on hold
// 			// 			1 : started				// backlog start of submission
// 			// 			2 : completed			// backlog submission + voting period ended		// should be separated
// 			// 			3 : close				// backlog winners and reviewers are paid
// 	}


// 	struct backlog {
// 		uint amount;
// 		Status value;			// will have only 5 values set here		// probably another struct not required
// 	}
	
// 	mapping (uint => uint) backlogId2backlog;
// 			// create a map:
// 			// unique-id => value => Status
// 			// map (backlog-id => tokenAmount => Status)
//         	// BL-1001 => 25k => 0;


// 	function addNewBacklog() {
// 		// this method will add new record to mapping
// 		// will set status = 0
// 		// will have params: unique-id, value
// 	}


// 	function deleteBacklog() {
// 		// check for it's existence
// 		// set status = -1
// 		// release reserved tokens and update the total balance of current balance
// 		// params: unique-id
// 	}

// 	// map reviewers to backlog unique-id


// 	function releaseTokensForCompleteBackLog() {
// 		// param: unique-id, first/second/third winner-addresses, array of reviewers
// 		// divide funds and then transfer to the addresses accordingly
// 		// funds divided as 
// 		// 	- firstWinnerFund
// 		//  - secondWinnerFund
// 		//  - thirdWinnerFund
// 		//  - reviewerFund

// 		// check if there are three winners or not
// 		// QUERY: what will happen to the coins reserved for second and third place. If there is only one submission for a particular backlog
// 		// transferToWinner(firstWinnerAddress, firstWinnerFund)
// 		// transferToWinner(secondWinnerAddress, secondWinnerFund)
// 		// transferToWinner(thirdWinnerAddress, thirdWinnerFund)
// 		// transferToReviewers([]reviewersAddress)
// 		// status = 3 close
// 	}


// 	function transferToWinner() {
// 		// check if status is 2
// 		// params: unique-id, winner address, fundstotransfer
// 		// will update mapping values as well 
// 	}
	

// 	function transferToReviewers() {
// 		// will check if status is 2
// 		// params: unique-id, []reviewersAddresses, fundstotransferEach
// 		// will call transfer() in loop to process multiple transactions
// 	}

	// ========================= Getter Methods ===============================

    /// @notice Function to fetch percentage distribution set for Developers and Voters
    /// @return Developers Fund Percentage
    /// @return Voters Fund Percentage
    function getDeveloperAndVoterPercentage()
    public
    view
    returns (uint256, uint256)
    {
    		return(developersFundPercentage, votersFundPercentage); 
 	}


 	/// @notice Function to fetch percentage distribution set for winners
 	/// @return Percentage set for first winner
 	/// @return Percentage set for second winner
 	/// @return Percentage set for third winner
 	function getWinnersPercentage()
 	public
 	view
 	returns(uint256, uint256, uint256)
 	{
 			return(firstWinnerPercentage, secondWinnerPercentage, thirdWinnerPercentage); 
    }

    // Our service to check if gas is exhausted or not. There should be enough ethers to execute all the method calls that are inline.
}