const { ethers } = require("hardhat");
const path = require("path");

async function main() {

  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
      "gets automatically created and destroyed every time. Use the Hardhat" +
      " option '--network localhost'"
    );
  }
  // ethers is available in the global scope
  const [signer1, signer2] = await ethers.getSigners();

  console.log(
    "Deploying the contracts with the account:",
    await signer1.getAddress()
  );

  const ACoinFactory = await ethers.getContractFactory("ACoin")

  // Start deployment, returning a promise that resolves to a contract object
  const signer1Contract = await ACoinFactory.deploy()
  await signer1Contract.deployed()
  console.log("Contract deployed to address:", signer1Contract.address)

  // console.log("111111111111111111111111111111111111")
  // console.log(signer1Contract)
  // console.log("111111111111111111111111111111111111")

  const signer2Contract = signer1Contract.connect(signer2)

  // console.log("222222222222222222222222222222222222")
  // console.log(signer2Contract)
  // console.log("222222222222222222222222222222222222")

  // saveFrontendFiles(signer1Contract);

  // // Basic tests for mintNFT
  console.log("Minting NFT...", await signer1Contract.mintNFT(signer1.getAddress(), "www.baidu.com"));
  // console.log("Minting NFT...", await signer1Contract.mintNFT(signer2.getAddress(), "www.google.com"));

  // console.log("The owner of NFT 1 is ", await signer1Contract.ownerOf(1));
  // console.log("The owner of NFT 2 is ", await signer1Contract.ownerOf(2));

  // // Basic tests for owner test
  // console.log("The owner of ACoin contract is", await signer1Contract.owner());
  // console.log("The owner of ACoin contract is", await signer1Contract.getContractOwner());

  // // Basic tests for transfer test
  // console.log("The address of ACoin contract is", signer1Contract.address);
  // console.log("The address of CCoin contract is", await signer1Contract.getCCoinContractAddress());

  // console.log("The price of NFT 1 is", await signer1Contract.priceOf(1));
  await signer1Contract.setPrice(1, 1) // set price of NFT 1 to 1.001
  // console.log("The price of NFT 1 is", await signer1Contract.priceOf(1));

  // console.log("NFT 1 is on sale? ", await signer1Contract.isForSale(1));
  await signer1Contract.setForSale(1, true) // set NFT 1 to be on sale
  // console.log("NFT 1 is on sale? ", await signer1Contract.isForSale(1));

  console.log("===========================")
  console.log("Before transfer:")
  // console.log("The owner of NFT 1 is ", await signer1Contract.ownerOf(1));
  console.log("CCoin balance of ", await signer1.getAddress(), " is ", await signer1Contract.cCoinBalanceOf(signer1.getAddress()));
  console.log("CCoin balance of ", await signer2.getAddress(), " is ", await signer2Contract.cCoinBalanceOf(signer2.getAddress()));
  console.log("The NFTs of signer1 are:", await signer1Contract.getNFTs(signer1.getAddress()));
  console.log("The NFTs of signer2 are:", await signer2Contract.getNFTs(signer2.getAddress()));
  console.log("The balance of signer1 is ", await signer1Contract.balanceOf(signer1.getAddress()));
  console.log("The balance of signer2 is ", await signer2Contract.balanceOf(signer2.getAddress()));
  console.log("===========================")
  const options = { value: ethers.utils.parseEther("1.001") }
  const reciept = await signer2Contract.purchase(1, options);
  console.log("The reciept of purchase is", reciept);
  console.log("===========================")
  console.log("After transfer:")
  console.log("The owner of NFT 1 is ", await signer1Contract.ownerOf(1));
  console.log("CCoin balance of ", await signer1.getAddress(), " is ", await signer1Contract.cCoinBalanceOf(signer1.getAddress()));
  console.log("CCoin balance of ", await signer2.getAddress(), " is ", await signer2Contract.cCoinBalanceOf(signer2.getAddress()));
  console.log("The NFTs of signer1 are:", await signer1Contract.getNFTs(signer1.getAddress()));
  console.log("The NFTs of signer2 are:", await signer2Contract.getNFTs(signer2.getAddress()));
  console.log("The balance of signer1 is ", await signer1Contract.balanceOf(signer1.getAddress()));
  console.log("The balance of signer2 is ", await signer2Contract.balanceOf(signer2.getAddress()));
  console.log("===========================")
  
  console.log("The balance of ACoin Contract is ", await signer1Contract.getBalanceOfContract());

  console.log("getNumSales(signer1) is ", await signer1Contract.getNumSales(signer1.getAddress()));
  console.log("getNumSales(signer2) is ", await signer1Contract.getNumSales(signer2.getAddress()));
  console.log("getAddressToBeGivenBonus() is ", await signer1Contract.getAddressToBeGivenBonus());
  console.log("The ETH balance of signer1 is ", await signer1.getBalance());
  console.log("The ETH balance of signer2 is ", await signer2.getBalance());

  console.log("The commission of 1000 is ", await signer1Contract.getCommission(12345));
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract_address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("ACoin");

  fs.writeFileSync(
    path.join(contractsDir, "ACoin.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error)
  process.exit(1)
})
