# UCPH - Subjects in Blockchain - Team 3

## 配置
首先使用`npm install`命令安装依赖。

### .env
在项目目录下创建一个名为`.env`的空白文件，然后填入如下内容：
```
API_URL=https://eth-rinkeby.alchemyapi.io/v2/-mUalRDBIm_xtrI8VqIP9wkLZbpJqBqW
PRIVATE_KEY="<Your-Private-Key>"
PUBLIC_KEY="<Your-Public-Key>"
```
## 编译
```
npx hardhat compile
```

## 部署
在项目路径下打开终端，使用`npx hardhat node`启动一个单独的hardhat network，同时显示20个账户信息：
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

在该命令运行时，MetaMask可以自动检测到本地网络。切换至本地网络并使用测试账户，就可以通过MetaMask查看账户余额等信息。

> 注意：需要保持运行`npx hardhat node`的终端打开才可以持续运行该hardhat network。


另外开启一个终端，通过
```
 npx hardhat run --network localhost scripts/deploy.js
```
来在hardhat network中执行部署脚本。

## 前端
先进入到frontend目录下
'''
cd frontend
'''

之后用 "npm install" 安装依赖

启动页面
'''
npm start
'''

## TODO

### Solidity
#### NFT（也就是ACoin）
- [ ] mint和transfer等基本功能实现

#### FT（也就是CCoin）
- [ ] mint和transfer等基本功能实现

#### 测试
- [ ] 参照[Testing contracts](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)编写测试

### 前后端
#### 后端
- [ ] 与智能合约交互的函数
- [ ] 为前端提供API

#### 前端
- [ ] 调用后端API，与智能合约交互
- [ ] 用户界面

### 项目部署
- [x] 部署到本地测试链
- [ ] 部署到测试网络