require("dotenv").config();
const fs = require("fs");
const { ethers } = require("hardhat");

const frontEndContractsFile = "../front-end/src/constants/contractAddresses.json";
const frontEndAbiLocation = "../front-end/src/constants/";

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...");
        await updateContractAddresses();
        await updateAbi();
        console.log("Front end written!");
    }
};

async function updateAbi() {
    const daoContract = await ethers.getContract("DAO");
    console.log(daoContract);
    fs.writeFileSync(`${frontEndAbiLocation}DAO.abi.json`, daoContract.interface.format(ethers.utils.FormatTypes.json));
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const daoContract = await ethers.getContract("DAO")
    const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
    if (chainId in contractAddresses) {
        if (!contractAddresses[chainId]["DAO"].includes(daoContract.address)) {
            contractAddresses[chainId]["DAO"].push(daoContract.address)
        }
    } else {
        contractAddresses[chainId] = { daoContract: [daoContract.address] }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"];
