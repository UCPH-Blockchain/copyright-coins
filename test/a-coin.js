const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");

describe("Token contract", function () {
    async function deployTokenFixture() {
        // Get the ContractFactory and Signers here.
        const ACoin = await ethers.getContractFactory("ACoin");
        const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

        const hardhatACoin = await ACoin.deploy();
        await hardhatACoin.deployed();

        return { ACoin, hardhatACoin, owner, addr1, addr2, addr3, addr4 };
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
            const options = { value: ethers.utils.parseEther("2.001"), gasLimit: 1 * 10 ** 6 }
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
        it("Should purchase an ACoin with commission fee", async function () {
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
            const initialBalance = await addr1.getBalance();

            //buyer paid more than required
            const options = { value: ethers.utils.parseEther("3.001"), gasLimit: 1 * 10 ** 6 }
            await hardhatACoin.connect(addr1).purchase(tokenId_[0], options);
            const tokenId_1 = await hardhatACoin.connect(addr1).getNFTs();

            //purchase succesfully
            expect(tokenId_1.length).to.equal(1);

            //refund successfully
            const finalBalance = await addr1.getBalance();
            expect(BigNumber.from(initialBalance).sub(BigNumber.from(finalBalance))).to.most(ethers.utils.parseEther("1.00101"));
        })

        it("Should purchase an ACoin when Ccoin can waive commission fee", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            await hardhatACoin.setPrice(tokenId_[0], 1);
            await hardhatACoin.setForSale(tokenId_[0], true);

            //addr1 mint more than 100 Ccoin that can waive commission fee
            await hardhatACoin.connect(addr1).cCoinMintManyFT(123);
            const initialBalance = await addr1.getBalance();

            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
            await hardhatACoin.connect(addr1).purchase(tokenId_[0], options);
            const tokenId_1 = await hardhatACoin.connect(addr1).getNFTs();
            //purchase succesfully
            expect(tokenId_1.length).to.equal(1);

            //refund successfully
            const finalBalance = await addr1.getBalance();
            expect(BigNumber.from(initialBalance).sub(BigNumber.from(finalBalance))).to.most(ethers.utils.parseEther("1.0001"));

            // //waive commission fee successfully
            expect(await hardhatACoin.connect(addr1).cCoinBalanceOf()).to.equal(24);
        })

        it("Should purchase an ACoin when Ccoin cannot waive commission fee", async function () {
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
            //addr1 mint more than 100 Ccoin that can waive commission fee
            await hardhatACoin.connect(addr1).cCoinMintManyFT(12);
            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
            await hardhatACoin.connect(addr1).purchase(tokenId_[0], options);
            const tokenId_1 = await hardhatACoin.connect(addr1).getNFTs();
            //purchase succesfully
            expect(tokenId_1.length).to.equal(1);

            //refund successfully
            expect(await hardhatACoin.connect(addr1).cCoinBalanceOf()).to.equal(13);
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

            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
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

            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }
            await expect(hardhatACoin.purchase(tokenId_[0], options))
                .to.be.revertedWith("You can't purchase your own token");
        });

        it("Should not purchase when buyer doesn't have enough ether to pay", async function () {
            const { hardhatACoin, owner, addr1 } = await loadFixture(
                deployTokenFixture
            );
            const tokenId = await hardhatACoin.mintNFTAnyone("This is a ACoin");
            const tokenId_ = await hardhatACoin.getNFTs();
            //mint succesfully
            expect(tokenId_.length).to.equal(1);
            await hardhatACoin.setPrice(tokenId_[0], 100);
            // expect(await hardhatACoin.priceOf(tokenId_[0])).to.equal(1);
            await hardhatACoin.setForSale(tokenId_[0], true);

            const options = { value: ethers.utils.parseEther("1"), gasLimit: 1 * 10 ** 6 }
            await expect(hardhatACoin.connect(addr1).purchase(tokenId_[0], options))
                .to.be.revertedWith("You do not have enough ether to pay");
        });
    });

    describe("Bonus", function () {
        var initialBalance_0
        var initialBalance_1;
        var initialBalance_2;
        var initialBalance_3;
        var initialBalance_4;
        var finalBalance_0;
        var finalBalance_1;
        var finalBalance_2;
        var finalBalance_3;
        var finalBalance_4;
        it("Should finish several purchas processes", async function () {
            const { hardhatACoin, owner, addr1, addr2, addr3, addr4 } = await loadFixture(
                deployTokenFixture
            );
            const tokenIdOwner = await hardhatACoin.mintNFTAnyone("This is a ACoin1");
            const tokenId1 = await hardhatACoin.connect(addr1).mintNFTAnyone("This is a ACoin2");
            const tokenId2 = await hardhatACoin.connect(addr2).mintNFTAnyone("This is a ACoin3");
            const tokenId3 = await hardhatACoin.connect(addr3).mintNFTAnyone("This is a ACoin4");
            const tokenId4 = await hardhatACoin.connect(addr4).mintNFTAnyone("This is a ACoin5");
            const tokenId_Owner = await hardhatACoin.getNFTs();
            const tokenId_1 = await hardhatACoin.connect(addr1).getNFTs();
            const tokenId_2 = await hardhatACoin.connect(addr2).getNFTs();
            const tokenId_3 = await hardhatACoin.connect(addr3).getNFTs();
            const tokenId_4 = await hardhatACoin.connect(addr4).getNFTs();
            const options = { value: ethers.utils.parseEther("1.001"), gasLimit: 1 * 10 ** 6 }

            await hardhatACoin.setPrice(tokenId_Owner[0], 1);
            await hardhatACoin.setForSale(tokenId_Owner[0], true);

            await hardhatACoin.connect(addr1).setPrice(tokenId_1[0], 1);
            await hardhatACoin.connect(addr1).setForSale(tokenId_1[0], true);

            await hardhatACoin.connect(addr2).setPrice(tokenId_2[0], 1);
            await hardhatACoin.connect(addr2).setForSale(tokenId_2[0], true);

            await hardhatACoin.connect(addr3).setPrice(tokenId_3[0], 1);
            await hardhatACoin.connect(addr3).setForSale(tokenId_3[0], true);

            await hardhatACoin.connect(addr4).setPrice(tokenId_4[0], 1);
            await hardhatACoin.connect(addr4).setForSale(tokenId_4[0], true);

            initialBalance_0 = await owner.getBalance();
            initialBalance_1 = await addr1.getBalance();
            initialBalance_2 = await addr2.getBalance();
            initialBalance_3 = await addr3.getBalance();
            initialBalance_4 = await addr4.getBalance();

            setTimeout(function () {
                console.log('waiting over.');
                done();
            }, 3000)

            await hardhatACoin.connect(addr1).purchase(tokenId_Owner[0], options)
            await hardhatACoin.connect(addr2).purchase(tokenId_3[0], options)
            await hardhatACoin.connect(addr4).purchase(tokenId_2[0], options)

            finalBalance_0 = await owner.getBalance();
            finalBalance_1 = await addr1.getBalance();
            finalBalance_2 = await addr2.getBalance();
            finalBalance_3 = await addr3.getBalance();
            finalBalance_4 = await addr4.getBalance();

        })

        it("Should bonus after 3 seconds", async function () {
            setTimeout(function () {
                console.log('waiting over.');
                done();
            }, 3000);
            expect(BigNumber.from(finalBalance_0).sub(BigNumber.from(initialBalance_0))).to.least(ethers.utils.parseEther("1.0003"));
        })

    })
})