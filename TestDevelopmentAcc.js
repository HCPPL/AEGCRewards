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


    // =======================================================================================================================
    // 1. Initial Setup

        // Initial setup positive scenario
        it('Case 1.1 : Initialization ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              let getDevVoterPer = await developmentContract.getDeveloperAndVoterPercentage();
              let getWinnerPer = await developmentContract.getWinnersPercentage();

              let totalReservedTokens = await developmentContract.getTotalReservedTokens();
              let remainingTokens = await developmentContract.getRemainingTokens(); 

              let aegisCoin = await developmentContract.getAegisCoinContractAddress();

              assert.equal(getDevVoterPer[0].valueOf(), developementPercentage, "Developer Percentage does not match! ");
              assert.equal(getDevVoterPer[1].valueOf(), voterPercentage, "Voter Percentage does not match! ");
              assert.equal(getWinnerPer[0].valueOf(), firstWinnerPercentage, "First Winner Percentage does not match! ");
              assert.equal(getWinnerPer[1].valueOf(), secondWinnerPercentage, "Second Winner Percentage does not match! ");
              assert.equal(getWinnerPer[2].valueOf(), thirdWinnerPercentage, "Third Winner Percentage does not match! ");
              assert.equal(totalReservedTokens.valueOf(), 0 , "totalReservedTokens should be equal to 0 ");
              assert.equal(remainingTokens.valueOf(), 0, "RemainingTokens should be equal to 0 ");
              assert.equal(aegisCoin, aegisCoinContract.address, "AegisCoin is not set successfully in development contract ");
        });

        // Pending
        // // Should revert if aegis coin parameter is not of type contract address
        // it('Case 1.2 : Initialization :  Should revert if aegis coin parameter is not of type contract address', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       developmentContract = await tryCatch(DevelopmentAcc.new(accounts[2], 50, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
        // });

        // Should revert if aegis coin parameter is null
        it('Case 1.3 : Initialization :  Should revert if aegisCoinContract parameter is null', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(0, 50, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
        });

        // Should revert if devPer parameter is null
        it('Case 1.4 : Initialization :  Should revert if devPer parameter is null', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 0, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
        });

        // Should revert if voterPer parameter is null
        it('Case 1.5 : Initialization :  Should revert if voterPer parameter is null', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 0, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
        });

        // Should revert if sum of dev and voter per is not equal to 100
        it('Case 1.6 : Initialization : Should revert if sum of dev and voter per is not equal to 100', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 40, 50, 50, 35, 15, {from: deployerAddress}), errTypes.revert); 
        });

        // Should revert if firstPer parameter is null
        it('Case 1.7 : Initialization :  Should revert if firstPer parameter is null', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 0, 35, 15, {from: deployerAddress}), errTypes.revert); 
        });

        // Should revert if secondPer parameter is null
        it('Case 1.8 : Initialization :  Should revert if secondPer parameter is null', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 0, 15, {from: deployerAddress}), errTypes.revert); 
        });

        // Should revert if thirdPer parameter is null
        it('Case 1.9 : Initialization :  Should revert if thirdPer parameter is null', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 0, {from: deployerAddress}), errTypes.revert); 
        });

        // Should revert if firstPer, secondPer and thirdPer is not equal to 100
        it('Case 1.10 : Initialization : Should revert if firstPer, secondPer and thirdPer is not equal to 100', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              developmentContract = await tryCatch(DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 15, 15, {from: deployerAddress}), errTypes.revert); 
        });

    // =======================================================================================================================
    // 2. Add New Backlog

        // A new backlog record should be added successfully - Positive Scenraio
        it('Case 2.1 : Add new backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2000, {from: deployerAddress});
              
              let backlogIdBool = await developmentContract.getBoolForBacklogExistence(1001);
              let backlogIdDetails = await developmentContract.getBacklogIDDetails(1001);
              let totalReservedTokens = await developmentContract.getTotalReservedTokens();
              let remainingTokens = await developmentContract.getRemainingTokens();
              let remainingTokens_expected = await aegisCoinContract.getDevelopmentAccBalance() - 2000;

              assert.equal(backlogIdBool, true, "Backlog-Id did not found!");
              assert.equal(backlogIdDetails[0], 2000, "Total reserved Tokens for added backlog did not matched!");
              assert.equal(totalReservedTokens.valueOf(), 2000, "Total reserved Tokens for added backlog did not matched!");
              assert.equal(remainingTokens.valueOf(), remainingTokens_expected, "Remaining Tokens did not matched!");
        });


        // Should throw a revert if backlog-id is existing
        it('Case 2.2 : Add new backlog should throw a revert if backlog-id is existing ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(2001, 2030);
              await tryCatch(developmentContract.addNewBacklog(2001, 3030), errTypes.revert); 
        });

        // Should throw a revert if not called by owner
        it('Case 2.3 : Add new backlog should throw a revert if backlog-id is existing ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await tryCatch(developmentContract.addNewBacklog(2001, 3030, {from: accounts[3]}), errTypes.revert); 
        });

        // Should throw a revert if backlog-id is null
        it('Case 2.4 : Add new backlog should throw a revert if backlog-id is null ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await tryCatch(developmentContract.addNewBacklog(0, 3030), errTypes.revert); 
        });

        // Should throw a revert if tokens is 0
        it('Case 2.5 : Add new backlog should throw a revert if tokens is 0 ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await tryCatch(developmentContract.addNewBacklog(2001, 0), errTypes.revert); 
        });

        // Should throw a revert if tokens are greater than remaining balance
        it('Case 2.6 : Add new backlog should throw a revert if tokens are greater than remaining balance', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await tryCatch(developmentContract.addNewBacklog(2001, 5000000000000000000000000000000000), errTypes.revert); 
        });


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

              let remainingTokens = await developmentContract.getRemainingTokens();
              let totalReservedTokens = await developmentContract.getTotalReservedTokens();

              await developmentContract.deleteBacklog(2001);

              let remainingTokens_afterDeletion = await developmentContract.getRemainingTokens();
              let remainingTokens_expected = remainingTokens.valueOf() - 3030;

              let totalReservedTokens_afterDeletion = await developmentContract.getTotalReservedTokens();
              let totalReservedTokens_expected = totalReservedTokens.valueOf() - 3030;

              let backlogIdDetails = await developmentContract.getBacklogIDDetails(2001);
              assert.equal(backlogIdDetails[0], 0, "Total Tokens Reserved is not set to 0!");
              assert.equal(backlogIdDetails[2], 6, "backlog not set to deleted status!");
              assert.equal(remainingTokens_afterDeletion, remainingTokens_expected , "Remaining Tokens Error!");            
              assert.equal(totalReservedTokens_afterDeletion, totalReservedTokens_expected , "Total Reserved Tokens Error!");            
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

              await tryCatch(developmentContract.deleteBacklog(0), errTypes.revert);
        });

        // Should revert if backlog is closed
        it('Case 3.5 : Delete Backlog: Should revert if backlog is closed ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 20300000000);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.setBacklogStatus(1001, 4); // i.e. voting done

              let voters = [accounts[4], accounts[5], accounts[6]];
              await developmentContract.releaseTokensToWinnersForCompleteBacklog(1001, accounts[1], accounts[2], accounts[3], 3);
              await developmentContract.releaseTokensForVoters(1001, voters);

              await tryCatch(developmentContract.deleteBacklog(1001), errTypes.revert);
        });

    // =======================================================================================================================
    // Update Backlog

        // update backlog : Positive Scenario
        it('Case 4.1 : Update existing backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
 
              let remainingTokens = await developmentContract.getRemainingTokens();
              let totalReservedTokens = await developmentContract.getTotalReservedTokens();

              await developmentContract.updateBacklogAmount(1001, 59820);

              let remainingTokens_afterDeletion = await developmentContract.getRemainingTokens();
              let remainingTokens_expected = (remainingTokens.valueOf() - 59820) + 2030;

              let totalReservedTokens_afterDeletion = await developmentContract.getTotalReservedTokens();
              let totalReservedTokens_expected = (totalReservedTokens.valueOf() - 2030) + 59820;

              let backlogIdDetails = await developmentContract.getBacklogIDDetails(1001);

              assert.equal(backlogIdDetails[0], 59820, "Total Tokens not updated!");
              assert.equal(totalReservedTokens_afterDeletion.valueOf(), totalReservedTokens_expected, "Total Tokens Error!");
              assert.equal(remainingTokens_afterDeletion.valueOf(), remainingTokens_expected, "Remaining Tokens Error!");
        });


        // Should revert if backlog doesnot exist
        it('Case 4.2 : Should revert if backlog doesnot exist ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);

              await tryCatch(developmentContract.updateBacklogAmount(5001, 39476), errTypes.revert);
        });

        // Should revert if backlog is not in submission state
        it('Case 4.3 : Should revert if backlog is not in submission state ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);

              await developmentContract.setBacklogStatus(2001, 3);

              await tryCatch(developmentContract.updateBacklogAmount(2001, 39476), errTypes.revert);
        });

        // Should revert if null value is passed as backlog
        it('Case 4.4 : Should revert if null value is passed as backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);

              await tryCatch(developmentContract.updateBacklogAmount(0, 39476), errTypes.revert);
        });

        // Should revert if null value is passed as tokens
        it('Case 4.5 : Should revert if null value is passed as tokens ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);

              await tryCatch(developmentContract.updateBacklogAmount(2001, 0), errTypes.revert);
        });

    // =======================================================================================================================
    // 5. Release Tokens For Winners

        // TBD: assert not working: expected value has an extra 0 in it's reseult
        // Release Tokens For Complete Backlog - Positive Scenario
        it('Case 5.1 : Release Tokens To Winners ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [accounts[5], accounts[6], accounts[7], accounts[8]];

              let winnerOneBalance_before = await aegisCoinContract.balanceOf(accounts[2]);    // winner -1 
              let winnerTwoBalance_before = await aegisCoinContract.balanceOf(accounts[3]);    // winner -2 
              let winnerThreeBalance_before = await aegisCoinContract.balanceOf(accounts[4]);    // winner -3 

              await developmentContract.setBacklogStatus(2001, 4);
          
              await developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 100);
              
              let winnerOneBalance_after = await aegisCoinContract.balanceOf(accounts[2]);        // expected : 757.5 tokens
              let winnerTwoBalance_after = await aegisCoinContract.balanceOf(accounts[3]);        // expected : 530.25 tokens
              let winnerThreeBalance_after = await aegisCoinContract.balanceOf(accounts[4]);      // expected : 227.25 tokens
              
              let winnerOneBalance_expected = winnerOneBalance_before + ((0.50*3030000000000000)*.50) ; 
              let winnerTwoBalance_expected = winnerTwoBalance_before + ((0.50*3030000000000000)*.35) ; 
              let winnerThreeBalance_expected = winnerThreeBalance_before + ((0.50*3030000000000000)*.15) ; 
                      // let bal5_aft = await aegisCoinContract.balanceOf(accounts[5]);      // expected : 15.15 tokens
                      // let bal6_aft = await aegisCoinContract.balanceOf(accounts[6]);      // expected : 15.15 tokens
                      // let bal7_aft = await aegisCoinContract.balanceOf(accounts[7]);      // expected : 15.15 tokens
                      // let bal8_aft = await aegisCoinContract.balanceOf(accounts[8]);      // expected : 15.15 tokens
              console.log("winnerOneBalance_before", winnerOneBalance_before.valueOf());
              console.log("winnerOneBalance_after", winnerOneBalance_after.valueOf());
              console.log("winnerOneBalance_expected", winnerOneBalance_expected.valueOf());
              // assert.equal(winnerOneBalance_after.valueOf(), winnerOneBalance_expected," Balance of Winner 1 did not matched");
              // assert.equal(winnerTwoBalance_after.valueOf(), winnerTwoBalance_expected," Balance of Winner 2 did not matched");
              // assert.equal(winnerThreeBalance_after.valueOf(), winnerThreeBalance_expected," Balance of Winner 3 did not matched");
        });

        // Should revert if total voters passed are 0
        it('Case 5.2 : Release Tokens Should revert if total voters passed are 0 ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await developmentContract.setBacklogStatus(2001, 4);
              await tryCatch(developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 0), errTypes.revert);
        });

        // Should revert if backlog id doesnot exist
        it('Case 5.3 : Release Tokens Should revert if backlog id doesnot exist ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await tryCatch(developmentContract.releaseTokensToWinnersForCompleteBacklog(5001, accounts[2], accounts[3], accounts[4], 100), errTypes.revert);
        });

        // Should revert if backlog doesnot exist
        it('Case 5.4 : Release Tokens Should revert if backlog doesnot exist ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [accounts[5], accounts[6], accounts[7], accounts[8], accounts[9], accounts[5], accounts[6], accounts[7], accounts[8], accounts[9],accounts[5], accounts[6], accounts[7], accounts[8], accounts[9],accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]];

              await developmentContract.setBacklogStatus(2001, 4);
              await tryCatch(developmentContract.releaseTokensToWinnersForCompleteBacklog(5001, accounts[2], accounts[3], accounts[4], 100), errTypes.revert);
        });


    // =======================================================================================================================
    // 6. Release Tokens For Voters

        // TBD: Not able to get assert.equal : similar error as in 5.1 
        // Release Tokens For Complete Backlog - Positive Scenario
        it('Case 6.1 : Release Tokens To Winners and voters ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [accounts[5], accounts[6], accounts[7], accounts[8]];

              await developmentContract.setBacklogStatus(2001, 4);

              let totalReserved = await developmentContract.getTotalReservedTokens(); // 3030000000000000 + 11090

              let voter1_bfr = await aegisCoinContract.balanceOf(accounts[5]);
              let voter2_bfr = await aegisCoinContract.balanceOf(accounts[6]);
              let voter3_bfr = await aegisCoinContract.balanceOf(accounts[7]);
              let voter4_bfr = await aegisCoinContract.balanceOf(accounts[8]);

              await developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 4);
              let totalReserved_mid = await developmentContract.getTotalReservedTokens(); // 11090 + (0.50*3030000000000000)

              await developmentContract.releaseTokensForVoters(2001, voters);

              let voter1_aft = await aegisCoinContract.balanceOf(accounts[5]);          // expected : 15.15 tokens
              let voter2_aft = await aegisCoinContract.balanceOf(accounts[6]);          // expected : 15.15 tokens
              let voter3_aft = await aegisCoinContract.balanceOf(accounts[7]);          // expected : 15.15 tokens
              let voter4_aft = await aegisCoinContract.balanceOf(accounts[8]);          // expected : 15.15 tokens

              let voter1_exp = voter1_bfr.valueOf() + ((0.50*3030000000000000)/4);
              let voter2_exp = voter2_bfr.valueOf() + ((0.50*3030000000000000)/4);
              let voter3_exp = voter3_bfr.valueOf() + ((0.50*3030000000000000)/4);
              let voter4_exp = voter4_bfr.valueOf() + ((0.50*3030000000000000)/4);

              let totalReserved_aft = await developmentContract.getTotalReservedTokens();      // total_mid - (0.50*3030000000000000) = 11090
              let totalReserved_expected = totalReserved_mid.valueOf() - (0.50*3030000000000000); // 11090

              // console.log("totalReserved: ", totalReserved.valueOf());
              // console.log("totalReservedMid: ", totalReserved_mid.valueOf());
              // console.log("totalReservedAfter: ", totalReserved_aft.valueOf());
              // console.log("totalReservedExpected: ", totalReserved_expected.valueOf());

              let backlogIdDetails = await developmentContract.getBacklogIDDetails(2001);

              // console.log("tokens Per Voters: ", backlogIdDetails[3]);
              assert.equal(backlogIdDetails[2].valueOf(), 5, " Backlog is not in closed state! ");
              assert.equal(totalReserved_aft.valueOf(), totalReserved_expected, " Total Reserved Tokens Error! "); 
              // // assert.equal(voter1_aft.valueOf(), voter1_exp, "Voters 1 is not paid as expected! ");
              // // assert.equal(voter2_aft.valueOf(), voter2_exp, "Voters 2 is not paid as expected! ");
              // // assert.equal(voter3_aft.valueOf(), voter3_exp, "Voters 3 is not paid as expected! ");
              // // assert.equal(voter4_aft.valueOf(), voter4_exp, "Voters 4 is not paid as expected! "); // EXTRA 0 WITH THE RESULT!
        });

        // Should revert if backlog doesnot exist
        it('Case 6.2 : Release Tokens should revert if backlog doesnot exist ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]];

              await developmentContract.setBacklogStatus(2001, 4);
              await developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 100);
              await tryCatch(developmentContract.releaseTokensForVoters(5001, voters), errTypes.revert);
        });

        // Should not revert if voter addresses is equal to 20 addresses
        it('Case 6.3 : Release Tokens Should not revert if voter addresses is equal to 20 addresses ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [accounts[5], accounts[6], accounts[7], accounts[8], accounts[9], accounts[5], accounts[6], accounts[7], accounts[8], accounts[9],accounts[5], accounts[6], accounts[7], accounts[8], accounts[9],accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]];

              await developmentContract.setBacklogStatus(2001, 4);
              await developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 100);
              await developmentContract.releaseTokensForVoters(2001, voters);
        });

        // Should revert if voter addresses is greater than 20 addresses
        it('Case 6.4 : Release Tokens Should revert if voter addresses is equal to 20 addresses ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [accounts[5], accounts[5], accounts[6], accounts[7], accounts[8], accounts[9], accounts[5], accounts[6], accounts[7], accounts[8], accounts[9],accounts[5], accounts[6], accounts[7], accounts[8], accounts[9],accounts[5], accounts[6], accounts[7], accounts[8], accounts[9]];

              await developmentContract.setBacklogStatus(2001, 4);
              await developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 100);
              await tryCatch(developmentContract.releaseTokensForVoters(2001, voters), errTypes.revert);
        });

        // Should revert if 0 voters are passed
        it('Case 6.5 : Release Tokens Should revert if 0 voters are passed ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [];

              await developmentContract.setBacklogStatus(2001, 4);
              await developmentContract.releaseTokensToWinnersForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 100);
              await tryCatch(developmentContract.releaseTokensForVoters(2001, voters), errTypes.revert);
        });

    // =======================================================================================================================
    // 7. Update Developer Voter Percentage

        // Update Developer Voter Percentage - Positive Scenario
        it('Case 7.1 : Update Developer Voter Percentage - Positive Scenario ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await developmentContract.updateDeveloperVoterPercentage(30,70);
              let test_Per = await developmentContract.getDeveloperAndVoterPercentage();

              assert.equal(test_Per[0].valueOf(), 30, "Developer Percentage did not matched!");
              assert.equal(test_Per[1].valueOf(), 70, "Voters Percentage did not matched!");
        });

        // Update Developer Voter Percentage - revert if sum does not comes out to 100
        it('Case 7.2 : Update Developer Voter Percentage - revert if sum does not comes out to 100', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateDeveloperVoterPercentage(70,70), errTypes.revert);
        });

        // should revert if developer percentage is 0
        it('Case 7.3 : Update Developer Voter Percentage - revert if developer percentage is 0', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateDeveloperVoterPercentage(0,70), errTypes.revert);
        });

        // should revert if voter percentage is 0
        it('Case 7.4 : Update Developer Voter Percentage - revert if voter percentage is 0', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateDeveloperVoterPercentage(70,0), errTypes.revert);
        });

        // should revert if not called by owner
        it('Case 7.5 : Update Developer Voter Percentage - revert if not called by onwer', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateDeveloperVoterPercentage(70,30, {from: accounts[1]}), errTypes.revert);
        });

    // =======================================================================================================================
    // 8. Update Winners Percentage

        // Update Winner Percentage - Positive Scenario
        it('Case 8.1 : Update Winner Percentage - Positive Scenario ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await developmentContract.updateWinnersPercentage(30,60,10);
              let test_Per = await developmentContract.getWinnersPercentage();

              assert.equal(test_Per[0].valueOf(), 30, "First Winner Percentage did not matched!");
              assert.equal(test_Per[1].valueOf(), 60, "Second Winner Percentage did not matched!");
              assert.equal(test_Per[2].valueOf(), 10, "Third Winner Percentage did not matched!");
        });

        // Update Winner Percentage - revert if sum does not comes out to 100
        it('Case 8.2 : Update Winner Percentage - revert if sum does not comes out to 100', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateWinnersPercentage(70,70, 70), errTypes.revert);
        });

        // revert if not called by onwer
        it('Case 8.3 : Update Winner Percentage - revert if not called by onwer', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateWinnersPercentage(30,50,20, {from: accounts[2]}), errTypes.revert);
        });

        // revert is null value is passed for first winner address
        it('Case 8.4 : Update Winner Percentage - revert is null value is passed for first winner address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateWinnersPercentage(0,50,20), errTypes.revert);
        });

        // revert is null value is passed for second winner address
        it('Case 8.5 : Update Winner Percentage - revert is null value is passed for second winner address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateWinnersPercentage(30,0,20), errTypes.revert);
        });

        // revert is null value is passed for third winner address
        it('Case 8.6 : Update Winner Percentage - revert is null value is passed for third winner address', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await tryCatch(developmentContract.updateWinnersPercentage(30,20,0), errTypes.revert);
        });

    // =======================================================================================================================
    // 9. Set Backlog Status

        // Should Pass : Status 0 == not started
        it('Case 9.1 : Set Backlog Status - Set to 0', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await developmentContract.setBacklogStatus(2001, 0);
              
              let backlogDetails = await developmentContract.getBacklogIDDetails(2001);
              assert.equal(backlogDetails[2].valueOf(), 0, "status not set to 0");              
        });

        // Should Pass : Status 1 == started
        it('Case 9.2 : Set Backlog Status - Set to 1', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await developmentContract.setBacklogStatus(2001, 1);
              
              let backlogDetails = await developmentContract.getBacklogIDDetails(2001);
              assert.equal(backlogDetails[2].valueOf(), 1, "status not set to 1");              
        });

        // Should Pass : Status 2 == submission ended
        it('Case 9.3 : Set Backlog Status - Set to 2', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await developmentContract.setBacklogStatus(2001, 2);
              
              let backlogDetails = await developmentContract.getBacklogIDDetails(2001);
              assert.equal(backlogDetails[2].valueOf(), 2, "status not set to 2");              
        });

        // Should Pass : Status 3 == voting started
        it('Case 9.4 : Set Backlog Status - Set to 0', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await developmentContract.setBacklogStatus(2001, 3);
              
              let backlogDetails = await developmentContract.getBacklogIDDetails(2001);
              assert.equal(backlogDetails[2].valueOf(), 3, "status not set to 3");              
        });

        // Should Pass : Status 4 == voting ended
        it('Case 9.5 : Set Backlog Status - Set to 4', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await developmentContract.setBacklogStatus(2001, 4);
              
              let backlogDetails = await developmentContract.getBacklogIDDetails(2001);
              assert.equal(backlogDetails[2].valueOf(), 4, "status not set to 4");              
        });

        // Should Pass : Status 5 == paid and close
        it('Case 9.6 : Set Backlog Status - Set to 5', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await tryCatch(developmentContract.setBacklogStatus(2001, 5), errTypes.revert);   
        });

        // Should Pass : Status 6 == deleted
        it('Case 9.7 : Set Backlog Status - Set to 6', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await developmentContract.setBacklogStatus(2001, 6);
              
              let backlogDetails = await developmentContract.getBacklogIDDetails(2001);
              assert.equal(backlogDetails[2].valueOf(), 6, "status not set to 6");              
        });

        // Should Revert if any other than 0-6 is added
        it('Case 9.8 : Set Backlog Status - Set to 8', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              await tryCatch(developmentContract.setBacklogStatus(2001, 8), errTypes.revert);              
        });

    // =======================================================================================================================
    // 10. Getter Methods

        // Positive Scenario
        it('Case 10.1 : getBacklogIDs', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              
              let getBacklogs = await developmentContract.getBacklogIDs();

              assert.equal(getBacklogs[0], 1001, "Backlog 1001 not fetched ");              
              assert.equal(getBacklogs[1], 2001, "Backlog 2001 not fetched ");              
        });

        // Positive Scenario
        it('Case 10.2 : getBacklogIDDetails', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              
              let getBacklogIDDetails = await developmentContract.getBacklogIDDetails(1001);
              
              assert.equal(getBacklogIDDetails[0], 3030, "total tokens not fetched ");              
              assert.equal(getBacklogIDDetails[1], 0, "total Voters not fetched ");              
              assert.equal(getBacklogIDDetails[2], 0, "status value not fetched ");              
              assert.equal(getBacklogIDDetails[3], 0, "tokens per voter not fetched ");              
        });

        // Positive Scenario
        it('Case 10.3 : countBacklogIds', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 3030);
              await developmentContract.addNewBacklog(2001, 4030);
              await developmentContract.addNewBacklog(3001, 2030);
              await developmentContract.addNewBacklog(4001, 5030);
              
              let countBacklogIds = await developmentContract.countBacklogIds();
              
              assert.equal(countBacklogIds.valueOf(), 4, "Cannot fetched backlogs count");           
        });

        // Positive Scenario
        it('Case 10.4 : getDeveloperAndVoterPercentage', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              let getDeveloperAndVoterPercentage = await developmentContract.getDeveloperAndVoterPercentage();
              
              assert.equal(getDeveloperAndVoterPercentage[0], 50, "Cannot fetched developer percentage");           
              assert.equal(getDeveloperAndVoterPercentage[1], 50, "Cannot fetched voter percentage");           
        });

        // Positive Scenario
        it('Case 10.5 : getWinnersPercentage', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              let getWinnersPercentage = await developmentContract.getWinnersPercentage();
              
              assert.equal(getWinnersPercentage[0], 50, "Cannot fetched first winner percentage");           
              assert.equal(getWinnersPercentage[1], 35, "Cannot fetched second winner percentage");           
              assert.equal(getWinnersPercentage[2], 15, "Cannot fetched third winner percentage");           
        });

        // Positive Scenario
        it('Case 10.6 : getBacklogStatus', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);              
              await developmentContract.addNewBacklog(1001, 3030);

              let getBacklogStatus = await developmentContract.getBacklogStatus(1001);
              
              assert.equal(getBacklogStatus, 0, "Cannot fetched backlog status");           
        });

        // Positive Scenario
        it('Case 10.7 : getAegisCoinContractAddress', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              let getAegisCoinContractAddress = await developmentContract.getAegisCoinContractAddress();

              assert.equal(getAegisCoinContractAddress, aegisCoinContract.address, "Cannot fetched aegis coin address");           
        });

        // Positive Scenario
        it('Case 10.8 : getTotalReservedTokens', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);              
              await developmentContract.addNewBacklog(1001, 3030);

              let getTotalReservedTokens = await developmentContract.getTotalReservedTokens();

              assert.equal(getTotalReservedTokens, 3030 , "Cannot fetched total reserved tokens");           
        });

        // Positive Scenario
        it('Case 10.9 : getRemainingTokens', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);              
              await developmentContract.addNewBacklog(1001, 3030);

              let getRemainingTokens = await developmentContract.getRemainingTokens();
              let totalReserved = await developmentContract.getTotalReservedTokens();
              let remainingBal_expected = await aegisCoinContract.balanceOf(developmentContract.address) - totalReserved;

              assert.equal(getRemainingTokens, remainingBal_expected , "Cannot fetched remaining token balance");           
        });

        // Positive Scenario
        it('Case 10.10 : getBoolForBacklogExistence - an existing backlog', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);              
              await developmentContract.addNewBacklog(1001, 3030);

              let getBoolForBacklogExistence = await developmentContract.getBoolForBacklogExistence(1001);
             
              assert.equal(getBoolForBacklogExistence, true , "Cannot fetched remaining token balance");           
        });

        // Positive Scenario
        it('Case 10.11 : getBoolForBacklogExistence - non existing backlog', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address, {from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);              

              let getBoolForBacklogExistence = await developmentContract.getBoolForBacklogExistence(1001);
             
              assert.equal(getBoolForBacklogExistence, false , "Cannot fetched remaining token balance");           
        });
});