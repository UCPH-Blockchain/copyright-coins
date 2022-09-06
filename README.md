# UCPH - Subjects in Blockchain - Team 3
Please find our final report at [report_group3_SBT.pdf](./report_group3_SBT.pdf).

## Configuration
First install the dependencies with the `npm install` command.

### .env
Create a blank file named `.env` in the project directory and fill in the following.
```
API_URL="<Your-API-URI>"
PRIVATE_KEY="<Your-Private-Key>"
PUBLIC_KEY="<Your-Public-Key>"
```
## Compile
```
npx hardhat compile
```

## Deploy
Open a terminal in the project path and use `npx hardhat node` to start a single hardhat network while displaying information about 20 accounts:
```
Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
...

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
```

MetaMask can automatically detect the local network when this command is run. Switching to the local network and using the test account, you can view the account balance and other information through MetaMask.

> Note: You need to keep the terminal running `npx hardhat node` open in order to keep running the hardhat network.


Open a separate terminal and use
```
 npx hardhat run --network localhost scripts/deploy.js
```
to execute the deployment script in hardhat network.

## frontend
First enter the frontend directory
```
cd frontend
```
then use
```
npm install
```
to install dependencies

Then locate at the `\frontend\node_modules\ethers`, edit the browser part in the package.json file as
```
"browser": {
    "./platform.js": "./browser-platform.js"
  }
```

finally, use
```
npm start
```
to start frontend.

## test 
After deploy, run the following command
```
npx hardhat test
```
Or, run a single test file with the following command
```
npx hardhat test --network localhost test/c-coin.js
```
