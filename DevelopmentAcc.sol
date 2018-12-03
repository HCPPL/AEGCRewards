pragma solidity ^0.4.24;

import "./contracts/ownership/Ownable.sol";
import "./AegisEconomyCoin.sol";
import "./contracts/math/SafeMath.sol";

contract DevelopmentAcc is Ownable {	

 	using SafeMath for uint256;

 	AegisEconomyCoin private aegisCoin;
 	uint256          private developersFundPercentage; 
 	uint256          private votersFundPercentage;  	
 	uint256          private firstWinnerPercentage; 
 	uint256          private secondWinnerPercentage; 
 	uint256          private thirdWinnerPercentage; 
 	uint256          private totalTokensReserved;
 	uint256          private remainingTokensForBacklog;


 	/* *********
 	 * MODIFIERS
 	 */

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

  	/// Modifier to check if backlogId is valid
  	modifier ifBacklogNotExisted(uint256 _backlogId) {
  		bool value = checkForBacklogExistence(_backlogId);
  		require(value == false);
  		_;
  	}

  	// /// Modifier to check if status is in submission state
  	// modifier ifBacklogInSubmissionState(uint256 _backlogId) {
  	// 	bool value = checkStatus(_backlogId);
  	// 	require(value == true);
  	// 	_;
  	// }
 	

	/* ******
	 * EVENTS
	 */

  	event SuccessfulAdditionOfNewBacklog(uint256 _backlogId, uint256 _tokens);
  	event SuccessfulUpdateOfBacklog(uint256 _backlogId, uint256 _tokens);
  	event SuccessfulDeletionOfBacklog(uint256 _backlogId);
  	event SuccessfulTokensTransferToWinners(uint256 _backlogId);
  	event SuccessfulTokensTransferToVoters(uint256 _backlogId);

	
	/// @author Gagandeep_HashCode
    /// @notice Contructor for initial setup
	constructor (AegisEconomyCoin _address, 
		uint256 _devPercentage, 
		uint256 _voterPercentage, 
		uint256 _firstWinnerPer, 
		uint256 _secondWinnerPer, 
		uint256 _thirdWinnerPer) 
	{
		// Pending: check for : address should be of type contract address

			require(_address != address(0));
			require(_devPercentage != 0);
			require(_voterPercentage != 0);
			require(_devPercentage.add(_voterPercentage) == 100);
			require(_firstWinnerPer != 0);
			require(_secondWinnerPer != 0);
			require(_thirdWinnerPer != 0);
			require(_firstWinnerPer.add(_secondWinnerPer.add(_thirdWinnerPer)) == 100);

			aegisCoin = _address;
			totalTokensReserved = 0;
			remainingTokensForBacklog = 0;
			setDeveloperVoterPercentage(_devPercentage, _voterPercentage);
			setWinnersPercentage(_firstWinnerPer, _secondWinnerPer, _thirdWinnerPer);
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

	function creditRemainingTokens(uint256 _tokens)
	onlyAdmin
	public
	{
			remainingTokensForBacklog = remainingTokensForBacklog.add(_tokens);
	}

    /* ***************************************************************************************
    		Status Value: 

			0 : not started				// backlog is approved by admin and is waiting for the arrival of backlog start date
			1 : submission-started		// backlog submission period started
			2 : submission-completed	// backlog submission period ended
 			3 : voting-started			// backlog voting period started
 			4 : voting-ended 			// backlog voting period ended	
			5 : close				    // backlog winners and reviewers are paid
        	6 : cancelled/deleted	    // backlog cancelled
     */

	struct backlogDetails {
        uint256 totalTokens;
        uint256 totalVoters;
		uint256 statusValue;	// will have only 7 values set here	
		uint256 tokensPerVoter;
	}
	
	mapping (uint256 => backlogDetails) private backlogId2backlogDetails;
	uint256[] private backlogIds;


	/// @notice Function to record a new backlog
	/// @param _backlogId Backlog ID 
	/// @param _tokens Amount of tokens to be reserved for the given backlog id
	function addNewBacklog(uint256 _backlogId, uint256 _tokens) 
	onlyOwner
	ifBacklogNotExisted(_backlogId)
	public
	{
		require(_backlogId != 0);
		require(_tokens != 0);
		require(_tokens <= remainingTokensForBacklog); 

		// pushing new backlog id to backlog-ids array
		backlogDetails backlogId = backlogId2backlogDetails[_backlogId];
		// adding new record to backlog struct
		backlogId.totalTokens = _tokens;
		backlogId.totalVoters = 0;
		backlogId.statusValue = 0;
		backlogId.tokensPerVoter = 0;
		backlogIds.push(_backlogId)-1;
		// set reserved value and other variables here
		totalTokensReserved = totalTokensReserved.add(_tokens);
		remainingTokensForBacklog = remainingTokensForBacklog.sub(_tokens);
		SuccessfulAdditionOfNewBacklog(_backlogId, _tokens);
	}


	/// @notice Function to delete a particular backlog
	/// @dev This function will not remove it completely but will reset the values to 0 and will set status to deleted
	/// @param _backlogId Backlog-id for which you want to delete the details
	function deleteBacklog(uint256 _backlogId) 
	onlyOwner
	ifBacklogExisted(_backlogId)
	public
	{
		require(_backlogId != 0);
		require(backlogId2backlogDetails[_backlogId].statusValue != 5);		// 5: closed

		uint256 tokenAmt = backlogId2backlogDetails[_backlogId].totalTokens;
		// release reserved tokens
		totalTokensReserved = totalTokensReserved.sub(tokenAmt);
		remainingTokensForBacklog = remainingTokensForBacklog.add(tokenAmt);
		// update backlog details
		backlogId2backlogDetails[_backlogId].totalTokens = 0;
		backlogId2backlogDetails[_backlogId].totalVoters = 0;
		backlogId2backlogDetails[_backlogId].statusValue = 6;	//6: deleted
		SuccessfulDeletionOfBacklog(_backlogId);
	}


	/// @notice Function to update an existing backlog
	/// @param _backlogId Backlod ID
	/// @param _tokens New amount of tokens to be reserved for given backlog id 
	function updateBacklogAmount(uint256 _backlogId, uint256 _tokens) 
	onlyOwner
	ifBacklogExisted(_backlogId)		
	public
	{
		require(_backlogId != 0);
		require(_tokens != 0);
		require(backlogId2backlogDetails[_backlogId].statusValue >= 0);
		require(backlogId2backlogDetails[_backlogId].statusValue < 2);	// allow status == 0 (not started); status == 1 (submission period)
		require(backlogId2backlogDetails[_backlogId].totalVoters == 0);	// TBD: probably not required as when in submission state; total voters will be 0

		uint256 newTokens      = 0;
		uint256 newTotalTokens = 0; 
		backlogDetails backlogId = backlogId2backlogDetails[_backlogId];
		uint256 tokens = backlogId.totalTokens;
		// to subtract the previous token value from total
		totalTokensReserved = totalTokensReserved.sub(tokens);
		remainingTokensForBacklog = remainingTokensForBacklog.add(tokens);		
		if(tokens < _tokens) {
				newTokens = _tokens.sub(tokens);
		} else {
			    newTokens = tokens.sub(_tokens);
		}
		newTotalTokens = tokens.add(newTokens);
		// update backlog details
		backlogId.totalTokens = newTotalTokens;
		// to add the new calculated tokens to be reserved to total
		totalTokensReserved = totalTokensReserved.add(newTotalTokens);
		remainingTokensForBacklog = remainingTokensForBacklog.sub(newTotalTokens);
		SuccessfulUpdateOfBacklog(_backlogId, _tokens);
	}


	/// @notice Function to release tokens to winners for complete backlog
	/// @param _backlogId Backlog-ID
	/// @param _firstWinner Address of first winner
	/// @param _secondWinner Address of second winner
	/// @param _thirdWinner Address of third winner
	/// @param _totalVoters Number of total voters
	function releaseTokensToWinnersForCompleteBacklog(uint256 _backlogId,
	    address _firstWinner, 
		address _secondWinner, 
		address _thirdWinner,
		uint256 _totalVoters)	
	onlyOwner
	ifBacklogExisted(_backlogId)	
	public 
	{
			require(_backlogId != 0);
			require(_firstWinner != 0);
			require(_secondWinner != 0);
			require(_thirdWinner != 0);
			require(_totalVoters != 0);
			require(backlogId2backlogDetails[_backlogId].totalTokens <= totalTokensReserved);
			require(backlogId2backlogDetails[_backlogId].statusValue == 4);		// 4: voting ended
			require(backlogId2backlogDetails[_backlogId].totalVoters == 0); 			
			require(backlogId2backlogDetails[_backlogId].tokensPerVoter == 0); 			
			
			uint256 tokensForDevelopers;
			uint256 tokensForVoters;
			uint256 tokensForFirstWinner;
			uint256 tokensForSecondWinner;
			uint256 tokensForThirdWinner;
			(tokensForDevelopers, tokensForVoters) = calculateFunds(backlogId2backlogDetails[_backlogId].totalTokens);
			(tokensForFirstWinner, tokensForSecondWinner, tokensForThirdWinner) = calculateWinnerFunds(tokensForDevelopers);
			backlogId2backlogDetails[_backlogId].tokensPerVoter = calculateVoterFunds(tokensForVoters, _totalVoters);
			// transfer funds
			aegisCoin.transfer(_firstWinner, tokensForFirstWinner);
			aegisCoin.transfer(_secondWinner, tokensForSecondWinner);
			aegisCoin.transfer(_thirdWinner, tokensForThirdWinner);
			// update reserved tokens
            totalTokensReserved = totalTokensReserved.sub(tokensForFirstWinner.add(tokensForSecondWinner.add(tokensForThirdWinner)));
            SuccessfulTokensTransferToWinners(_backlogId); 
	} 


	/// @notice Function to transfer tokens to Voters for given backlog-id
	/// @dev As backlog-Id is mapped with tokensPerVoter. We need not to recalculate or pass it from php. This will be handled withing the smart contract
	/// @param _backlogId Backlog-Id 
	/// @param _voters Array of voter addresses
	function releaseTokensForVoters(uint256 _backlogId, address[] _voters)  
	ifBacklogExisted(_backlogId)
	public
	{
			require(_backlogId != 0);
			require (_voters.length != 0);
			require(_voters.length <= 20);
			require(backlogId2backlogDetails[_backlogId].statusValue == 4); 

			address[] memory voters = _voters;
			uint256 tokens = backlogId2backlogDetails[_backlogId].tokensPerVoter;
			// transfer to voters
			for(uint i=0; i < voters.length; i++) {
					aegisCoin.transfer(voters[i], tokens);
			}
			// update reserved tokens
			totalTokensReserved = totalTokensReserved.sub(tokens.mul(voters.length));
			//update status to successfully paid and now closed
			backlogId2backlogDetails[_backlogId].statusValue = 5;
			SuccessfulTokensTransferToVoters(_backlogId); 
	}


	/// @notice Wrapper Function to update distributive percentage figures for developers and voters
	/// @param _devPercentage Percentage value for developers
	/// @param _voterPercentage Percentage value for voters
	function updateDeveloperVoterPercentage(uint256 _devPercentage, uint256 _voterPercentage) 
	onlyOwner
	public 
	{
			require (_devPercentage != 0);
			require (_voterPercentage != 0);
        	require (_devPercentage.add(_voterPercentage) == 100); 		
			setDeveloperVoterPercentage(_devPercentage, _voterPercentage);
	}


	/// @notice Function to update distributive percentage figures for first, second and third winners
	/// @param _firstWinnerPer Percentage value for first winner
	/// @param _secondWinnerPer Percentage value for second winner
	/// @param _thirdWinnerPer Percentage value for third winner
	function updateWinnersPercentage(uint256 _firstWinnerPer,
	    uint256 _secondWinnerPer,
	    uint256 _thirdWinnerPer) 
	onlyOwner
	public 
	{
			require (_firstWinnerPer != 0);
			require (_secondWinnerPer != 0);
			require (_thirdWinnerPer != 0);
            require ( _firstWinnerPer.add(_secondWinnerPer.add(_thirdWinnerPer)) == 100); 
			setWinnersPercentage(_firstWinnerPer, _secondWinnerPer, _thirdWinnerPer);
	}


	/// @notice Function to update the status value for given backlog-id
	/// @param _backlogId Backlog ID
	/// @param _statusValue Status Value in uint256
	/// @return Return with bool value as true if update is a success else otherwise
	function setBacklogStatus(uint256 _backlogId, uint256 _statusValue) 
	onlyOwner
	ifBacklogExisted(_backlogId)
	public
	// returns (bool)
	{
			require(_backlogId != 0);
			require(_statusValue != 5);
			require(_statusValue >= 0);
			require(_statusValue <= 6);


			// *** TBD ***

			// not started (0) 
			// 		cannot be set to submission ended(2), voting start(3), end(4), close(5)
			//		can be set to deleted(6), submission started (1)

			// started (1)
			// 		cannot be set to not started (0), voting started(3), voting ended (4), close(5)
			//		can be set to deleted (6), submission ended (2)


			// submission ended (2)
			// 		cannot be set to not started (0), voting ended (4), close(5)
			//		can be set to deleted (6), voting started(3)


			// voting started (3)
			// 		cannot be set to not started (0), started (1), ended (2), close(5)
			//		can be set to deleted (6), voting ended (4)


			// voting ended (4)
			// 		cannot be set to not started (0), started (1), ended (2), voting started(3), close(5)
			//		can be set to deleted (6) - tbd


			// closed (5)
			// 		cannot be set to any


			// deleted (6)
			// 		cannot be set to any

			require(backlogId2backlogDetails[_backlogId].statusValue != 5); // can't set status to any if successfully paid
			require(backlogId2backlogDetails[_backlogId].statusValue >= 0); // 0 <= status value <= 6
			require(backlogId2backlogDetails[_backlogId].statusValue <= 6); // 0 <= status value <= 6
			backlogId2backlogDetails[_backlogId].statusValue = _statusValue;
			// return true;
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
			votersFundPercentage     = _voterPercentage;
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
			firstWinnerPercentage  = _firstWinnerPer;
			secondWinnerPercentage = _secondWinnerPer;
			thirdWinnerPercentage  = _thirdWinnerPer;
	}


	/// @notice Function to calculate token value for developers and voters as per the backlog amount given
	/// @param _backlogAmount Amount of token assigned to the given backlog
	/// @return _tokensForDev Amount of tokens reserved for developers
	/// @return _tokensForVoters Amount of tokens reserved for voters
	function calculateFunds(uint256 _backlogAmount)
	private
	returns (uint256 _tokensForDev, uint256 _tokensForVoters) 
	{
			_tokensForDev    = (_backlogAmount.mul(developersFundPercentage)).div(100);
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
			_tokensForFirstWinner  = (_backlogAmountForDevelopers.mul(firstWinnerPercentage)).div(100);
			_tokensForSecondWinner = (_backlogAmountForDevelopers.mul(secondWinnerPercentage)).div(100);
			_tokensForThirdWinner  = (_backlogAmountForDevelopers.mul(thirdWinnerPercentage)).div(100);
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


	/// @notice Function to fetch backlog details for a given backlog Id
	/// @param _backlogId Backlog-Id for which details are required
	/// @return total tokens reserved for this backlog
	/// @return total voters count who voted for this backlog
	/// @return current status of the backlog
	function getBacklogIDDetails(uint256 _backlogId) 
	view
	public 
	returns (uint256, uint256, uint256, uint256) 
	{
    	    return (backlogId2backlogDetails[_backlogId].totalTokens, backlogId2backlogDetails[_backlogId].totalVoters, backlogId2backlogDetails[_backlogId].statusValue, backlogId2backlogDetails[_backlogId].tokensPerVoter);
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
    view
    public
    returns (uint256, uint256)
    {
    		return(developersFundPercentage, votersFundPercentage); 
 	}


 	/// @notice Function to fetch percentage distribution set for winners
 	/// @return Percentage set for first winner
 	/// @return Percentage set for second winner
 	/// @return Percentage set for third winner
 	function getWinnersPercentage()
 	view
 	public
 	returns(uint256, uint256, uint256)
 	{
 			return(firstWinnerPercentage, secondWinnerPercentage, thirdWinnerPercentage); 
    }

    function getBacklogStatus(uint256 _backlogId)
	view
	public
	returns (uint256)
	{
			return backlogId2backlogDetails[_backlogId].statusValue;
	}

	function getAegisCoinContractAddress()
	view
	public
	returns (address)
	{
			return aegisCoin;
	}

	function getTotalReservedTokens()
	view
	public
	returns (uint256)
	{
			return totalTokensReserved;
	}


    function getRemainingTokens()
	view
	public
	returns (uint256)
	{
			return remainingTokensForBacklog;
	}


	function getBoolForBacklogExistence(uint256 _backlogId)
  	view
  	public
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

    // Our service to check if gas is exhausted or not. There should be enough ethers to execute all the method calls that are inline.
    // TODO: Reggresive testing for gas exhaustion
}

// TBD
// function to check if winners are paid or not
// function to check if voters are paid or not
// function to check which backlogs have pending transactions to voters