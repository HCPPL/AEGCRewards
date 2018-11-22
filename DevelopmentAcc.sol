pragma solidity ^0.4.24;

import "./contracts/ownership/Ownable.sol";
import "./AegisEconomyCoin.sol";
import "./contracts/math/SafeMath.sol";

contract DevelopmentAcc is Ownable {	

 	AegisEconomyCoin public aegisCoin;
 	using SafeMath for uint256;

 	uint256 public developersFundPercentage; 
 	uint256 public votersFundPercentage; 
 	
 	uint256 public firstWinnerPercentage; 
 	uint256 public secondWinnerPercentage; 
 	uint256 public thirdWinnerPercentage; 

 	uint256 public totalTokensReserved;

 	/// Modifier to allow only aegisCoin contract to call a method
 	modifier onlyAdmin() {
 		require (msg.sender == address(aegisCoin));
 		_;
  	} 

 	/// Modifier to check if backlogId is valid
  	modifier ifBacklogExisted(uint256 _backlogId) {
  		bool value = checkForBacklogExistence(_backlogId);
  		require(value == true);
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
			
			totalTokensReserved = 0;
			setDeveloperVoterPercentage(_devPercentage, _voterPercentage);
			setWinnersPercentage(_firstWinnerPer, _secondWinnerPer, _thirdWinnerPer);
	}	


    function setDevelopmentAccountForAegisCoin() 			// update
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
	/// @notice Wrapper Function to update distributive percentage figures for developers and voters
	/// @param _devPercentage Percentage value for developers
	/// @param _voterPercentage Percentage value for voters
	function updateDeveloperVoterPercentage(uint256 _devPercentage, uint256 _voterPercentage) 
	public 
	{
        	require ( _devPercentage.add(_voterPercentage) == 100); 
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
            require ( _firstWinnerPer.add(_secondWinnerPer.add(_thirdWinnerPer)) == 100); 
			updateWinnersPercentage(_firstWinnerPer, _secondWinnerPer, _thirdWinnerPer);
	}


		// param: unique-id, first/second/third winner-addresses, array of reviewers
		// divide funds and then transfer to the addresses accordingly
		// funds divided as 
		// 	- firstWinnerFund
		//  - secondWinnerFund
		//  - thirdWinnerFund
		//  - reviewerFund


	function setStatus(uint256 _backlogId, uint256 _statusValue) 
	onlyOwner
	public
	returns (bool)
	{
			require(_backlogId != 0);
			// TODO: check if _statusValue is an existing status or not?
			
			backlogId2backlogDetails[_backlogId].statusValue == _statusValue;
			return true;
	}


// /* 	// Need these in case we need to display status
// 	string public constant STATUS_CANCEL = "cancelled"; 
// 	string public constant STATUS_READY = "ready"; 
// 	string public constant STATUS_START = "started"; 
// 	string public constant STATUS_COMPLETE = "completed"; 
// 	string public constant STATUS_CLOSE = "closed";
//  */
// 	struct Status {
// 			// where status will be a struct with values as follows:
// 			// Status: -1 : cancelled/deleted	// backlog cancelled			// considering 5 for now
// 			// 			0 : not started			// backlog on hold
// 			// 			1 : started				// backlog start of submission
// 			// 			2 : completed			// backlog submission + voting period ended		// should be separated
// 			// 			3 : close				// backlog winners and reviewers are paid
// 	}

	struct backlogDetails {
        // uint256 backlogId;
        uint256 totalTokens;
        uint256 totalVoters;
		uint256 statusValue;					// will have only 5 values set here	
		// Status  value;					    // probably another struct not required
		uint256 tokensPerVoter;
	}
	
	mapping (uint256 => backlogDetails) backlogId2backlogDetails;

	uint256[] public backlogIds;


	// TBD: We can also look into modifiers to check status before calling a particular method.
	// For example: before calling updateBacklog() check if status is as required? but for that time management should be integrated to check if deadline was reached or not. 

	function addNewBacklog(uint256 _backlogId, uint256 _tokens) 
	public
	{
		// this method will add new record to mapping
		// maintain mapping of the structure: backlogId ==> tokensReserved ==> set Status: 0

		// TODO: if backlog-id already exist throw revert // updates will be made in updateBacklog method
		backlogDetails backlogId = backlogId2backlogDetails[_backlogId];

		backlogId.totalTokens = _tokens;
		backlogId.totalVoters = 0;
		backlogId.statusValue = 0;

		backlogIds.push(_backlogId)-1;

		totalTokensReserved = totalTokensReserved.add(_tokens);		// set reserved value and other variables here
		// emit new backlog added
	}


	// in progress 		// testing required
	function updateBacklog(uint256 _backlogId, uint256 _tokens) 
	ifBacklogExisted(_backlogId)		
	public
	{
		require(_backlogId != 0);
		require(_tokens != 0);

		backlogDetails backlogId = backlogId2backlogDetails[_backlogId];

		uint256 newTokens      = 0;
		uint256 newTotalTokens = 0; 

		uint256 tokens = backlogId.totalTokens;

		if(tokens < _tokens) {
				newTokens = _tokens.sub(tokens);
		} else {
			    newTokens = tokens.sub(_tokens);
		}

		newTotalTokens = tokens.add(newTokens);

		backlogId.totalTokens = newTotalTokens;
		backlogId.totalVoters = 0;				// check for the scenario if this should be in requirement statement i.e. voters should be 0 if you want to update the backlog tokens or not?
		backlogId.statusValue = 0;				// should here be another status value to mention that it's ben updated! i think no need.

		totalTokensReserved = totalTokensReserved.add(_tokens);		// set reserved value and other variables here
	}


	/// @notice Function to delete a particular backlog
	/// @dev This function will not remove it completely but will reset the values to 0 and will set status to deleted
	/// @param _backlogId Backlog-id for which you want to delete the details
	function deleteBacklog(uint256 _backlogId) 
	ifBacklogExisted(_backlogId)
	public
	{
		require(_backlogId != 0);

		uint256 tokenAmt = backlogId2backlogDetails[_backlogId].totalTokens;
		totalTokensReserved = totalTokensReserved.sub(tokenAmt);						// release reserved tokens and update the total balance of current balance

		backlogId2backlogDetails[_backlogId].totalTokens = 0;							// set total tokens = 0
		// backlogId2backlogDetails[_backlogId].totalVoters = 0;						// check if this can be a case?
		backlogId2backlogDetails[_backlogId].statusValue = 5;							// set status = -1

		// emit successful deletion of backlog
	}


	// Suggestions: function to keep track of price winners
	// for that mapping will be there and this method will be called (and will throw an event) whenever transactions are made to winners and reviewers
	
		// check if there are three winners or not
		// QUERY: what will happen to the coins reserved for second and third place. If there is only one submission for a particular backlog
		// transferToWinner(firstWinnerAddress, firstWinnerFund)
		// transferToWinner(secondWinnerAddress, secondWinnerFund)
		// transferToWinner(thirdWinnerAddress, thirdWinnerFund)
		// transferToReviewers([]reviewersAddress)
		// status = 3 close

	function releaseTokensForCompleteBacklog(uint256 _backlogId,
	    address _firstWinner, 
		address _secondWinner, 
		address _thirdWinner,
		uint256 _totalVoters)	
	ifBacklogExisted(_backlogId)		
	public 
	{

        	// TODO: check if status is 2   // require(backlogId2backlogDetails[_backlogId].statusValue == 2);

			// TODO: will update mapping values as well

			uint256 tokensForDevelopers;
			uint256 tokensForVoters;

			uint256 tokensForFirstWinner;
			uint256 tokensForSecondWinner;
			uint256 tokensForThirdWinner;

			uint256 backlogTokenAmount = backlogId2backlogDetails[_backlogId].totalTokens;

			// CHECK: require(backlogTokenAmount >= totalTokensReserved);		

			(tokensForDevelopers, tokensForVoters) = calculateFunds(backlogTokenAmount);
			(tokensForFirstWinner, tokensForSecondWinner, tokensForThirdWinner) = calculateWinnerFunds(tokensForDevelopers);
			
			// TODO: TBD: revert if (totalVoters == 0) and (tokensPerVoter != 0)
			backlogId2backlogDetails[_backlogId].tokensPerVoter = calculateVoterFunds(tokensForVoters, _totalVoters);

			aegisCoin.transfer(_firstWinner, tokensForFirstWinner);
			aegisCoin.transfer(_secondWinner, tokensForSecondWinner);
			aegisCoin.transfer(_thirdWinner, tokensForThirdWinner);

			// update mapping 
			// update reservedTokens value 
			// update status
			// update paid status 
	} 


	/// @notice Function to transfer tokens to Voters for given backlog-id
	/// @dev As backlog-Id is mapped with tokensPerVoter. We need not to recalculate or pass it from php. This will be handled withing the smart contract
	/// @param _backlogId Backlog-Id 
	/// @param _voters Array of voter addresses
	function releaseTokensForVoters(uint256 _backlogId, address[] _voters)  
	ifBacklogExisted(_backlogId)
	public
	{
			require (_voters.length <= 20);
			// TODO:  will check if status is 2

			address[] memory voters = _voters;
			uint256 tokens = backlogId2backlogDetails[_backlogId].tokensPerVoter;

			for(uint i=0; i < voters.length; i++) {
					aegisCoin.transfer(voters[i], tokens);
			}
	}

 /* **************************************************************************************************************************
  *	Private Methods
  */

  	/// @notice Function to update distributive percentage figures for developers and voters
	/// @param _devPercentage Percentage value for developers
	/// @param _voterPercentage Percentage value for voters
	function setDeveloperVoterPercentage(uint256 _devPercentage, uint256 _voterPercentage) 
	private 
	{
			developersFundPercentage = _devPercentage;
			votersFundPercentage = _voterPercentage;
	}


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


	/// @notice Function to calculate token value for developers and voters as per the backlog amount given
	/// @param _backlogAmount Amount of token assigned to the given backlog
	/// @return _tokensForDev Amount of tokens reserved for developers
	/// @return _tokensForVoters Amount of tokens reserved for voters
	function calculateFunds(uint256 _backlogAmount)
	private
	returns (uint256 _tokensForDev, uint256 _tokensForVoters) 
	{
			_tokensForDev = (_backlogAmount.mul(developersFundPercentage)).div(100);
			_tokensForVoters = (_backlogAmount.mul(votersFundPercentage)).div(100);
			return;
	}

	/// @notice Function to calculate token value for winners as per the backlog amount given for developers
	/// @param _backlogAmountForDevelopers Amount of token assigned to developers for that backlog
	/// @return _tokensForFirstWinner Amount of tokens reserved for first winner
	/// @return _tokensForSecondWinner Amount of tokens reserved for second winner
	/// @return _tokensForThirdWinner Amount of tokens reserved for third winner
	function calculateWinnerFunds(uint256 _backlogAmountForDevelopers) 
	private
	returns (uint256 _tokensForFirstWinner, uint256 _tokensForSecondWinner, uint256 _tokensForThirdWinner)
	{
			_tokensForFirstWinner = (_backlogAmountForDevelopers.mul(firstWinnerPercentage)).div(100);
			_tokensForSecondWinner = (_backlogAmountForDevelopers.mul(secondWinnerPercentage)).div(100);
			_tokensForThirdWinner = (_backlogAmountForDevelopers.mul(thirdWinnerPercentage)).div(100);
			return;
	}

	/// @notice Function to calculate token value per voter as per the backlog amount given for voters
	/// @param _backlogAmountForVoters Amount of token assigned to voters for a given backlog
	/// @param _totalVoters Number of total voters who voted for the given backlog
	/// @return _tokensPerVoter Amount of tokens reserved per voter
	function calculateVoterFunds(uint256 _backlogAmountForVoters,uint256 _totalVoters)
	private 
	returns (uint256 _tokensPerVoter)
	{
			_tokensPerVoter = _backlogAmountForVoters.div(_totalVoters);
			return;
	}


	/// @notice Function to check if given backlog id is a valid one
	/// @param _backlogId Backlog ID
	/// @return Bool value stating the validation of given backlog id
	function checkForBacklogExistence(uint256 _backlogId)
  	private
  	returns (bool)
  	{
  		bool value = false;
  		for(uint i=0; i<backlogIds.length; i++) {
  			if(backlogIds[i] == _backlogId) {
  				value = true;
  			}
  		}
  		return value;
  	}

 /* **************************************************************************************************************************
  *	Getter Methods
  */

	/// @notice Function to get array of backlog-Ids
	/// @return Array of Backlog-Ids
	function getBacklogIDs()
	view
	public
	returns(uint256[])
	{
			return backlogIds;	
	}


	/// @notice Function to fetch backlog details for a given backlog id
	/// @param _backlogId Backlog-Id for which details are required
	/// @return total tokens reserved for this backlog
	/// @return total voters count who voted for this backlog
	/// @return current status of the backlog
	function getBacklogID(uint256 _backlogId) 
	view
	public 
	returns (uint256, uint256, uint256) 
	{
    	    return (backlogId2backlogDetails[_backlogId].totalTokens, backlogId2backlogDetails[_backlogId].totalVoters, backlogId2backlogDetails[_backlogId].statusValue);
    }


    /// @notice Function to count total backlogs
    /// @return count of backlogs
    function countBacklogIds() 
    view 
    public 
    returns (uint) 
    {
 	       return backlogIds.length;
    }


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
    // TODO: Reggresive testing for gas exhaustion
}