const GSC = artifacts.require("GameStarCustody");
const BtcB = artifacts.require("BEP20Token");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function toWei(ether) {
  return web3.utils.toWei(ether, "ether");
}

function toEther(wei) {
  return web3.utils.fromWei(wei, "ether")

}

contract("GSC", ([owner, user, another]) => {
  let btcb;
  let gsc;

  before(async () => {
    btcb = await BtcB.new();
    gsc = await GSC.new(btcb.address)
  });

  describe("test", () => {
    it("btcb balance", async () => {
      let balance = await btcb.balanceOf(owner);
      assert(balance.toString(), "9001000000000000000000")
    });

    it("transfer to user", async () => {
      let transfer = "1";
      await btcb.transfer(user, toWei(transfer));
      await btcb.transfer(another, toWei(transfer));
      let ownerBalance = await  btcb.balanceOf(owner);
      let userBalance = await btcb.balanceOf(user);
      assert(ownerBalance.toString(), "9000000000000000000000");
      assert(userBalance.toString(), "1000000000000000000");
    });

    it("stake to gsc", async () => {
      let approve = "0.5";
      await btcb.approve(gsc.address, toWei(approve), {from: user});
      let stake = "0.2";
      await gsc.stake(toWei(stake), {from: user});
      let gscBtcbBalance = await btcb.balanceOf(gsc.address);
      let userBalance = await btcb.balanceOf(user);
      let userStaked = await gsc.getStaked(user);
      let userWithdrawal = await gsc.getWithdrawal(user);
      let userDisputed = await gsc.getDisputed(user);
      assert(gscBtcbBalance.toString(), toWei("0.2"));
      assert(userBalance.toString(), toWei("0.8"));
      assert(userStaked.toString(), toWei("0.2"));
      assert(userWithdrawal.toString(), "0");
      assert(userDisputed.toString(), "0");
    });

    it("stake to gsc another", async () => {
      let approve = "0.5";
      await btcb.approve(gsc.address, toWei(approve), {from: another});
      let stake = "0.2";
      await gsc.stake(toWei(stake), {from: another});
      let gscBtcbBalance = await btcb.balanceOf(gsc.address);
      let anotherBalance = await btcb.balanceOf(another);
      let anotherStaked = await gsc.getStaked(another);
      let anotherWithdrawal = await gsc.getWithdrawal(another);
      let anotherDisputed = await gsc.getDisputed(another);
      assert(gscBtcbBalance.toString(), "0.4");
      assert(anotherBalance.toString(), toWei(("0.8")));
      assert(anotherStaked.toString(), toWei("0.2"));
      assert(anotherWithdrawal.toString(), "0");
      assert(anotherDisputed.toString(), "0");
    });

    it("unStaked to user", async () => {
      let id = "1000100000000000";
      let unStake = "0.1";
      await gsc.withdraw(Buffer.from(id), user, toWei(unStake));
      unStake = "0.05";
      id = "1000100000000000";
      await  gsc.withdraw(Buffer.from(id), another, toWei(unStake));

      let gscBtcbBalance = await btcb.balanceOf(gsc.address);
      let userBalance = await btcb.balanceOf(user);
      let userStaked = await gsc.getStaked(user);
      let userWithdrawal = await gsc.getWithdrawal(user);
      let userDisputed = await gsc.getDisputed(user);

      let anotherBalance = await btcb.balanceOf(another);
      let anotherStaked = await gsc.getStaked(another);
      let anotherWithdrawal = await gsc.getWithdrawal(another);
      let anotherDisputed = await gsc.getDisputed(another);

      assert(gscBtcbBalance.toString(), toWei("0.25"));

      assert(userBalance.toString(), toWei("0.9"));
      assert(userStaked.toString(), toWei("0.1"));
      assert(userWithdrawal.toString(), "0.1");
      assert(userDisputed.toString(), "0");

      assert(anotherBalance.toString(), toWei(("0.85")));
      assert(anotherStaked.toString(), toWei("0.15"));
      assert(anotherWithdrawal.toString(), "0.05");
      assert(anotherDisputed.toString(), "0");
    });

    it("dispute to user", async () => {
      let id = "1000100000000000";
      let dispute = "0.02";
      await gsc.dispute(Buffer.from(id), user, another, toWei(dispute));
      dispute = "0.01";
      id = "1000100000000000";
      await  gsc.dispute(Buffer.from(id), another, user, toWei(dispute));

      let gscBtcbBalance = await btcb.balanceOf(gsc.address);
      let userBalance = await btcb.balanceOf(user);
      let userStaked = await gsc.getStaked(user);
      let userWithdrawal = await gsc.getWithdrawal(user);
      let userDisputed = await gsc.getDisputed(user);

      let anotherBalance = await btcb.balanceOf(another);
      let anotherStaked = await gsc.getStaked(another);
      let anotherWithdrawal = await gsc.getWithdrawal(another);
      let anotherDisputed = await gsc.getDisputed(another);

      assert(gscBtcbBalance.toString(), toWei("0.22"));

      assert(userBalance.toString(), toWei("0.89"));
      assert(userStaked.toString(), toWei("0.1"));
      assert(userWithdrawal.toString(), "0.1");
      assert(userDisputed.toString(), "0.02");

      assert(anotherBalance.toString(), toWei(("0.85")));
      assert(anotherStaked.toString(), toWei("0.15"));
      assert(anotherWithdrawal.toString(), "0.05");
      assert(anotherDisputed.toString(), "0.01");
    })
  });
});
