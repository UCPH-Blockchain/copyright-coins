
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
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const MyFT = await ethers.getContractFactory("ACoin")

  // Start deployment, returning a promise that resolves to a contract object
  const A_Coin = await MyFT.deploy()
  await A_Coin.deployed()
  console.log("Contract deployed to address:", A_Coin.address)

  saveFrontendFiles(A_Coin);
  const _CCoin = await ethers.getContractFactory("CCoin");

  console.log(await A_Coin.getCCoinContractAddress());
 
  const C_Coin = await _CCoin.attach(await A_Coin.getCCoinContractAddress());

  // // console.log(C_Coin.contractOwner); 

  await C_Coin.mintManyFT("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 2000);

  console.log(await C_Coin.totalBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
  console.log(await C_Coin.amountOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
  await C_Coin.reduceBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 200);
  console.log(await C_Coin.totalBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
  console.log(await C_Coin.amountOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));  
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "/contracts/contract_address");

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

















