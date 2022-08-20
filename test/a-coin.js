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

    describe("Transfer", function () {
        it("Should transfer ACoins between accounts", async function () {
            const { hardhatACoin, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);

            await hardhatACoin.setPrice(tokenId_[0], 1);

            //transger an Acoin to addr1
            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
            await hardhatACoin.transfer(addr1.address, tokenId_[0], options);
            const tokenId_1 = await hardhatACoin.connect(addr1).getNFTs();
            //transfer succesfully
            expect(tokenId_1.length).to.equal(1);

            // Transfer an ACoin from addr1 to addr2
            await hardhatACoin.connect(addr1).transfer(addr2.address, tokenId_1[0], options);
            const tokenId_2 = await hardhatACoin.connect(addr2).getNFTs();
            //transfer succesfully
            expect(tokenId_2.length).to.equal(1);
        });

        it("should emit Transfer events", async function () {
            const { hardhatACoin, owner, addr1, addr2 } = await loadFixture(
                deployTokenFixture
            );

            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);

            await hardhatACoin.setPrice(tokenId_[0], 1);
            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }

            //transfer an Acoin to addr1
            await expect(hardhatACoin.transfer(addr1.address, tokenId_[0], options))
                .to.emit(hardhatACoin, "Transfer")
                .withArgs(owner.address, addr1.address, tokenId_[0]);

            // Transfer an Acoin from addr1 to addr2
            await expect(hardhatACoin.connect(addr1).transfer(addr2.address, tokenId_[0], options))
                .to.emit(hardhatACoin, "Transfer")
                .withArgs(addr1.address, addr2.address, tokenId_[0]);
        });

        it("Should fail if sender transfer other's ACoin", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );

            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();

            const initialOwnerBalance = await hardhatACoin.balanceOf(owner.address);

            // Try to send 1 ACoin from addr1 (0 tokens) to owner.
            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
            await expect(
                hardhatACoin.connect(addr1).transfer(owner.address, tokenId_[0], options)
            ).to.be.revertedWith("It is not your token, so you cannot transfer it.");

            // Owner balance shouldn't have changed.
            expect(await hardhatACoin.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });

        it("Should fail if sender transfer ACoin to itself", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );

            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();

            const initialOwnerBalance = await hardhatACoin.balanceOf(owner.address);

            // Try to send 1 ACoin from addr1 (0 tokens) to owner.
            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
            await expect(
                hardhatACoin.transfer(owner.address, tokenId_[0], options)
            ).to.be.revertedWith("You cannot transfer to yourself.");

            // Owner balance shouldn't have changed.
            expect(await hardhatACoin.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });

        it("Should fail if sender doesn't have enough ACoin", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );

            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            await hardhatACoin.setPrice(tokenId_[0], 10000000000);

            const initialOwnerBalance = await hardhatACoin.balanceOf(owner.address);

            // Try to send 1 ACoin from addr1 (0 tokens) to owner.
            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
            await expect(
                hardhatACoin.transfer(addr1.address, tokenId_[0], options)
            ).to.be.revertedWith("You do not have enough ether to pay");

            // Owner balance shouldn't have changed.
            expect(await hardhatACoin.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });
    });

    describe("Purchase", function () {
        it("Should purchase an ACoin", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);
            await hardhatACoin.setPrice(tokenId_[0], 1);
            // expect(await hardhatACoin.priceOf(tokenId_[0])).to.equal(1);
            await hardhatACoin.setForSale(tokenId_[0], true);

            const options = { value: ethers.utils.parseEther("1000000000000000"), gasLimit: 1 * 10 ** 6 }
            await hardhatACoin.connect(addr1).purchase(tokenId_[0], options);
            const tokenId_1 = await hardhatACoin.connect(addr1).getNFTs();
            //purchase succesfully
            expect(tokenId_1.length).to.equal(1);
        })

        it("Should not purchase an ACoin when it cannot be sold", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);
            await hardhatACoin.setPrice(tokenId_[0], 1);
            // expect(await hardhatACoin.priceOf(tokenId_[0])).to.equal(1);
            await hardhatACoin.setForSale(tokenId_[0], false);

            const options = { value: ethers.utils.parseEther("1000000000000000"), gasLimit: 1 * 10 ** 6 }
            await expect(hardhatACoin.connect(addr1).purchase(tokenId_[0], options))
                .to.be.revertedWith("This token is not for sale");
        })

        it("Should not purchase your own ACoin", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);
            await hardhatACoin.setPrice(tokenId_[0], 1);
            // expect(await hardhatACoin.priceOf(tokenId_[0])).to.equal(1);
            await hardhatACoin.setForSale(tokenId_[0], true);

            const options = { value: ethers.utils.parseEther("1000000000000000"), gasLimit: 1 * 10 ** 6 }
            await expect(hardhatACoin.purchase(tokenId_[0], options))
                .to.be.revertedWith("You cannot purchase your own token.");
        });

        it("Should not purchase when buyer doesn't have enough ether to pay", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);
            await hardhatACoin.setPrice(tokenId_[0], 100000000000000);
            // expect(await hardhatACoin.priceOf(tokenId_[0])).to.equal(1);
            await hardhatACoin.setForSale(tokenId_[0], false);

            const options = { value: ethers.utils.parseEther("1"), gasLimit: 1 * 10 ** 6 }
            await expect(hardhatACoin.connect(addr1).purchase(tokenId_[0], options))
                .to.be.revertedWith("You do not have enough ether to pay");
        });
    });
})