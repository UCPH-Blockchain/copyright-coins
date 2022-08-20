const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");

describe("Token contract", function () {
    async function deployTokenFixture() {
        // Get the ContractFactory and Signers here.
        const ACoin = await ethers.getContractFactory("ACoin");
        const [owner, addr1, addr2] = await ethers.getSigners();

        const hardhatACoin = await ACoin.deploy();
        await hardhatACoin.deployed();

        return { ACoin, hardhatACoin, owner, addr1, addr2 };
    }

    describe("Deployment", function () {

        it("Should set the right owner", async function () {
            const { hardhatACoin, owner } = await loadFixture(deployTokenFixture);
            expect(await hardhatACoin.getContractOwner()).to.equal(owner.address);
        });

        it("Should assign the total supply to the owner", async function () {
            const { hardhatACoin, owner } = await loadFixture(deployTokenFixture);
            const ownerBalance = await hardhatACoin.balanceOf(owner.address);
            expect(await hardhatACoin.getBalanceOfContract()).to.equal(ownerBalance);
        });
    });

    describe("Minting", function () {
        it("Should mint a new ACoin by mintNFTAnyone", async function () {
            const { hardhatACoin, owner } = await loadFixture(deployTokenFixture);
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const len = await hardhatACoin.getAllTokenIdsOf(owner.address)
            expect(len.length).to.equal(1);
        })

        it("Should mint a new ACoin by mintNFTWithMD5", async function () {
            const { hardhatACoin, owner } = await loadFixture(deployTokenFixture);
            const tokenId = await hardhatACoin.mintNFTWithMD5("This is a ACoin", "12345678");
            const len = await hardhatACoin.getAllTokenIdsOf(owner.address)
            expect(len.length).to.equal(1);
        })

        it("Should set the right owner when mint ACoin", async function () {
            const { hardhatACoin, owner } = await loadFixture(deployTokenFixture);
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const minter = await hardhatACoin.getOwnerByURI("This is a ACoin");
            expect(minter).to.equal(owner.address);
        })
    })

    // describe("Refund", function () {
    //     it("Should refund the extra ETH to the buyer", async function () {
    //         const { hardhatACoin, owner } = await loadFixture(deployTokenFixture);
    //         const owner_balance1 = await owner.getBalance();
    //         await hardhatACoin._refund(owner.address, 1000, 1, 2000, { gasLimit: 1 * 10 ** 6 });
    //         const owner_balance2 = await owner.getBalance();
    //         expect(owner_balance2 - owner_balance1).to.most(999);
    //     }).timeout(10000);
    // })

    describe("Transactions", function () {
        it("Should transfer ACoins between accounts", async function () {
            const { hardhatACoin, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);

            //transger an Acoin to addr1
            await hardhatACoin.transfer(addr1.address, tokenId_[0], { gasLimit: 1 * 10 ** 6 });
            const tokenId_1 = await hardhatACoin.getNFTs();
            //transfer succesfully
            expect(tokenId_1.length).to.equal(1);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            // await expect(
            //     hardhatToken.connect(addr1).transfer(addr2.address, 50)
            // ).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
        });

        it("should emit Transfer events", async function () {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            // Transfer 50 tokens from owner to addr1
            await expect(hardhatToken.transfer(addr1.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(owner.address, addr1.address, 50);

            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 50))
                .to.emit(hardhatToken, "Transfer")
                .withArgs(addr1.address, addr2.address, 50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const { hardhatToken, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);

            // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                hardhatToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("Not enough tokens");

            // Owner balance shouldn't have changed.
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });
    });
});