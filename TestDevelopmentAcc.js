const AegisCoin = artifacts.require("AegisEconomyCoin");
const BusinessAcc = artifacts.require("BusinessAcc");
const DevelopmentAcc = artifacts.require("DevelopmentAcc");

contract('Development Contract', async (accounts) => {
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

    const null_address = '0x0000000000000000000000000000000000000000';   


    // // =======================================================================================================================
    // // 1. Initial Setup

    //     // Initial setup positive scenario
    //     it('Case 1.1 : Initialization ', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
    //           developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
    //           await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
    //           await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
    //           let getDevVoterPer = await aegisCoinContract.getDeveloperVoterPercentage();
    //           let getWinnerPer = await aegisCoinContract.getWinnerPercentage();

    //           assert.equal(getDevVoterPer[0].valueOf(), developementPercentage, "Developer Percentage does not match! ");
    //           assert.equal(getDevVoterPer[1].valueOf(), voterPercentage, "Voter Percentage does not match! ");
    //           assert.equal(getWinnerPer[0].valueOf(), firstWinnerPercentage, "First Winner Percentage does not match! ");
    //           assert.equal(getWinnerPer[1].valueOf(), secondWinnerPercentage, "Second Winner Percentage does not match! ");
    //           assert.equal(getWinnerPer[2].valueOf(), thirdWinnerPercentage, "Third Winner Percentage does not match! ");
    //     });

    //     // TBD !!
    //     // // Should revert if aegis coin parameter is not of type contract address
    //     // it('Case 1.2 : Initialization :  Should revert if aegis coin parameter is not of type contract address', async () => {
    //     //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //     //       developmentContract = await tryCatch(DevelopmentAcc.new(accounts[2], 50, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
    //     // });

    //     // Should revert if aegis coin parameter is null
    //     it('Case 1.3 : Initialization :  Should revert if aegisCoinContract parameter is null', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(0, 50, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
    //     });

    //     // Should revert if devPer parameter is null
    //     it('Case 1.4 : Initialization :  Should revert if devPer parameter is null', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 0, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
    //     });

    //     // Should revert if voterPer parameter is null
    //     it('Case 1.5 : Initialization :  Should revert if voterPer parameter is null', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 0, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
    //     });

    //     // Should revert if sum of dev and voter per is not equal to 100
    //     it('Case 1.6 : Initialization : Should revert if sum of dev and voter per is not equal to 100', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 40, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
    //     });

    //     // Should revert if firstPer parameter is null
    //     it('Case 1.7 : Initialization :  Should revert if firstPer parameter is null', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 0, 35, 15, {from: deployerAddress}), errTypes.revert); 
    //     });

    //     // Should revert if secondPer parameter is null
    //     it('Case 1.8 : Initialization :  Should revert if secondPer parameter is null', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 0, 15, {from: deployerAddress}), errTypes.revert); 
    //     });

    //     // Should revert if thirdPer parameter is null
    //     it('Case 1.9 : Initialization :  Should revert if thirdPer parameter is null', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 0, {from: deployerAddress}), errTypes.revert); 
    //     });

    //     // Should revert if firstPer, secondPer and thirdPer is not equal to 100
    //     it('Case 1.10 : Initialization : Should revert if firstPer, secondPer and thirdPer is not equal to 100', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 15, 15, {from: deployerAddress}), errTypes.revert); 
    //     });

    // // =======================================================================================================================
    // // 2. Add New Backlog

    //     // A new backlog record should be added successfully - Positive Scenraio
    //     it('Case 2.1 : Add new backlog ', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
    //           developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
    //           await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
    //           await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
    //           await aegisCoinContract.mintTokens(0);

    //           await developmentContract.addNewBacklog(1001, 2000, {from: deployerAddress});
              
    //           // let backlogIds = await developmentContract.getBacklogIDs();  
    //           // console.log("\n Backlog IDs: ", backlogIds.valueOf());

    //           // let backlogIdDetails = await developmentContract.getBacklogID(2001);
    //           // console.log("\n Backlog ID: 1001 Details: \n", backlogIdDetails.valueOf());            
    //     });


    //     // Should throw a revert if backlog-id is existing
    //     it('Case 2.2 : Add new backlog should throw a revert if backlog-id is existing ', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
    //           developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
    //           await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
    //           await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
    //           await aegisCoinContract.mintTokens(0);

    //           await developmentContract.addNewBacklog(2001, 2030);
    //           await tryCatch(developmentContract.addNewBacklog(2001, 3030), errTypes.revert); 
    //     });

    //     // Should throw a revert if not called by owner
    //     it('Case 2.3 : Add new backlog should throw a revert if backlog-id is existing ', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
    //           developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
    //           await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
    //           await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
    //           await aegisCoinContract.mintTokens(0);

    //           await tryCatch(developmentContract.addNewBacklog(2001, 3030, {from: accounts[3]}), errTypes.revert); 
    //     });

    //     // Should throw a revert if backlog-id is null
    //     it('Case 2.4 : Add new backlog should throw a revert if backlog-id is null ', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
    //           developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
    //           await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
    //           await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
    //           await aegisCoinContract.mintTokens(0);

    //           await tryCatch(developmentContract.addNewBacklog(0, 3030), errTypes.revert); 
    //     });

    //     // Should throw a revert if tokens is 0
    //     it('Case 2.5 : Add new backlog should throw a revert if tokens is 0 ', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
    //           developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
    //           await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
    //           await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
    //           await aegisCoinContract.mintTokens(0);

    //           await tryCatch(developmentContract.addNewBacklog(2001, 0), errTypes.revert); 
    //     });

    //     // Should throw a revert if tokens are greater than remaining balance
    //     it('Case 2.6 : Add new backlog should throw a revert if tokens are greater than remaining balance', async () => {
    //           aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
    //           businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
    //           developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
    //           await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
    //           await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
    //           await aegisCoinContract.mintTokens(0);

    //           await tryCatch(developmentContract.addNewBacklog(2001, 5000000000000000000000000000000000), errTypes.revert); 
    //     });


    // =======================================================================================================================
    // 3. Remove Backlog

        // Remove Existing backlogid
        it('Case 3.1 : Delete Backlog: Remove Existing backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await developmentContract.deleteBacklog(2001);

              // let backlogIds = await developmentContract.getBacklogIDs();  
              // console.log("\n Backlog IDs: ", backlogIds.valueOf());

              // let backlogIdDetails = await developmentContract.getBacklogID(2001);    // id: 1000 . doesn't throw any error and return with 0 value
              // console.log("\n Backlog ID: 1001 Details: \n", backlogIdDetails.valueOf());            
        });

        // Should revert if backlog does not exist
        it('Case 3.2 : Delete Backlog: Should revert if backlog does not exist ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await tryCatch(developmentContract.deleteBacklog(5001), errTypes.revert);
        });

        // Should revert if not called by owner
        it('Case 3.3 : Delete Backlog: Should revert if not called by owner ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await tryCatch(developmentContract.deleteBacklog(2001, {from: accounts[3]}), errTypes.revert);
        });


        // Should revert if null value is passed
        it('Case 3.4 : Delete Backlog: Should revert if null value is passed ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await tryCatch(developmentContract.deleteBacklog(0), errTypes.revert);
        });

        // Should revert if backlog is closed
        it('Case 3.4 : Delete Backlog: Should revert if backlog is closed ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await developmentContract.setBacklogStatus(4001, 5); // i.e. closed/paid

              await tryCatch(developmentContract.deleteBacklog(4001), errTypes.revert);
        });

    // =======================================================================================================================
    // Update Backlog

        // // update backlog : Positive Scenario
        // it('Case 4.1 : Update existing backlog ', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
        //       await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
        //       await aegisCoinContract.mintTokens(0);

        //       await developmentContract.addNewBacklog(1001, 2030);
        //       await developmentContract.addNewBacklog(2001, 3030);
        //       await developmentContract.addNewBacklog(3001, 4030);
        //       await developmentContract.addNewBacklog(4001, 5030);

        //       await developmentContract.updateBacklogAmount(3001, 59820);

        //       // let Details = await developmentContract.getBacklogID(3001);
        //       // console.log("\n Details: ", Details.valueOf());
        // });


        // // Should revert if backlog doesnot exist
        // it('Case 4.2 : Should revert if backlog doesnot exist ', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
        //       await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
        //       await aegisCoinContract.mintTokens(0);

        //       await developmentContract.addNewBacklog(1001, 2030);
        //       await developmentContract.addNewBacklog(2001, 3030);
        //       await developmentContract.addNewBacklog(3001, 4030);
        //       await developmentContract.addNewBacklog(4001, 5030);

        //       await tryCatch(developmentContract.updateBacklogAmount(5001, 39476), errTypes.revert);
        // });

        // // Should revert if backlog doesnot exist
        // it('Case 4.3 : Should revert if backlog is not in submission state ', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
        //       await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
        //       await aegisCoinContract.mintTokens(0);

        //       await developmentContract.addNewBacklog(1001, 2030);
        //       await developmentContract.addNewBacklog(2001, 3030);
        //       await developmentContract.addNewBacklog(3001, 4030);
        //       await developmentContract.addNewBacklog(4001, 5030);

        //       await developmentContract.setBacklogStatus(4001, 3);

        //       await tryCatch(developmentContract.updateBacklogAmount(4001, 39476), errTypes.revert);
        // });


    // =======================================================================================================================
    // Release Tokens

        // // Need to look for decimal values when transfering tokens to winners
        // it('Case 5.1 : Release Tokens For Complete Backlog ', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
        //       await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
        //       await aegisCoinContract.mintTokens(0);

        //       // WARNING: the values that is passed should be in it's least denomination
        //       await developmentContract.addNewBacklog(1001, 2030);
        //       await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
        //       await developmentContract.addNewBacklog(3001, 4030);
        //       await developmentContract.addNewBacklog(4001, 5030);

        //       let voters = [accounts[5], accounts[6], accounts[7], accounts[8]];

        //       let bal2 = await aegisCoinContract.balanceOf(accounts[2]);    // winner -1 
        //       let bal3 = await aegisCoinContract.balanceOf(accounts[3]);    // winner -2 
        //       let bal4 = await aegisCoinContract.balanceOf(accounts[4]);    // winner -3 

        //       console.log("\n BEFORE: ============================\n");
        //       console.log("\n accounts[2]: ", bal2);
        //       console.log("\n accounts[3]: ", bal3);
        //       console.log("\n accounts[4]: ", bal4);

        //       let boolValue = await developmentContract.setBacklogStatus(2001, 4);
        //       await developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 100);
        //       await developmentContract.releaseTokensForVoters(2001, voters);

        //       let bal2_aft = await aegisCoinContract.balanceOf(accounts[2]);      // expected : 757.5 tokens
        //       let bal3_aft = await aegisCoinContract.balanceOf(accounts[3]);      // expected : 530.25 tokens
        //       let bal4_aft = await aegisCoinContract.balanceOf(accounts[4]);      // expected : 227.25 tokens
        //       let bal5_aft = await aegisCoinContract.balanceOf(accounts[5]);      // expected : 15.15 tokens
        //       let bal6_aft = await aegisCoinContract.balanceOf(accounts[6]);      // expected : 15.15 tokens
        //       let bal7_aft = await aegisCoinContract.balanceOf(accounts[7]);      // expected : 15.15 tokens
        //       let bal8_aft = await aegisCoinContract.balanceOf(accounts[8]);      // expected : 15.15 tokens

        //       console.log("\n After: ============================\n");
        //       console.log("\n accounts[2]: ", bal2_aft.valueOf());
        //       console.log("\n accounts[3]: ", bal3_aft.valueOf());
        //       console.log("\n accounts[4]: ", bal4_aft.valueOf());
        //       console.log("\n Voter: accounts[5]: ", bal5_aft.valueOf());
        //       console.log("\n Voter: accounts[6]: ", bal6_aft.valueOf());
        //       console.log("\n Voter: accounts[7]: ", bal7_aft.valueOf());
        //       console.log("\n Voter: accounts[8]: ", bal8_aft.valueOf());

        //       let backlogIdDetails = await developmentContract.getBacklogID(2001);    // id: 1000 . doesn't throw any error and return with 0 value
        //       console.log("\n Backlog ID: 1001 Details: \n", backlogIdDetails.valueOf());            
        // });


        //// Add a test cases to check if remainingTokens = balanceOf(address(this)).sub(totalReservedTokens). getter methods 
});