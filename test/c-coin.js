// This is an example test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// We use `loadFixture` to share common setups (or fixtures) between tests.
// Using this simplifies your tests and makes them run faster, by taking
// advantage of Hardhat Network's snapshot functionality.
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");

// `describe` is a Mocha function that allows you to organize your tests.
// Having your tests organized makes debugging them easier. All Mocha
// functions are available in the global scope.
//
// `describe` receives the name of a section of your test suite, and a
// callback. The callback must define the tests of that section. This callback
// can't be an async function.
describe("CCoin contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshopt in every test.
  async function deployATokenFixture() {
    // Get the ContractFactory and Signers here.
    const TokenA = await ethers.getContractFactory("ACoin");
    const [accountOwnerA, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const hardhatAToken = await TokenA.deploy();

    await hardhatAToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { TokenA, hardhatAToken, accountOwnerA, addr1, addr2 };
  }

  async function deployCTokenFixture() {
    // Get the ContractFactory and Signers here.
    const TokenC = await ethers.getContractFactory("CCoin");
    const [accountOwnerC, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const hardhatCToken = await TokenC.deploy();

    await hardhatCToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { TokenC, hardhatCToken, accountOwnerC, addr1, addr2 };
  }

  async function deployTokenFixture() {
    const TokenA = await ethers.getContractFactory("ACoin");
    const [accountOwner, addr1, addr2] = await ethers.getSigners();
  
      // To deploy our contract, we just have to call Token.deploy() and await
      // its deployed() method, which happens onces its transaction has been
      // mined.
    const hardhatAToken = await TokenA.deploy();
  
    await hardhatAToken.deployed();

    const TokenC = await ethers.getContractFactory("CCoin");
    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const hardhatCToken = await TokenC.deploy(hardhatAToken.address);

    await hardhatCToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { TokenA, TokenC, hardhatAToken, hardhatCToken, accountOwner, addr1, addr2 };
  }

  describe("only ACoin can call CCoin", function () {
    it("MintFT in CCoin", async function () {
      const { hardhatCToken, accountOwner } = await loadFixture(
            deployTokenFixture
          );
      await expect(
        hardhatCToken.mintFT(accountOwner.address)
      ).to.be.revertedWith("Only ACoin contract can call this CCoin function.");
    });

    it("reduceBalance in CCoin", async function () {
      const { hardhatCToken, accountOwner } = await loadFixture(
            deployTokenFixture
          );
      await expect(
        hardhatCToken.mintManyFT(accountOwner.address, 33)
      ).to.be.revertedWith("Only ACoin contract can call this CCoin function.");
      });

      it("mintManyFT in CCoin", async function () {
        const { hardhatCToken, accountOwner } = await loadFixture(
              deployTokenFixture
            );
        await expect(
          hardhatCToken.reduceBalance(accountOwner.address, 33)
        ).to.be.revertedWith("Only ACoin contract can call this CCoin function.");
        });

      it("mintTransferCCoin in CCoin", async function () {
        const { hardhatCToken, accountOwner} = await loadFixture(
               deployTokenFixture
            );
        await expect(
           hardhatCToken.mintTransferCCoin(accountOwner.address, 33)
        ).to.be.revertedWith("Only ACoin contract can call this CCoin function.");
      });
  });

  describe("Transactions", function () {
    it("Should mint Ccoins through ACoin", async function () {
      const { hardhatAToken} = await loadFixture(
        deployTokenFixture
      );
      await hardhatAToken.cCoinMintFT();
      expect(Number(await hardhatAToken.cCoinAmountOf())).to.equal(1);
    });

    it("Should mint many Ccoins through ACoin", async function () {
        const { hardhatAToken} = await loadFixture(
          deployTokenFixture
        );
        await hardhatAToken.cCoinMintManyFT(10);
        expect(Number(await hardhatAToken.cCoinAmountOf())).to.equal(10);
        expect(Number(await hardhatAToken.cCoinTotalBlanceOf())).to.equal(10);

        await hardhatAToken.cCoinMintManyFT(1001);
        expect(Number(await hardhatAToken.cCoinAmountOf())).to.equal(1011);
        expect(Number(await hardhatAToken.cCoinTotalBlanceOf())).to.equal(1000);
      });

    

    it("Should reduce CCoins through ACoins", async function () {
        const { hardhatAToken } = await loadFixture(
          deployTokenFixture
        );

        await hardhatAToken.cCoinMintManyFT(100);
        expect(Number(await hardhatAToken.cCoinTotalBlanceOf())).to.equal(100);

        await hardhatAToken.cCoinReduceBalance(10);
        expect(Number(await hardhatAToken.cCoinTotalBlanceOf())).to.equal(90);

        await expect(
            hardhatAToken.cCoinReduceBalance(100)
         ).to.be.revertedWith("ERC20: burn amount exceeds balance");
      });

  });
});