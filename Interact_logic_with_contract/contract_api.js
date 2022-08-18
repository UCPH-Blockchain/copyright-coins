

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.
// const { ethers } = require("hardhat");

const fs = require("fs");

import { ethers } from "ethers";

// task("uploadCopyright", "upload copyright to system")
//   .addPositionalParam("authorAd", "The address of the author")
//   .addPositionalParam("copyrightURL", "URL of copyright")
//   .setAction(async ({ authorAd}, {copyrightURL}, { ethers }) =>
function uploadCopyright (authorAd,copyrightURL )
{
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const addressesFile =
    __dirname + "/../contracts/scripts/contracts/contract_address.json";

  if (!fs.existsSync(addressesFile)) {
    console.error("You need to deploy your contract first");
    return;
  }

  const addressJson = fs.readFileSync(addressesFile);
  const address = JSON.parse(addressJson);

  if ((await ethers.provider.getCode(address.Token)) === "0x") {
    console.error("You need to deploy your contract first");
    return;
  }

  const token = await ethers.getContractAt("ACoin", address.ACoin);
  // const [sender] = await ethers.getSigners();

  const copyrightID = await token.mintNFT(authorAd, copyrightURL);

  return copyrightID;
  
}



