import React from "react";

import { ethers } from "ethers";



// task("uploadCopyright", "upload copyright to system")
//   .addPositionalParam("authorAd", "The address of the author")
//   .addPositionalParam("copyrightURL", "URL of copyright")
//   .setAction(async ({ authorAd}, {copyrightURL}, { ethers }) =>
async function uploadCopyright(authorAd, copyrightURL) {
  if (network.name === "hardhat") {
    console.warn(
      "You are running the faucet task with Hardhat network, which" +
      "gets automatically created and destroyed every time. Use the Hardhat" +
      " option '--network localhost'"
    );
  }


  const addressesFile =
    __dirname + "/contract_address/contract_address.json";

  console.log("addressesFile=", addressesFile);

  if (!fs.existsSync(addressesFile)) {
    console.error("You need to deploy your contract first. Otherwise we can't get the address.");
    return;
  }

  const addressJson = fs.readFileSync(addressesFile);
  const address = JSON.parse(addressJson);

  console.log("address=", address);

  console.log("address.Token=", address.Token);

  if (await (ethers.provider.getCode(address.Token)) === "0x") {
    console.error("You need to deploy your contract first. We find you have not deployed it yet. \
    If you see this, please run `npx hardhat run scripts/deploy.js --network localhost` at first.");
    return;
  }

  const Atoken = new ethers.Contract("ACoin", address.Token);

  // console.log("address", Atoken.address);
  // console.log("token", Atoken);

  // const [sender] = await ethers.getSigners();

  // We can't get NFT ID, since it is not 'view'
  // See this for detail:  https://ethereum.stackexchange.com/questions/88119/i-see-no-way-to-obtain-the-return-value-of-a-non-view-function-ethers-js
  const copyrightID = await Atoken.mintNFT(authorAd, copyrightURL);

  const balance = await Atoken.ownerOf("1");
  // return copyrightID;
  return balance;
}
uploadCopyright("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "copyrightURL").then(res => { 
  console.log(res);
 })