const { assert } = require("chai");

const GSC = artifacts.require("GameStarCustody");
const BtcB = artifacts.require("BEP20Token");
const _custodyAddress = "0x43c5f606B4FC6C7CEABb2f7Dc758Ce8cF792f5a1";

require("chai")
  .use(require("chai-as-promised"))
  .should();

function toWei(ether) {
  return web3.utils.toWei(ether, "ether");
}

contract("GSC", ([owner, user, another]) => {
  let btcb;
  let gsc;

  before(async () => {
    btcb = await BtcB.new();
    gsc = await GSC.new(btcb.address, _custodyAddress)
  });

  describe("test", () => {
    it("btcb balance", async () => {
      let balance = await btcb.balanceOf(owner);
      assert.equal(balance.toString(), "9001000000000000000000")
    });

    it("transfer to user", async () => {
      let transfer = "1";
      await btcb.transfer(user, toWei(transfer));
      await btcb.transfer(another, toWei(transfer));
      let ownerBalance = await btcb.balanceOf(owner);
      let userBalance = await btcb.balanceOf(user);
      assert.equal(ownerBalance.toString(), "8999000000000000000000");
      assert.equal(userBalance.toString(), "1000000000000000000");
    });

    it("stake to gsc", async () => {
      let approve = "0.5";
      let custody = await gsc.getCustodyAddress();
      await btcb.approve(gsc.address, toWei(approve), { from: user });
      let stake = "0.2";
      await gsc.stake(toWei(stake), { from: user });
      let gscBtcbBalance = await btcb.balanceOf(custody);
      let userBalance = await btcb.balanceOf(user);
      let userStaked = await gsc.getStaked(user);
      assert.equal(gscBtcbBalance.toString(), toWei("0.2"));
      assert.equal(userBalance.toString(), toWei("0.8"));
      assert.equal(userStaked.toString(), toWei("0.2"));
      let totalStaked = await gsc.getTotalStaked();
      assert.equal(totalStaked.toString(), toWei("0.2"));
    });

    it("transfer custody address", async () => {
      let newAddress = "0x281482E19816422B0f44d6d194f72FcdbC3c1835";
      gsc.transferCustodyAddress(newAddress);
      let custody = await gsc.getCustodyAddress();
      let approve = "0.5";
      await btcb.approve(gsc.address, toWei(approve), { from: another });
      let stake = "0.2";
      await gsc.stake(toWei(stake), { from: another });
      let gscBtcbBalance = await btcb.balanceOf(custody);
      let anotherBalance = await btcb.balanceOf(another);
      let anotherStaked = await gsc.getStaked(another);
      assert.equal(gscBtcbBalance.toString(), toWei("0.2"));
      assert.equal(anotherBalance.toString(), toWei(("0.8")));
      assert.equal(anotherStaked.toString(), toWei("0.2")); 1
      let totalStaked = await gsc.getTotalStaked();
      assert.equal(totalStaked.toString(), toWei("0.4"));
      let lastCustodyBalance = await btcb.balanceOf(_custodyAddress);
      assert.equal(lastCustodyBalance.toString(), toWei("0.2"));
    });

    it("transfer owner", async () => {
      let newOnwer = "0x753a46F5a588DB7D50Be4a8ccCa5fb24202ceE67";
      await gsc.transferOwnership(newOnwer, { from: owner });
      let owner1 = await gsc.owner();
      assert.equal(owner1, newOnwer)
    })
  });
});
