const AegisCoin = artifacts.require("AegisEconomyCoin");
const BusinessAcc = artifacts.require("BusinessAcc");
const DevelopmentAcc = artifacts.require("DevelopmentAcc");

contract('AegisEconomyCoin', async (accounts) => {
  let tryCatch = require("./exceptions.js").tryCatch;
  let errTypes = require("./exceptions.js").errTypes;

    let aegisCoinContract;
    let businessContract;
    let developmentContract;
    let deployerAddress = accounts[0];
    let dayInSeconds = 86400;

    let totalSupply = 50*(10**6)* (10**18);

    let developementPercentage = 50;
    let voterPercentage = 50;
    let firstWinnerPercentage = 50;
    let secondWinnerPercentage = 35;
    let thirdWinnerPercentage = 15;

    let firstYearInflationRate = 15;
    let secondYearInflationRate = 12.5;
    let thirdYearInflationRate = 10;
              
    const null_address = '0x0000000000000000000000000000000000000000';   
    const BigNumber = web3.BigNumber;

      
        // ============================================================================================================
        // 1. TEST CASES FOR INITIAL

        // When Percentage for Development is set to 0
        it('Case 1.1 : Should revert if 0% is given to percentage for Development ', async () => {
              aegisCoinContract = await tryCatch(AegisCoin.new(0, 50, {from: deployerAddress}), errTypes.revert); 
        });

        // When Percentage for Business is set to 0
        it('Case 1.2 : Should revert if 0% is given to percentage for Business ', async () => {
              aegisCoinContract = await tryCatch(AegisCoin.new(50, 0, {from: deployerAddress}), errTypes.revert); 
        });

        // When Percentage sum does not come upto 100%
        it('Case 1.3 : Should revert if sum of parametric percentage values does not come upto 100%', async () => {
              aegisCoinContract = await tryCatch(AegisCoin.new(40, 80, {from: deployerAddress}), errTypes.revert); 
        });

        // Initial setup positive scenario: check for initial balance setup
        it('Case 1.4 : Initialization Positive Scenario: check for initial balance setup ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let test_totalSupply = await aegisCoinContract.totalSupply();
              let test_owner_bal = await aegisCoinContract.balanceOf(deployerAddress);
              let test_supplyPerDay = await aegisCoinContract.getSupplyPerDay(); 
              
              assert.equal(test_totalSupply.valueOf(), totalSupply, "Owner balance should be equal to " + totalSupply);
              assert.equal(test_owner_bal.valueOf(), totalSupply, "Owner balance should be equal to " + totalSupply);
              assert.equal(test_supplyPerDay, totalSupply/365, "Owner's address should be equal to " + deployerAddress);	
        });

        // check for addresses setup
        it('Case 1.5 : Initialization Positive Scenario: check for addresses setup ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              let test_owner_addr = await aegisCoinContract.getOwner();
              let test_businessContract = await aegisCoinContract.getBusinessContract();
              let test_developmentContract = await aegisCoinContract.getDevelopmentContract();
              
              assert.equal(test_businessContract, businessContract.address, "Business Contract is not set to " + businessContract); 
              assert.equal(test_developmentContract, developmentContract.address, "Development Contract is not set to " + developmentContract); 
              assert.equal(test_owner_addr, deployerAddress, "Owner's address should be equal to " + deployerAddress);  
        });

        // // Need to work upon assert equal. research how to fetch current time in js so to match with inflation start date
        // // check for inflation rate setup
        // it('Case 1.6 : Initialization Positive Scenario: check for inflation rate setup ', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
        //       await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
        //       let test_inflationDatesInDays = await aegisCoinContract.getInflationPeriodInDays();
        //       let inflationYearOneStartDate = test_inflationDatesInDays[0];                         // need to fetch current time here
        //       let inflationYearTwoStartDate = inflationYearOneStartDate + 365*24*60*60;         // recheck calculations
        //       let inflationYearThreeStartDate = inflationYearTwoStartDate + 365*24*60*60; 

        //       assert.equal(test_inflationDatesInDays[0].valueOf(), inflationYearOneStartDate, "Year One should start in "+inflationYearOneStartDate+ " days"); 
        //       assert.equal(test_inflationDatesInDays[1].valueOf(), inflationYearTwoStartDate, "Year Two should start in "+ inflationYearTwoStartDate + " days"); 
        //       assert.equal(test_inflationDatesInDays[2].valueOf(), inflationYearThreeStartDate, "Year Three Should start in "+ inflationYearThreeStartDate + " days");  
        // });


        // check for percentage setup
        it('Case 1.7 : Initialization Positive Scenario: check for percentage setup ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let test_percentage = await aegisCoinContract.getPercentageForDevelopmentAndBusiness();

              assert.equal(test_percentage[0], 50, "Development percentage did not matched!"); 
              assert.equal(test_percentage[1], 50, "Business Percentage did not matched!");   
        });


        // Initial setup positive scenario according to script run
        it('Case 1.5 : Initialization ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // let totalSupply = await aegisCoinContract.totalSupply();
              let owner_bal = await aegisCoinContract.balanceOf(deployerAddress);
              let businessContract_bal = await aegisCoinContract.balanceOf(businessContract.address);
              let developmentContract_bal = await aegisCoinContract.balanceOf(developmentContract.address);
              
              // console.log("\n Total Supply initialized ==> ", totalSupply.valueOf()); 
              console.log("\n Balance of Owner/Deployer Address ==> ", owner_bal.valueOf());  
              console.log("\n BusinessAcc Balance ==> ", businessContract_bal);  
              console.log("\n DevelopmentAcc Balance ==> ", developmentContract_bal);

        });


        //============================================================================================================
        // 2. TEST CASES FOR MINTING METHOD

        // Time Period: Year 1 - Year 2
        it('Case 2.1 : Should pass with 15% of inflation rate if called between year 1-2 ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let init_supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              let developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);
             
              await aegisCoinContract.mintTokens(0);

              let test_totalSupply = await aegisCoinContract.totalSupply();
              let expected_totalSupply = totalSupply + (init_supplyPerDay.valueOf()*0.15);
              let test_supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let expected_supplyPerDay = expected_totalSupply / 365;

              let test_businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              let test_developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);
              let expected_businessAccBalance = +businessAccBalance + +(test_supplyPerDay*0.50);
              let expected_developmentAccBalance = +developmentAccBalance.valueOf() + +(test_supplyPerDay.valueOf()*0.50);

              assert.equal(test_businessAccBalance.valueOf(), expected_businessAccBalance, "business balance did not matched");
              assert.equal(test_developmentAccBalance.valueOf(), expected_developmentAccBalance, "development balance did not matched");
              assert.equal(test_totalSupply, expected_totalSupply, "15% of the totalSupply should be added");
              assert.equal(test_supplyPerDay, expected_supplyPerDay, "Supply per day should be set according to new total supply");
        });

        // // NEED TO WORK ON FIRST TWO ASSERTS
        // // Time Period: Year 2 - Year 3
        // it('Case 2.2 : Should pass with 12.5% of inflation rate if called between year 2-3', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
        //       await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
        //       let init_supplyPerDay = await aegisCoinContract.getSupplyPerDay();

        //       await aegisCoinContract.mintTokens(0);
        //       let newTotalSupply = await aegisCoinContract.totalSupply();
        //       let newSupplyPerDay = await aegisCoinContract.getSupplyPerDay();
        //       let businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
        //       let developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);

        //       await aegisCoinContract.mintTokens(380*dayInSeconds);
        //       let test_totalSupply = await aegisCoinContract.totalSupply();
        //       let expected_totalSupply = +newTotalSupply.valueOf()+ +(newSupplyPerDay.valueOf()*0.125); 
        //       let test_supplyPerDay = await aegisCoinContract.getSupplyPerDay();
        //       let expected_supplyPerDay = expected_totalSupply.valueOf()/365;

        //       let test_businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
        //       let test_developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);
        //       let expected_businessAccBalance = +businessAccBalance.valueOf() + +(test_supplyPerDay.valueOf()*0.50);
        //       let expected_developmentAccBalance = +developmentAccBalance.valueOf() + +(test_supplyPerDay.valueOf()*0.50);

        //       // assert.equal(test_businessAccBalance.valueOf(), expected_businessAccBalance, "business balance did not matched");
        //       // assert.equal(test_developmentAccBalance.valueOf(), expected_developmentAccBalance, "development balance did not matched");
        //       assert.equal(test_totalSupply, expected_totalSupply, "12.5% of the totalSupply should be added");
        //       assert.equal(test_supplyPerDay, expected_supplyPerDay, "Supply per day should be set according to new total supply");
        // });

        // // ALSO NEED TO ADD BUSI/DEV BALANCE CHECK
        // // Need to look into the calculations for assert statement checks
        // // Time Period: Year 3 onwards
        // it('Case 2.3 : Should pass with 10% of inflation rate if called after 3 years', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
        //       await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
        //       let init_supplyPerDay = await aegisCoinContract.getSupplyPerDay();

        //       await aegisCoinContract.mintTokens(0);
        //       await aegisCoinContract.mintTokens(380*dayInSeconds);
        //       let newTotalSupply = await aegisCoinContract.totalSupply();
        //       let newSupplyPerDay = await aegisCoinContract.getSupplyPerDay();

        //       await aegisCoinContract.mintTokens(2*380*dayInSeconds);
        //       let test_totalSupply = await aegisCoinContract.totalSupply();
        //       let expected_totalSupply = +newTotalSupply.valueOf()+ +(newSupplyPerDay.valueOf()*0.10);
        //       let test_supplyPerDay = await aegisCoinContract.getSupplyPerDay();
        //       let expected_supplyPerDay = expected_totalSupply.valueOf()/365;
        //       console.log("test_supplyPerDay: ", test_supplyPerDay);
        //       assert.equal(test_totalSupply.valueOf(), expected_totalSupply.valueOf(), "10% of the totalSupply should be added");
        //       assert.equal(test_supplyPerDay.valueOf(), expected_supplyPerDay, "Supply per day should be set according to new total supply");
        // });

        // Should revert when not called by owner
        it('Case 2.4 : Should pass with 15% of inflation rate if called between year 1-2 ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await tryCatch(aegisCoinContract.mintTokens(0, {from: accounts[1]}), errTypes.revert);
        });

        // =============================================================================================================
        // 3. setBusinessAcc

        // Should revert if not called by Onwer
        it('Case 3.1 : setBusinessAcc: Should revert if not called by Onwer', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              
              await tryCatch(aegisCoinContract.setBusinessAcc(businessContract.address, {from: accounts[2]}), errTypes.revert);
        });

        // // Pending
        // // Should revert if parametric value is not of business contract type
        // it('Case 3.2 : Should revert if parametric value is not of business contract type', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              
        //       await tryCatch(aegisCoinContract.setBusinessAcc(accounts[2], {from: deployerAddress}), errTypes.revert);
        // });

        // Should pass when called by owner
        it('Case 3.3 : setBusinessAcc: Should pass when called by owner', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              let test_businessAddr = await aegisCoinContract.getBusinessContract();           
              assert.equal(test_businessAddr, businessContract.address);
        });

        // Should throw revert if already set
        it('Case 3.4 : setBusinessAcc: Should revert if already set', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});               
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await tryCatch(aegisCoinContract.setBusinessAcc(businessContract.address), errTypes.revert);
        });

        // Should revert if address is a null address
        it('Case 3.5 : setBusinessAcc: Should revert if address in parameter is a null_address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});               
              await tryCatch(aegisCoinContract.setBusinessAcc(null_address), errTypes.revert);
        });


        // =============================================================================================================
        // 4. setDevelopmentAcc

        // Should revert if not called by Onwer
        it('Case 4.1 : Should revert if not called by Onwer', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});
              await tryCatch(aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: accounts[2]}), errTypes.revert);
        });

        // // Pending
        // // Should revert if parametric value is not of development contract type
        // it('Case 4.2 : Should revert if parametric value is not of development contract type', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});        
        //       await tryCatch(aegisCoinContract.setDevelopmentAcc(accounts[2], {from: deployerAddress}), errTypes.revert);
        // });

        // Should revert if already set
        it('Case 4.3 : Should revert if already set', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});               
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              await tryCatch(aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress}), errTypes.revert);
        });

        // Should revert if null address is passed
        it('Case 4.4 : Should revert if null address is passed', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});               
              await tryCatch(aegisCoinContract.setDevelopmentAcc(null_address, {from: deployerAddress}), errTypes.revert);
        });

        // Should pass if called by owner
        it('Case 4.5 : Should pass if called by owner', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress});               
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address);
              let test_developmentAddr = await aegisCoinContract.getDevelopmentContract();

              assert.equal(test_developmentAddr, developmentContract.address, "Development Account Address did not matched"); 
        });

        // =============================================================================================================
        // 5. transferTokensFromBusiness

        // positive scenario
        it('Case 5.1 : transfer tokens from business to any address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);
              let businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              await aegisCoinContract.transferTokensFromBusiness(accounts[1], 3000);
              let test_businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              let test_acc1Balance = await aegisCoinContract.balanceOf(accounts[1]);
              let expected_businessAccBalance = +businessAccBalance+ +3000;
              let expected_acc1Balance = 3000;

              assert.equal(test_businessAccBalance, expected_businessAccBalance, "Business Account Balance did not matched!");
              assert.equal(test_acc1Balance, expected_acc1Balance, "Account 1 Balance did not matched!");
        });

        // should revert if passing address is a null address
        it('Case 5.2 : transfer tokens from business to any address should revert if passing address is a null address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);
              await tryCatch(aegisCoinContract.transferTokensFromBusiness(null_address, 3000), errTypes.revert);
        });

        // should revert if passing tokens is a null value
        it('Case 5.3 : transfer tokens from business to any address should revert if passing tokens is a null value', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);
              await tryCatch(aegisCoinContract.transferTokensFromBusiness(accounts[1], 0), errTypes.revert);
        });

        // should revert if not called by onwer
        it('Case 5.4 : transfer tokens from business to any address should revert if not called by onwer', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);
              await tryCatch(aegisCoinContract.transferTokensFromBusiness(accounts[1], 10000, {from: accounts[2]}), errTypes.revert);
        });

        // =============================================================================================================
        // 6. transferTokensFromBusinessToDevelopment

        // positive scenario
        it('Case 6.1 : transfer tokens from business to development', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);
              
              let businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              let developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);

              await aegisCoinContract.transferTokensFromBusinessToDevelopment(3000);
              
              let test_businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              let test_developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);
              let expected_businessAccBalance = +businessAccBalance.valueOf()+ +3000;
              let expected_developmentAccBalance = +developmentAccBalance.valueOf()+ +3000;
           
              assert.equal(test_businessAccBalance, expected_businessAccBalance, "Business Account Balance did not matched!");
              assert.equal(test_developmentAccBalance, expected_developmentAccBalance, "Development Account Balance did not matched!");
        });

        // should not pass if not called by owner
        it('Case 6.2 : transfer tokens from business to development: should revert when not called by owner', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);
              
              await tryCatch(aegisCoinContract.transferTokensFromBusinessToDevelopment(3000, {from: accounts[2]}), errTypes.revert);
        });

        // should not pass if token value is zero
        it('Case 6.3 : transfer tokens from business to development: should revert token value is zero', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);
              
              await tryCatch(aegisCoinContract.transferTokensFromBusinessToDevelopment(0), errTypes.revert);
        });

        // =============================================================================================================
        // 7. transferTokensFromDevelopmentToBusiness

        // positive scenario
        it('Case 7.1 : transfer tokens from development to business', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);

              let businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              let developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);

              await aegisCoinContract.transferTokensFromDevelopmentToBusiness(3000);
              
              let test_businessAccBalance = await aegisCoinContract.balanceOf(businessContract.address);
              let test_developmentAccBalance = await aegisCoinContract.balanceOf(developmentContract.address);
              let expected_businessAccBalance = +businessAccBalance.valueOf()+ +3000;
              let expected_developmentAccBalance = +developmentAccBalance.valueOf()+ +3000;
           
              assert.equal(test_businessAccBalance, expected_businessAccBalance, "Business Account Balance did not matched!");
              assert.equal(test_developmentAccBalance, expected_developmentAccBalance, "Development Account Balance did not matched!");
        });

        // should revert if not called by owner
        it('Case 7.2 : transfer tokens from development to business should revert if not called by owner', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);

              await tryCatch(aegisCoinContract.transferTokensFromDevelopmentToBusiness(3000, {from: accounts[2]}), errTypes.revert);
        });

        // should revert if token value is 0
        it('Case 7.3 : transfer tokens from development to business should revert if token value is 0', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);

              await tryCatch(aegisCoinContract.transferTokensFromDevelopmentToBusiness(0), errTypes.revert);
        });

        // =============================================================================================================
        // 8. updateDistributiveFiguresOfAccounts

        // updateDistributiveFiguresOfAccounts - Positive
        it('Case 8.1 : updateDistributiveFiguresOfAccounts', async() => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.updateDistributiveFiguresOfAccounts(30,70, {from: deployerAddress});

              let test_percentage = await aegisCoinContract.getPercentageForDevelopmentAndBusiness();
              
              assert.equal(test_percentage[1].valueOf(), 70, "Business percentage did not matched ");
              assert.equal(test_percentage[0].valueOf(), 30, "Development percentage did not matched ");
        });

        // updateDistributiveFiguresOfAccounts - onlyOwner
        it('Case 8.2 : updateDistributiveFiguresOfAccounts should revert when not called by owner', async() => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await tryCatch(aegisCoinContract.updateDistributiveFiguresOfAccounts(30,70, {from: accounts[2]}), errTypes.revert);

        });

        // updateDistributiveFiguresOfAccounts - null value is passed
        it('Case 8.3 : updateDistributiveFiguresOfAccounts should revert if development percentage passed is 0', async() => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await tryCatch(aegisCoinContract.updateDistributiveFiguresOfAccounts(0,70), errTypes.revert);
        });

        // updateDistributiveFiguresOfAccounts - null value is passed
        it('Case 8.4 : updateDistributiveFiguresOfAccounts should revert if business percentage passed is 0', async() => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await tryCatch(aegisCoinContract.updateDistributiveFiguresOfAccounts(30, 0), errTypes.revert);
        });

        // updateDistributiveFiguresOfAccounts - should revert if sum not comes up to 100
        it('Case 8.5 : updateDistributiveFiguresOfAccounts should revert if sum not comes up to 100', async() => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await tryCatch(aegisCoinContract.updateDistributiveFiguresOfAccounts(80, 80), errTypes.revert);
        });

        // ============================================================================================================
        // 9. TEST CASES FOR GETTER METHODS

        // Get Aegis Contract Address
        it('Case 9.1 : Get Aegis Contract Address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let test_address = await aegisCoinContract.getContractAddr();

              assert.equal(test_address, aegisCoinContract.address, "Business Account did not match!");        
        });

        // Get Business Contract Address
        it('Case 9.2 : Get Business Contract Address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let test_address = await aegisCoinContract.getBusinessContract();
              assert.equal(test_address, businessContract.address, "Business Account did not match!");   		  
        });

        // Get development Contract Address
        it('Case 9.3 : Get development Contract Address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let test_address = await aegisCoinContract.getDevelopmentContract();

              assert.equal(test_address, developmentContract.address, "Development Account did not match!");   		  
        });

        // Get Supply of tokens per day
        it('Case 9.4 : Get Supply of tokens per day', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let totalSupply = await aegisCoinContract.totalSupply();
              let expected = new BigNumber(totalSupply.valueOf())/365;
              let test_supply = await aegisCoinContract.getSupplyPerDay();
              
              assert.equal(expected, test_supply.valueOf(), "Supply per day did not match!");   		  
        });

        // getPercentageForDevelopment
        it('Case 9.5 : Get Percentage for Development and Business', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let test_percentage = await aegisCoinContract.getPercentageForDevelopmentAndBusiness();

              assert.equal(test_percentage[0].valueOf(), 50, "Dev Percentage should be equal to 50% ");
              assert.equal(test_percentage[1].valueOf(), 50, "Business Percentage should be equal to 50% ");
        });

});