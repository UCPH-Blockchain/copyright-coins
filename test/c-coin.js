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
describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshopt in every test.
  async function deployTokenFixture() {
    // Get the ContractFactory and Signers here.
    const Token = await ethers.getContractFactory("CCoin");
    const [accountOwner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // its deployed() method, which happens onces its transaction has been
    // mined.
    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Token, hardhatToken, accountOwner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { hardhatToken, accountOwner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await hardhatToken.accountOwner()).to.equal(accountOwner.address);
    });
  });




  describe("Transactions", function () {
    it("Should mint coins per account", async function () {
      const { hardhatToken, accountOwner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await hardhatToken.mintFT(addr1.address);
      await hardhatToken.mintFT(addr1.address);
      await hardhatToken.mintFT(addr2.address);
      await hardhatToken.mintFT(addr2.address);
      await hardhatToken.mintFT(addr2.address);
      await hardhatToken.mintFT(accountOwner.address);
      expect(Number(await hardhatToken.amountOf(accountOwner.address))).to.equal(1);
      expect(Number(await hardhatToken.amountOf(addr1.address))).to.equal(2);
      expect(Number(await hardhatToken.amountOf(addr2.address))).to.equal(3);
    });

    it("Should reward an account", async function () {
        const { hardhatToken, accountOwner, addr1, addr2 } = await loadFixture(
          deployTokenFixture
        );
        await hardhatToken.mintFT(accountOwner.address);
        await hardhatToken.mintFT(accountOwner.address);
        await hardhatToken.mintFT(accountOwner.address);
        await hardhatToken.reward(addr1.address, 3);
        expect(Number(await hardhatToken.TotleBalance(addr1.address))).to.equal(3);
        await hardhatToken.connect(addr1).reward(addr2.address, 3);
        expect(Number(await hardhatToken.TotleBalance(addr2.address))).to.equal(3);
      });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { hardhatToken, accountOwner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await hardhatToken.TotleBalance(accountOwner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        hardhatToken.connect(addr1).reward(accountOwner.address, 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.TotleBalance(accountOwner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});