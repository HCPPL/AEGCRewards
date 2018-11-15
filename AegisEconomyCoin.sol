pragma solidity ^0.4.24;

import "./contracts/math/SafeMath.sol";
import "./contracts/token/ERC20/ERC20Basic.sol";
import "./contracts/token/ERC20/BasicToken.sol";
import "./contracts/ownership/Ownable.sol";
import "./contracts/token/ERC20/ERC20.sol";
import "./contracts/token/ERC20/StandardToken.sol";
import "./contracts/token/ERC20/MintableToken.sol";

import "./BusinessAcc.sol";
import "./DevelopmentAcc.sol";


contract AegisEconomyCoin is StandardToken, Ownable, MintableToken {

    string  public  constant    name = "Aegis Economy Coin";
    string  public  constant    symbol = "AGEC";
    uint256 public  constant    decimals = 18;
    uint256 private constant    initialSupply = 50*(10**6)* (10**18);    // 50 million mintTokens //1500000 * (10**5);
    uint256 public              supplyPerDay;

    uint256 private             inflationPeriodStart;
    uint256 private             oneYearComplete;
    uint256 private             secondYearComplete;
    uint256 private             thirdYearComplete;
    uint256 private constant    inflationRateAfterOneYear = 1500;        // 15%
    uint256 private constant    inflationRateAfterTwoYears = 1250;       // 12.5%
    uint256 private constant    inflationRateAfterThreeYears = 1000;     // 10%
    
    uint256 private             releasedTokens;
  
    BusinessAcc public businessContract;           
    DevelopmentAcc public developmentContract;     

    uint public percentageForBusiness;
    uint public percentageForDevelopment;
    
    // Default Values: _percentageForBusiness = 50, _percentageForDevelopment = 50
    
    /// @author Gagandeep_HashCode
    /// @notice Contructor for initial setup
    /// @param _percentageForDevelopment Percentage value for Development contract
    /// @param _percentageForBusiness Percentage value for Business contract
    constructor(uint _percentageForDevelopment, uint _percentageForBusiness) 
    public 
    {
            require(_percentageForDevelopment != 0);
            require(_percentageForBusiness != 0);
            require (_percentageForBusiness.add(_percentageForDevelopment) == 100);

            owner                     = msg.sender;
            balances[msg.sender]      = initialSupply;
            totalSupply_              = initialSupply;
            supplyPerDay              = totalSupply_.div(365);//366 need to do
            // add pausable feature

            inflationPeriodStart      = now;
            oneYearComplete           = inflationPeriodStart.add(365 days);// need to be in varibale
            secondYearComplete        = oneYearComplete.add(365 days);
            thirdYearComplete         = secondYearComplete.add(365 days);

            percentageForDevelopment  = _percentageForDevelopment; 
            percentageForBusiness     = _percentageForBusiness;
    }


    // TODO: Add onlyAdmin modifier
    // TODO: Coin Minted HISTORY in coming phase
    /// @notice Function to mint new tokens and divide them between development and business contract
    function mintTokens(uint _timeLap) // function mintTokens()
    onlyOwner
    public 
    {
            // TODO: Will further call transferTokens() method to divide tokens between development and business
            
            uint256 amount = 0;
            uint256 currentTime = now.add(_timeLap);
            if (currentTime > oneYearComplete) {
                if (currentTime > secondYearComplete) {
                    if (currentTime > thirdYearComplete) {
                        amount = (supplyPerDay.mul(inflationRateAfterThreeYears)).div(10000);     // div(10000)
                    } else {
                        amount = (supplyPerDay.mul(inflationRateAfterTwoYears)).div(10000);       // div(10000)
                    }
                } else {
                    amount = (supplyPerDay.mul(inflationRateAfterOneYear)).div(10000);            // div(10000)
                }
            } else {
                revert();
            }
            require (amount != 0);
            mint(owner, amount); 
            creditContracts();
    }


    // TODO: To be called only once via business contract. Add bool 
    // require(msg.sender == BusinessAcc(msg.sender))
    function setBusinessAcc(address _address) // only owner
    public 
    {
            require(_address != address(0));
            businessContract = BusinessAcc(_address);
    }


    // TODO: To be called only once via development contract. Add bool 
    function setDevelopmentAcc(address _address)  // only owner
    public 
    {
            require(_address != address(0));
            developmentContract = DevelopmentAcc(_address);
    }


    // this method should not be called in constructor because businessContract and developmentContract are not set at that time
    /// @notice Private function which transfer tokens into development and business contracts
    function creditContracts() // private
    public 
    {
            uint256 tokensForDev;
            uint256 tokensForBusi;

            (tokensForDev, tokensForBusi) = calculateTokens(percentageForDevelopment, percentageForBusiness);
            
            transfer(businessContract, tokensForDev);
            transfer(developmentContract, tokensForBusi);

            // developmentContract.setDistributiveFigures();   // I think this is not required. Everything related to distributive figures will be handled within dev contract as there is no transfers required between there variables so setting these variable makes no sense
            // evoke a method in development contract to further divide the funds
    }


    /// @notice Function to convert percentage into number of tokens before transfering
    /// @param _percentageForDevelopment Percentage value of tokens for Development Contract
    /// @param _percentageForBusiness Percentage value of tokens for Business Contract
    /// @return _tokensForDev Number of tokens for development contract
    /// @return _tokensForBusi Number of tokens for business contract
    function calculateTokens(uint256 _percentageForDevelopment, uint256 _percentageForBusiness) 
    private
    returns(uint256 _tokensForDev, uint256 _tokensForBusi)
    {
            _tokensForDev = (supplyPerDay.mul(_percentageForDevelopment)).div(100);
            _tokensForBusi = (supplyPerDay.mul(_percentageForBusiness)).div(100);
            return;
    }
   

    /// @notice Wrapper function that will transfer funds from business contract to any address by owner
    /// @param _address Address of the receiver whom tokens to be sent
    /// @param _tokens Amount of tokens that is sent
    function transferTokensFromBusiness(address _address, uint256 _tokens) 
    // onlyOwner
    public 
    { 
            businessContract.transferTokens(_address, _tokens);  //  transferFrom(businessContract.address, _address, _tokens);
    }


    // function transferTokensFromBusinessToDevelopment() public { 
    //     // will send balance to respective accounts
    //     // will also invoke a method in development to futher distribute 50% 
    //     // possibly this method will be private
    // }


    // function transferTokensFromDevelopmentToBusiness() public { 
    //     // will send balance to respective accounts
    //     // will also invoke a method in development to futher distribute 50% 
    //     // possibly this method will be private
    // }


    // // TODO: add onlyAdmin modifier

    // /// @notice Function to update distributive figures between Development account and Business account
    // /// @param _percentageForDevelopment to add new percentage value for development
    // /// @param _percentageForBusiness to add new percentage value for business
    // function updateDistributiveFigures(uint _percentageForDevelopment, uint _percentageForBusiness) public {
    //     require (sum(_percentageForDevelopment,percentageForBusiness) == 100);               // developer% + business% = 100%
     
    //     percentageForDevelopment = _percentageForDevelopment;
    //     percentageForBusiness = _percentageForBusiness;
    // }

    // ============================== Getter Methods ==============================================

    /// @notice Function to fetch inflation rates 
    /// @return Inflation Rates that is set for 1st year, 2nd year and 3rd year onwards
    function getInflationRates() 
    public 
    view 
    returns(uint256, uint256, uint256) 
    {
            return (inflationRateAfterOneYear, inflationRateAfterTwoYears, inflationRateAfterThreeYears);      
    }

    
    /// @notice Function to fetch business contract address
    /// @return business contract address
    function getBusinessContract() 
    public 
    view 
    returns(address) 
    {
            return businessContract;      
    }


    /// @notice Function to fetch development contract address
    /// @return development contract address
    function getDevelopmentContract() 
    public 
    view 
    returns(address) 
    {
            return developmentContract;      
    }


    /// @notice Function to fetch tokens supply per day
    /// @return amount of tokens to be mint every day
    function getSupplyPerDay() 
    public 
    view 
    returns(uint256) 
    {
            return supplyPerDay; // TBDBD
    }

    // TBD: We can also check balance directly without creating wrapper functions

    /// @notice Function to fetch balance of Development contract 
    /// @return _balance Amount of tokens available in development contract 
    function getDevelopmentAccBalance() 
    public 
    view 
    returns (uint256 _balance) 
    {
            _balance = balanceOf(address(developmentContract));
            return; 
    }


    /// @notice Wrapper function to fetch balance of Business contract 
    /// @return _balance Amount of tokens available in business contract 
    function getBusinessAccBalance() 
    public 
    view 
    returns (uint256 _balance) 
    {
            _balance = balanceOf(address(businessContract));
            return;
    }


    function getDeveloperVoterPercentage()
    public
    view
    returns (uint256 _developer, uint256 _voter)
    {
            (_developer, _voter) = developmentContract.getDeveloperAndVoterPercentage();
            return;
    }


    function getWinnerPercentage()
    public
    view
    returns(uint256 _firstWinner, uint256 _secondWinner, uint256 _thirdWinner)
    {
            (_firstWinner, _secondWinner, _thirdWinner) = developmentContract.getWinnersPercentage();
            return;
    }


    // /// @notice Function to fetch balance available 
    // /// @return _balance Amount of tokens available 
    // function getBalance() public view returns (uint256 _balance) {
    //     _balance = balances[address(developmentContract)].sum(balances[address(businessContract)]);
    //     return;
    // }


    // /// @notice Function to fetch amount of tokens sold 
    // /// @return Amount of tokens sold
    // function getTotalTokensReleased() public view returns (uint256) {
    //     return releasedTokens;
    // }


    // /// @notice Function to fetch percentage that is set for Development purpose
    // /// @return percentage value that is set
    // function getPercentageForDevelopment() public view returns (uint) {
    //     return percentageForDevelopment;
    // }


    // /// @notice Function to fetch percentage that is set for Business purpose
    // /// @return percentage value that is set
    // function getPercentageForBusiness() public view returns (uint) {
    //     return percentageForBusiness;
    // }


    // // ================================================================================================
    
    // // possible security measures 

    // function updateBusinessContract(address _businessAcc) public {
    //     // need to understand the scope of this method
    //     businessContract = Business(_businessAcc);
    // }
   

    // function updateDevelopmentContract(address _DevelopmentAcc) public {
    //     // need to understand the scope of this method
    //     developmentContract = Development(_DevelopmentAcc);
    // }

}