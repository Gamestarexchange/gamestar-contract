const Custody = artifacts.require("../contracts/GameStarCustody");
const BEP20Token = artifacts.require("../contracts/BEP20Token");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(BEP20Token);
  const btcbToken = await BEP20Token.deployed();
  const _custodyAddress = "0x43c5f606B4FC6C7CEABb2f7Dc758Ce8cF792f5a1";
  await deployer.deploy(Custody, btcbToken.address, _custodyAddress);
  const gsc = await Custody.deployed();
};
