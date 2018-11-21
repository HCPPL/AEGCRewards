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

        // Remove Existing backlogid
        it('Case 2.1 : Add new backlog ', async () => {
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
});