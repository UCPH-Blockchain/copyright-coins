# 一些和Smart Contracts相关的内容

## [Creating a contract with a smart contract](https://medium.com/upstate-interactive/creating-a-contract-with-a-smart-contract-bdb67c5c8595)
首先在文件开头使用`import "./a-coin.sol";`导入`a-coin.sol`文件。
然后在`c-coin.sol`的构造函数`Constructor()`中添加
```solidity
aCoin = new ACoin(address(this));
```
来创建一个`ACoin`对象，随后使用`aCoin`对象来与ACoin智能合约进行交互。