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
    // const BigNumber = web3.BigNumber;

      
        // // ============================================================================================================
        // // TEST CASES FOR INITIAL

        // // Should revert if null address is passed as a parameter
        // it('Case 1 : Should revert if null address is passed ', async () => {
        //       businessContract = await tryCatch(BusinessAcc.new(null_address, {from: deployerAddress}), errTypes.revert); 
        // });

        // // Should revert if address passed is not of aegis-coin
        // it('Case 2 : Should revert if address passed is not of aegis-coin', async () => {
        //       businessContract = await tryCatch(BusinessAcc.new(deployerAddress, {from: deployerAddress}), errTypes.revert); 
        // });

        // // Should not revert if address passed is of aegis-coin
        // it('Case 3 : Should not revert if address passed is of aegis-coin', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress});
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        // });

        // // =============================================================================================================
        // // TEST CASES FOR TRANSFER METHODS

        // // transfer method should revert if not called by aegis-coin contract
        // it('Case 4 : transfer method should revert if not called by aegis-coin contract', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress});
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 

        //       await tryCatch(businessContract.transferTokens(accounts[0], 200, {from: deployerAddress}), errTypes.revert);
        // });

        // =============================================================================================================
        // TEST CASES FOR SET ALLOWANCE

        // // transfer method should revert if not called by aegis-coin contract
        // it('Case 5 : set allowance', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
        //       await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
        //       developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
        //       await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
        //       await aegisCoinContract.mintTokens(322*dayInSeconds);

        //       let getContractBalance = await businessContract.getContractBalance();

        //       await businessContract.setApprovalForFunds();

        //       let value = await aegisCoinContract.allowance(businessContract.address, aegisCoinContract.address);

        //       let balance = await aegisCoinContract.balanceOf(businessContract.address);

        //       console.log("\n Contract Balance : ", getContractBalance);
        //       console.log("\n Approved Balance For Admin : ", value);
        //       console.log("\n businessContract: ", businessContract.address);
        //       console.log("\n businessContract balance: ", balance);
        //       console.log("\n aegisContract: ", aegisCoinContract.address);
              
        // });


        // transfer method should revert if not called by aegis-coin contract
        it('Case 5 : transfer tokens from business', async () => {
              aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress}); 
              businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress}); 
              await businessContract.setBusinessAccountForAegisCoin({from: deployerAddress});
              developmentContract = await DevelopmentAcc.new(aegisCoinContract.address, 50, 50, 50, 35, 15, {from: deployerAddress}); 
              await developmentContract.setDevelopmentAccountForAegisCoin({from: deployerAddress});
              
              await aegisCoinContract.mintTokens(322*dayInSeconds);
              let getContractBalance = await businessContract.getContractBalance();

              // await businessContract.setApprovalForFunds();
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



        // // ============================================================================================================
        // // TEST CASES FOR GETTER METHODS

        // // getContractBalance()
        // it('Case 6 : getContractBalance', async () => {
        //       aegisCoinContract = await AegisCoin.new(50, 50, {from: deployerAddress});
        //       businessContract = await BusinessAcc.new(aegisCoinContract.address, {from: deployerAddress});

        //       let balance = await aegisCoinContract.balanceOf(businessContract.address);
        //       let test_balance = await businessContract.getContractBalance();

        //       // console.log("\n test_balance ==> ", test_balance);
        //       assert.equal(balance.valueOf(), test_balance.valueOf(), "Balances did not matched!"); 
        // });

});