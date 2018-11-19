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
        it('Case : Initialization ', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, developementPercentage, voterPercentage, firstWinnerPercentage, secondWinnerPercentage, thirdWinnerPercentage, {from: deployerAddress});

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

      // // Initial setup positive scenario
      //   it('Case : Initialization ', async () => {
      //         aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
      //         businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
      //         developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              
      //         aegisCoinContract.creditContracts();
      //         // let totalSupply = await aegisCoinContract.totalSupply();
      //         let owner_bal = await aegisCoinContract.balanceOf(deployerAddress);
      //         let businessContract_bal = await aegisCoinContract.balanceOf(businessContract.address);
      //         let developmentContract_bal = await aegisCoinContract.balanceOf(developmentContract.address);
              
      //     // console.log("\n Total Supply initialized ==> ", totalSupply.valueOf()); 
      //     console.log("\n Balance of Owner/Deployer Address ==> ", owner_bal.valueOf());  
      //     console.log("\n BusinessAcc Balance ==> ", businessContract_bal);  
      //     console.log("\n DevelopmentAcc Balance ==> ", developmentContract_bal);

      //   });
});