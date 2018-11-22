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
    // const BigNumber = web3.BigNumber;

    // =======================================================================================================================
    // Initial Setup

        // Initial setup positive scenario
        it('Case 1.1 : Initialization ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              let getDevVoterPer = await aegisCoinContract.getDeveloperVoterPercentage();
              let getWinnerPer = await aegisCoinContract.getWinnerPercentage();

              // console.log("Get Dev And VoterPer ========> ", getDevVoterPer);
              // console.log("Get Winner Per ========> ", getWinnerPer);

              assert.equal(getDevVoterPer[0].valueOf(), developementPercentage, "Developer Percentage does not match! ");
              assert.equal(getDevVoterPer[1].valueOf(), voterPercentage, "Voter Percentage does not match! ");
              assert.equal(getWinnerPer[0].valueOf(), firstWinnerPercentage, "First Winner Percentage does not match! ");
              assert.equal(getWinnerPer[1].valueOf(), secondWinnerPercentage, "Second Winner Percentage does not match! ");
              assert.equal(getWinnerPer[2].valueOf(), thirdWinnerPercentage, "Third Winner Percentage does not match! ");
        });

    // =======================================================================================================================
    // Add New Backlog

        // Add new backlog
        it('Case 2.1 : Add new backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2000);
              await developmentContract.addNewBacklog(2001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);  // it over rides previous value set with this id

              let backlogIds = await developmentContract.getBacklogIDs();  
              console.log("\n Backlog IDs: ", backlogIds.valueOf());

              let backlogIdDetails = await developmentContract.getBacklogID(2001);    // id: 1000 . doesn't throw any error and return with 0 value
              console.log("\n Backlog ID: 1001 Details: \n", backlogIdDetails.valueOf());            
        });

    // =======================================================================================================================
    // Remove Backlog

        // Remove Existing backlogid
        it('Case 3.1 : Remove Existing backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await developmentContract.deleteBacklog(2001);

              let backlogIds = await developmentContract.getBacklogIDs();  
              console.log("\n Backlog IDs: ", backlogIds.valueOf());

              let backlogIdDetails = await developmentContract.getBacklogID(2001);    // id: 1000 . doesn't throw any error and return with 0 value
              console.log("\n Backlog ID: 1001 Details: \n", backlogIdDetails.valueOf());            
        });

        // Remove non-existing backlogid
        it('Case 3.2 : Remove non-existing backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await tryCatch(developmentContract.deleteBacklog(5001), errTypes.revert);
        });


    // =======================================================================================================================
    // Update Backlog

        // update backlog
        it('Case 4.1 : Update existing backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await developmentContract.updateBacklog(3001, 59820);

              let Details = await developmentContract.getBacklogID(3001);
              console.log("\n Details: ", Details.valueOf());
        });


        // update backlog
        it('Case 4.2 : Update non-existing backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030);
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              await tryCatch(developmentContract.updateBacklog(5001, 39476), errTypes.revert);
        });

    // =======================================================================================================================
    // Release Tokens

        // Need to look for decimal values when transfering tokens to winners
        it('Case 5.1 : Release Tokens For Complete Backlog ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);

              // WARNING: TBD: the values that is passed should be in it's least denomination
              await developmentContract.addNewBacklog(1001, 2030);
              await developmentContract.addNewBacklog(2001, 3030000000000000);    // developers: 1515 tokens === voters: 1515 tokens
              await developmentContract.addNewBacklog(3001, 4030);
              await developmentContract.addNewBacklog(4001, 5030);

              let voters = [accounts[5], accounts[6], accounts[7], accounts[8]];

              let bal2 = await aegisCoinContract.balanceOf(accounts[2]);    // winner -1 
              let bal3 = await aegisCoinContract.balanceOf(accounts[3]);    // winner -2 
              let bal4 = await aegisCoinContract.balanceOf(accounts[4]);    // winner -3 

              console.log("\n BEFORE: ============================\n");
              console.log("\n accounts[2]: ", bal2);
              console.log("\n accounts[3]: ", bal3);
              console.log("\n accounts[4]: ", bal4);

              // await aegisCoinContract.releaseTokens(2001, accounts[2], accounts[3], accounts[4], 100);
              let boolValue = await developmentContract.setStatus(2001, 2);
              await developmentContract.releaseTokensForCompleteBacklog(2001, accounts[2], accounts[3], accounts[4], 100);
              await developmentContract.releaseTokensForVoters(2001, voters);

              let bal2_aft = await aegisCoinContract.balanceOf(accounts[2]);      // expected : 757.5 tokens
              let bal3_aft = await aegisCoinContract.balanceOf(accounts[3]);      // expected : 530.25 tokens
              let bal4_aft = await aegisCoinContract.balanceOf(accounts[4]);      // expected : 227.25 tokens
              let bal5_aft = await aegisCoinContract.balanceOf(accounts[5]);      // expected : 15.15 tokens
              let bal6_aft = await aegisCoinContract.balanceOf(accounts[6]);      // expected : 15.15 tokens
              let bal7_aft = await aegisCoinContract.balanceOf(accounts[7]);      // expected : 15.15 tokens
              let bal8_aft = await aegisCoinContract.balanceOf(accounts[8]);      // expected : 15.15 tokens

              console.log("\n After: ============================\n");
              console.log("\n accounts[2]: ", bal2_aft.valueOf());
              console.log("\n accounts[3]: ", bal3_aft.valueOf());
              console.log("\n accounts[4]: ", bal4_aft.valueOf());
              console.log("\n Voter: accounts[5]: ", bal5_aft.valueOf());
              console.log("\n Voter: accounts[6]: ", bal6_aft.valueOf());
              console.log("\n Voter: accounts[7]: ", bal7_aft.valueOf());
              console.log("\n Voter: accounts[8]: ", bal8_aft.valueOf());

              let backlogIdDetails = await developmentContract.getBacklogID(2001);    // id: 1000 . doesn't throw any error and return with 0 value
              console.log("\n Backlog ID: 1001 Details: \n", backlogIdDetails.valueOf());            
        });
});