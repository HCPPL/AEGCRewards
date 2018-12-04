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
    uint256 private constant    initialSupply =  50*(10**6)* (10**18);    // 50 million Tokens
    uint256 private             supplyPerDay;

    uint256 private             inflationYearOneStart;
    uint256 private             inflationYearTwoStart;
    uint256 private             inflationYearThreeStart;
    uint256 private             thirdYearComplete;
    uint256 private constant    inflationRateAfterOneYear = 1500;         // 15%         // TODO: Look if this can be avoided
    uint256 private constant    inflationRateAfterTwoYears = 1250;        // 12.5%
    uint256 private constant    inflationRateAfterThreeYears = 1000;      // 10%
    uint256 private constant    totalDaysInNonLeapYear = 365 days;
    
    uint256 private             releasedTokens;
    uint    private              percentageForBusiness;
    uint    private              percentageForDevelopment;  
    
    BusinessAcc    private       businessContract;           
    DevelopmentAcc private       developmentContract;     

    // TODO: Change owner address
    // TBD: add pausable feature???
    // TODO: Coin Minted HISTORY in coming phase
    
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
            supplyPerDay              = totalSupply_.div(365);
            inflationYearOneStart     = now;
            inflationYearTwoStart     = inflationYearOneStart.add(totalDaysInNonLeapYear); 
            inflationYearThreeStart   = inflationYearTwoStart.add(totalDaysInNonLeapYear);
            percentageForDevelopment  = _percentageForDevelopment; 
            percentageForBusiness     = _percentageForBusiness;
    }


    /// @notice Function to mint new tokens and divide them between development and business contract
    function mintTokens(uint _timeLap)                                 // IMPORTANT!! remove parameter!
    onlyOwner
    public 
    { 
            uint256 amount = 0;
            uint256 currentTime = now.add(_timeLap);                              // IMPORTANT!! remove .add(_timeLap)
            if (currentTime >= inflationYearOneStart) {                                            
                if (currentTime > inflationYearTwoStart) {                                            
                    if (currentTime > inflationYearThreeStart) {                                     
                        amount = (supplyPerDay.mul(inflationRateAfterThreeYears)).div(10000);   // 2 - 3 year and onwards
                    } else {                                                                    
                        amount = (supplyPerDay.mul(inflationRateAfterTwoYears)).div(10000);     // 1 - 2 year
                    }
                } else {
                    amount = (supplyPerDay.mul(inflationRateAfterOneYear)).div(10000);           // 0 - 1 year
                }
            } else {
                revert();                                                                       // < 0 year
            }
            require (amount != 0);
            mint(owner, amount);
            supplyPerDay = totalSupply_.div(365);
            creditContracts();
    }


    // TODO: Parameter should be contract address type
    /// @notice Function to link business contract
    /// @param _address Business Contract Address
    function setBusinessAcc(BusinessAcc _address) 
    onlyOwner
    public 
    {
            
            require (businessContract == address(0)); 
            require(_address != address(0));

            businessContract = _address;
    }


    // TODO: Parameter should be contract address type
    /// @notice Function to link development contract
    /// @param _address Development Contract Address
    function setDevelopmentAcc(DevelopmentAcc _address)  
    onlyOwner
    public 
    {
            require (developmentContract == address(0));  
            require(_address != address(0));
            require(DevelopmentAcc(_address) == _address);      // doesn't work

            developmentContract = _address;
    }
   

    /// @notice Wrapper function that will transfer funds from business contract to any address by owner
    /// @param _address Address of the receiver whom tokens to be sent
    /// @param _tokens Amount of tokens that is sent
    function transferTokensFromBusiness(address _address, uint256 _tokens) 
    onlyOwner
    public 
    { 
            require(_address != address(0));
            require(_tokens != 0);
            businessContract.transferTokens(_address, _tokens); 
    }

    /// @notice Wrapper function that will transfer funds from business contract to development contract by owner
    /// @param _tokens Amount of tokens that is sent
    function transferTokensFromBusinessToDevelopment(uint256 _tokens) 
    onlyOwner
    public 
    { 
            require(_tokens != 0);
            businessContract.transferTokens(address(developmentContract), _tokens);
    }

    /// @notice Wrapper function that will transfer funds from development contract to business contract by owner
    /// @param _tokens Amount of tokens that is sent
    function transferTokensFromDevelopmentToBusiness(uint256 _tokens) 
    onlyOwner
    public 
    { 
            require(_tokens != 0);
            developmentContract.transferTokens(address(businessContract), _tokens);
    }


    /// @notice Function to update distributive figures between Development account and Business account
    /// @param _percentageForDevelopment to add new percentage value for development
    /// @param _percentageForBusiness to add new percentage value for business
    function updateDistributiveFiguresOfAccounts(uint _percentageForDevelopment, uint _percentageForBusiness)
    onlyOwner
    public 
    {
        require(_percentageForDevelopment != 0);
        require(_percentageForBusiness != 0);
        require(_percentageForDevelopment.add(_percentageForBusiness) == 100);    // developer% + business% = 100%
     
        percentageForDevelopment = _percentageForDevelopment;
        percentageForBusiness = _percentageForBusiness;
    }


    // ==============================================================================================
    // Private Methods

    /// @notice Private function which transfer tokens into development and business contracts
    function creditContracts() 
    private 
    {
            uint256 tokensForDev;
            uint256 tokensForBusi;

            (tokensForDev, tokensForBusi) = calculateTokens(percentageForDevelopment, percentageForBusiness);
            
            transfer(businessContract, tokensForDev);
            transfer(developmentContract, tokensForBusi);
            developmentContract.creditRemainingTokens(tokensForDev);
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

    // ============================== Getter Methods ==============================================


    /// @notice Function to fetch current contract address 
    /// @return aegisEconomyCoin contract address
    function getContractAddr() 
    public 
    view 
    returns(address) 
    {
            return address(this);      
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
            return supplyPerDay;
    }

    /// @notice Function to fetch percentage that is set for Development and Business purpose
    /// @return percentage value that is set
    function getPercentageForDevelopmentAndBusiness() 
    public 
    view 
    returns (uint, uint) 
    {
            return (percentageForDevelopment, percentageForBusiness);
    }


    function getOwner()
    public
    view
    returns (address)
    {
            return owner;
    }


    function getInflationPeriodInDays() 
    public
    view
    returns (uint256, uint256, uint256)
    {
            return (inflationYearOneStart, inflationYearTwoStart, inflationYearThreeStart);
    }

}