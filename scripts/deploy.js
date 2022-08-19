
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
  
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "/frontend/src/api/contract_address");

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

















