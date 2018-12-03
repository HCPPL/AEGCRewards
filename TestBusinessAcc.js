const AegisCoin = artifacts.require("AegisEconomyCoin");
const BusinessAcc = artifacts.require("BusinessAcc");
const DevelopmentAcc = artifacts.require("DevelopmentAcc");

contract('Business Contract', async (accounts) => {
  let tryCatch = require("./exceptions.js").tryCatch;
  let errTypes = require("./exceptions.js").errTypes;

    let aegisCoinContract;
    let businessContract;
    let developmentContract;
    let deployerAddress = accounts[0];
    let dayInSeconds = 86400;
              
    const null_address = '0x0000000000000000000000000000000000000000';

      
        // ============================================================================================================
        // 1. TEST CASES FOR INITIAL

        // Should revert if null address is passed as a parameter
        it('Case 1.1 : Should revert if null address is passed ', async () => {
              businessContract = await tryCatch(BusinessAcc.new(null_address, {from: deployerAddress}), errTypes.revert); 
        });

        // // Pending
        // // Should revert if address passed is not of aegis-coin
        // it('Case 1.2 : Should revert if address passed is not of aegis-coin', async () => {
        //       businessContract = await tryCatch(BusinessAcc.new(deployerAddress, {from: deployerAddress}), errTypes.revert); 
        // });

        // Should not revert if address passed is of aegis-coin
        it('Case 1.3 : Should not revert if address passed is of aegis-coin', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress});
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress});

              let aegisCoin = await businessContract.getAegisCoinAddress();
              assert.equal(aegisCoin, aegisCoinContract.address, "Aegis Coin Address not set"); 
        });

        // =============================================================================================================
        // 2. TEST CASES FOR TRANSFER METHODS

        // transfer method should revert if not called by aegis-coin contract
        it('Case 2.1 : transfer tokens from business should revert', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await aegisCoinContract.setBusinessAcc(businessContract.address, {from: deployerAddress});
              await aegisCoinContract.setDevelopmentAcc(developmentContract.address ,{from: deployerAddress});
              
              await aegisCoinContract.mintTokens(0);
              await tryCatch(businessContract.transferTokens(accounts[2], 3000, {from: deployerAddress}), errTypes.revert);
        });

});