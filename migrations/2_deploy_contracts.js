const Custody = artifacts.require("../contracts/GameStarCustody");
const BEP20Token = artifacts.require("../contracts/BEP20Token");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(BEP20Token);
  const btcbToken = await BEP20Token.deployed();
  await deployer.deploy(Custody, btcbToken.address);
  const gsc = await Custody.deployed();
};
