const func = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying contracts with the account:", deployer);

  const sampleNFT = await deploy("SampleNFT", {
    from: deployer,
    contract: "SampleNFT",
    args: ["SampleNFT", "SNFT"],
    log: true,
  });
  console.log("SampleNFT deployed to:", sampleNFT.address);

  if (sampleNFT.newlyDeployed) {
    await execute(
      "JapanSuperSmartNFT",
      {
        from: deployer,
        contract: "JapanSuperSmartNFT",
        log: true,
      },
      "mint",
      deployer
    );
  }
};

module.exports = func;
module.exports.tags = ["local", "develop"];
