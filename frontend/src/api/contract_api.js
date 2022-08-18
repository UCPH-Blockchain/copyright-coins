

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.
// const { ethers } = require("hardhat");

const fs = require("fs");

const { ethers } = require("hardhat");

// task("uploadCopyright", "upload copyright to system")
//   .addPositionalParam("authorAd", "The address of the author")
//   .addPositionalParam("copyrightURL", "URL of copyright")
//   .setAction(async ({ authorAd}, {copyrightURL}, { ethers }) =>
async function uploadCopyright (authorAd, copyrightURL)
{
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }


  const addressesFile =
  __dirname + "/contract_address/contract_address.json";

  // console.log(addressesFile);

  if (!fs.existsSync(addressesFile)) {
    console.error("You need to deploy your contract first");
    return;
  }

  const addressJson = fs.readFileSync(addressesFile);
  const address = JSON.parse(addressJson);

  // console.log("JsonAd", address);

  // console.log("address.Token", address.Token);

  if ((ethers.provider.getCode(address.Token)) === "0x") {
    console.error("You need to deploy your contract first");
    return;
  }

  const Atoken = await ethers.getContractAt("ACoin", address.Token);

  // console.log("address", Atoken.address);
  // console.log("token", Atoken);

  // const [sender] = await ethers.getSigners();

  const copyrightID = await Atoken.mintNFT(authorAd, copyrightURL);

  return copyrightID;
}


// console.log( uploadCopyright("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "copyrightURL"));
