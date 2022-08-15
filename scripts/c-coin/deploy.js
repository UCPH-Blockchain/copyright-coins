async function main() {
    const MyFT = await ethers.getContractFactory("MyFT")
  
    // Start deployment, returning a promise that resolves to a contract object
    const myFT = await MyFT.deploy()
    await myFT.deployed()
    console.log("Contract deployed to address:", myFT.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  