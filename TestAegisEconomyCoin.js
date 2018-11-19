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
        // TEST CASES FOR INITIAL

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

        // Initial setup positive scenario
        it('Case 1.4 : Initialization Positive Scenario ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

              let totalSupply = await aegisCoinContract.totalSupply();
              let owner_bal = await aegisCoinContract.balanceOf(deployerAddress);
              let test_businessContract = await aegisCoinContract.getBusinessContract();
              let test_developmentContract = await aegisCoinContract.getDevelopmentContract();
              
              assert.equal(totalSupply.valueOf(), owner_bal.valueOf(), "Owner balance should be equal to totalSupply");
              assert.equal(businessContract.address, test_businessContract, "Business Contract is not set to " + businessContract);	
              assert.equal(developmentContract.address, test_developmentContract, "Development Contract is not set to " + developmentContract);	
        });

        // Initial setup positive scenario
        it('Case 1.5 : Initialization ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

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
        // TEST CASES FOR MINTING METHOD

        /* Need to change these test cases after ideally minting method will have no parameter*/

        it('Case 2.1 : Should pass with 15% of inflation rate if called between year 1-2 ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              let totalSupply = await aegisCoinContract.totalSupply();
              let init_supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let owner_bal = await aegisCoinContract.balanceOf(deployerAddress);
              
              // let expected = totalSupply+(totalSupply*0.15);		// Issue: Concatinates instead of doing sum
              
              await aegisCoinContract.mintTokens(322*dayInSeconds);
              let supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let supplyAfterMint = await aegisCoinContract.totalSupply();

              console.log("\n Total Supply initialized ==> ", totalSupply.valueOf());
              console.log("\n Initial Supply Per Day ==> ", init_supplyPerDay.valueOf());
              console.log("\n Balance of Owner/Deployer Address ==> ", owner_bal.valueOf());
              console.log("\n ============================================================");
              console.log("\n Supply Per Day ==> ", supplyPerDay.valueOf());
              console.log("\n Total Supply after mint ==> ", supplyAfterMint.valueOf());

              // assert.equal(expected, supplyPerDay.valueOf(), "15% of the totalSupply should be added");
        });

        it('Case 2.2 : Should pass with 12.5% of inflation rate if called between year 2-3', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

              let totalSupply = await aegisCoinContract.totalSupply();
              let init_supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let owner_bal = await aegisCoinContract.balanceOf(deployerAddress);
              
              // let expected = totalSupply+(totalSupply*0.125);		// Issue: Concatenates instead of doing sum
              
              await aegisCoinContract.mintTokens(322*dayInSeconds);
              await aegisCoinContract.mintTokens(2*322*dayInSeconds);
              let supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let supplyAfterMint = await aegisCoinContract.totalSupply();

              console.log("\n Total Supply initialized ==> ", totalSupply.valueOf());
              console.log("\n Initial Supply Per Day ==> ", init_supplyPerDay.valueOf());
              console.log("\n Balance of Owner/Deployer Address ==> ", owner_bal.valueOf());
              console.log("\n ============================================================");
              console.log("\n Supply Per Day ==> ", supplyPerDay.valueOf());
              console.log("\n Total Supply after mint ==> ", supplyAfterMint.valueOf());

              // assert.equal(expected, supplyPerDay.valueOf(), "12.5% of the totalSupply should be added");
        });

        it('Case 2.3 : Should pass with 10% of inflation rate if called after 3 years', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

              let totalSupply = await aegisCoinContract.totalSupply();
              let init_supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let owner_bal = await aegisCoinContract.balanceOf(deployerAddress);
              // let expected = totalSupply+(totalSupply*0.10);				// Issue: Concatenates instead of doing sum
              
              // let expected = new BigNumber(totalSupply.valueOf())+ (totalSupply.valueOf() * 0.10);
              
              await aegisCoinContract.mintTokens(322*dayInSeconds);
              await aegisCoinContract.mintTokens(2*322*dayInSeconds);
              await aegisCoinContract.mintTokens(3*322*dayInSeconds);
              let supplyPerDay = await aegisCoinContract.getSupplyPerDay();
              let supplyAfterMint = await aegisCoinContract.totalSupply();

              console.log("\n Total Supply initialized ==> ", totalSupply.valueOf());
              console.log("\n Initial Supply Per Day ==> ", init_supplyPerDay.valueOf());
              console.log("\n Balance of Owner/Deployer Address ==> ", owner_bal.valueOf());
              console.log("\n ============================================================");
              console.log("\n Supply Per Day ==> ", supplyPerDay.valueOf());
              console.log("\n Total Supply after mint ==> ", supplyAfterMint.valueOf());

              // assert.equal(expected, supplyPerDay.valueOf(), "10% of the totalSupply should be added");
        });

        // =============================================================================================================
        // 2. setBusinessAcc

        // should not be called directly
        // should be called once in lifetime

        // /* Need to add bool in sol to check if method is called once or not */

        // // TBD
        // it('Case 3.1 : Should revert if not called by business contract', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              
        //       await tryCatch(aegisCoinContract.setBusinessAcc(accounts[2]), errTypes.revert);
        // });


        // =============================================================================================================
        // 3. setDevelopmentAcc

        // should not be called directly
        // should be called once in lifetime

        // TBD
        // it('Case 3.2 : Should revert if not called by DevelopmentAcc contract', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              
        //       await tryCatch(aegisCoinContract.setDevelopmentAcc(accounts[2]), errTypes.revert);
        // });

        // =============================================================================================================
        // 4. transferTokensFromBusiness

        it('Case 4.1 : transfer tokens from business', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(322*dayInSeconds);
              let getContractBalance = await businessContract.getContractBalance();

              await aegisCoinContract.transferTokensFromBusiness(accounts[2], 3000);

              let msgSender = await aegisCoinContract.msgSender();
              
              // console.log("\n test aegis contract: ", aegisCoinContract.address);
              // console.log("\n test businessContract : ", businessContract.address);
              // console.log("\n test developmentContract : ", developmentContract.address);
              // console.log("\n deployerAddress: ", deployerAddress);

              let aegisCoinContractAddr = await aegisCoinContract.getContractAddr();
              let businessAddr = await aegisCoinContract.getBusinessContract();
              let developmentAddr = await aegisCoinContract.getDevelopmentContract();

              // console.log("\n allowed msgSender should be aegis: ", msgSender);
              // console.log("\n aegisCoinContractAddr: ", aegisCoinContractAddr);
              // console.log("\n businessAddr: ", businessAddr);
              // console.log("\n developmentAddr: ", developmentAddr);

              let getContractBalanceAfterTransfer = await businessContract.getContractBalance();
              let acc2Balance = await aegisCoinContract.balanceOf(accounts[2]);

              let balance = await aegisCoinContract.balanceOf(businessContract.address);

              console.log("\n businessContract before balance: ", getContractBalance);
              console.log("\n businessContract after balance: ", getContractBalanceAfterTransfer);
              console.log("\n acc2Balance: ", acc2Balance);              
        });

        // =============================================================================================================
        // 5. transferTokensFromBusinessToDevelopment


        // =============================================================================================================
        // 6. transferTokensFromDevelopmentToBusiness


        // =============================================================================================================
        // 7. updateDistributiveFiguresOfAccounts

        // updateDistributiveFiguresOfAccounts - Positive
        it('Case 7.1 : updateDistributiveFiguresOfAccounts', async() => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.updateDistributiveFiguresOfAccounts(30,70, {from: deployerAddress});

              let test_business = await aegisCoinContract.getPercentageForBusiness();
              let test_development = await aegisCoinContract.getPercentageForDevelopment();
           
              assert.equal(test_business.valueOf(), 70, "Did not matched ");
              assert.equal(test_development.valueOf(), 30, "Did not matched ");
        });

        // another test case for require statement check!

        // updateDistributiveFiguresOfAccounts - onlyOwner
        it('Case 7.2 : updateDistributiveFiguresOfAccounts', async() => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await tryCatch(aegisCoinContract.updateDistributiveFiguresOfAccounts(30,70, {from: accounts[2]}), errTypes.revert);

        });


        // ============================================================================================================
        // TEST CASES FOR GETTER METHODS

        // Get Inflation Rate
        it('Case 8.1 : Get Inflation Rate ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              

              let rate = await aegisCoinContract.getInflationRates();

              let test_firstYearInflationRate = rate[0].valueOf()/100;
              let test_secondYearInflationRate = rate[1].valueOf()/100;
              let test_thirdYearInflationRate = rate[2].valueOf()/100;
              
              // console.log("\n Inflation Rates ==> ", rate.valueOf());    		  

              assert.equal(test_firstYearInflationRate, firstYearInflationRate, "Inflation rate doesnot match");
              assert.equal(test_secondYearInflationRate, secondYearInflationRate, "Inflation rate doesnot match");
              assert.equal(test_thirdYearInflationRate, thirdYearInflationRate, "Inflation rate doesnot match");
        });


        // Get Aegis Contract Address
        it('Case 8.2 : Get Aegis Contract Address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              let test_address = await aegisCoinContract.getContractAddr();

              // console.log("\n AegisCoinAcc ==> ", test_address);

              assert.equal(aegisCoinContract.address, test_address, "Business Account did not match!");        
        });


        // Get Business Contract Address
        it('Case 8.3 : Get Business Contract Address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              let test_address = await aegisCoinContract.getBusinessContract();

              assert.equal(businessContract.address, test_address, "Business Account did not match!");   		  
        });

        // Get development Contract Address
        it('Case 8.4 : Get development Contract Address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              let test_address = await aegisCoinContract.getDevelopmentContract();

              assert.equal(developmentContract.address, test_address, "Development Account did not match!");   		  
        });

        // Get Supply of tokens per day
        it('Case 8.5 : Get Supply of tokens per day', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              let totalSupply = await aegisCoinContract.totalSupply();
              
              let expected = new BigNumber(totalSupply.valueOf())/365;

              let test_supply = await aegisCoinContract.getSupplyPerDay();
              
              assert.equal(expected, test_supply.valueOf(), "Supply per day did not match!");   		  
        });

        // 13. business account balance

        // 14. development account balance


        // Get developer and voter percentage
        it('Case 8.6 : Get developer and voter percentage', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

              let getDevVoterPer = await aegisCoinContract.getDeveloperVoterPercentage();

              // console.log("Get Dev And VoterPer ========> ", getDevVoterPer);

              assert.equal(getDevVoterPer[0].valueOf(), developementPercentage, "Developer Percentage does not match! ");
              assert.equal(getDevVoterPer[1].valueOf(), voterPercentage, "Voter Percentage does not match! ");
        });

        // Get winners percentage
        it('Case 8.7 : Get winners percentage', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

              let getWinnerPer = await aegisCoinContract.getWinnerPercentage();

              // console.log("Get Winner Per ========> ", getWinnerPer);

              assert.equal(getWinnerPer[0].valueOf(), firstWinnerPercentage, "First Winner Percentage does not match! ");
              assert.equal(getWinnerPer[1].valueOf(), secondWinnerPercentage, "Second Winner Percentage does not match! ");
              assert.equal(getWinnerPer[2].valueOf(), thirdWinnerPercentage, "Third Winner Percentage does not match! ");
        });

        // getPercentageForDevelopment
        it('Case 8.8 : Get winners percentage', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

              let DevPercentage = await aegisCoinContract.getPercentageForDevelopment();

              assert.equal(DevPercentage.valueOf(), 50, "Dev Percentage should be equal to 50% ");
        });

        // getPercentageForBusiness
        it('Case 8.9 : Get winners percentage', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});

              let BusiPercentage = await aegisCoinContract.getPercentageForBusiness();

              assert.equal(BusiPercentage.valueOf(), 50, "Business Percentage should be equal to 50% ");
        });

});