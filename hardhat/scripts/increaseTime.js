const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const TEST = 80400; // 1 day in UNIX time (seconds)
const ONE_DAY_UNIX = 86400; // 1 day in UNIX time (seconds)
const ONE_WEEK_UNIX = 604800; // 1 week in UNIX time (seconds)
const ONE_MONTH_UNIX = 2419200; // 4 weeks in UNIX time (seconds)

async function increaseTime() {
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

    const blockNumber = await provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);

    await provider.send("evm_increaseTime", [ONE_WEEK_UNIX]);
    await provider.send("evm_mine");
}

increaseTime().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
