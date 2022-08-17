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

  const MyFT = await ethers.getContractFactory("CCoin")
  
  // Start deployment, returning a promise that resolves to a contract object
  const myFT = await MyFT.deploy()
  await myFT.deployed()
  console.log("Contract deployed to address:", myFT.address)

  saveFrontendFiles(myFT);

}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "/contracts", "src", "CCoin_contract-address");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract_address.json"),
    JSON.stringify({ Token: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync("myFT");

  fs.writeFileSync(
    path.join(contractsDir, "myFT.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  