const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");
    arguments = ["0x6272616d00000000000000000000000000000000000000000000000000000000"];
    await deploy("DAO", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: 1,
    });
};

module.exports.tags = ["all", "dao", "main"];
