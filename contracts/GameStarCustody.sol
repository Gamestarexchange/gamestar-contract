pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

//
// gameStarCustody contract
//
// @author bruce
// @version 1.0, 20210824
// @since 1.0.0
//
contract GameStarCustody is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 token;

    mapping(address => uint256) staked;
    mapping(address => uint256) withdrawal;
    mapping(address => uint256) disputed;

    event EventStake(address indexed user, uint256 amount);
    event EventWithdrawal(
        bytes16 indexed id,
        address indexed to,
        uint256 amount
    );
    event EventDispute(
        bytes16 indexed id,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    constructor(address tokenAddress) {
        token = IERC20(tokenAddress);
    }

    //
    // stake for ad
    //
    function stake(uint256 amount) public {
        require(amount > 0, "invalid amount");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "invalid allowance");
        token.transferFrom(msg.sender, address(this), amount);
        staked[msg.sender] = staked[msg.sender].add(amount);

        emit EventStake(msg.sender, amount);
    }

    //
    // withdraw stake,reward and so on
    //
    function withdraw(
        bytes16 id,
        address to,
        uint256 amount
    ) public onlyOwner {
        require(amount > 0, "invalid amount");
        withdrawal[to] = withdrawal[to].add(amount);
        token.transfer(to, amount);

        emit EventWithdrawal(id, to, amount);
    }

    //
    // transfer stake to winner
    //
    function dispute(
        bytes16 id,
        address from,
        address to,
        uint256 amount
    ) public onlyOwner {
        require(amount > 0, "invalid amount");
        disputed[from] = disputed[from].add(amount);
        token.transfer(to, amount);

        emit EventDispute(id, from, to, amount);
    }

    //
    // get stakes of a user
    //
    function getStaked(address user) external view returns (uint256) {
        return staked[user];
    }

    //
    // get withdrawals of a user
    //
    function getWithdrawal(address user) external view returns (uint256) {
        return withdrawal[user];
    }

    //
    // get failed dispute of a user
    //
    function getDisputed(address user) external view returns (uint256) {
        return disputed[user];
    }
}
