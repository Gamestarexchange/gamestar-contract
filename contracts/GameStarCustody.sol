pragma solidity ^0.8.0;

import "./includes/Ownable.sol";
import "./includes/IERC20.sol";
import "./includes/SafeMath.sol";
import "./includes/SafeERC20.sol";
import "./includes/ReentrancyGuard.sol";

//
// gameStarCustody contract
//
// @author bruce
// @version 1.0, 20210824
// @since 1.0.0
//
contract GameStarCustody is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private token;

    uint256 private totalStaked;
    address private _custodyAddress;
    mapping(address => uint256) private staked;

    event EventStake(address indexed user, uint256 amount);
    event EventCustodyAddressTransferred(
        address indexed previousAddress,
        address indexed newAddress
    );

    constructor(address tokenAddress, address custodyAddress) {
        token = IERC20(tokenAddress);
        _setCustody(custodyAddress);
    }

    //
    // stake for ad
    //
    function stake(uint256 amount) public nonReentrant {
        require(amount > 0, "invalid amount");
        staked[msg.sender] = staked[msg.sender].add(amount);
        totalStaked = totalStaked.add(amount);

        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "invalid allowance");
        token.transferFrom(msg.sender, _custodyAddress, amount);
        emit EventStake(msg.sender, amount);
    }

    //
    // transfer custody address
    //
    function transferCustodyAddress(address newAddress)
        public
        virtual
        onlyOwner
    {
        require(newAddress != address(0), "new custody is the zero address");
        _setCustody(newAddress);
    }

    function _setCustody(address newCustodyAddress) private {
        address oldCustodyAddress = _custodyAddress;
        _custodyAddress = newCustodyAddress;
        emit EventCustodyAddressTransferred(
            oldCustodyAddress,
            newCustodyAddress
        );
    }

    //
    // get stakes of a user
    //
    function getStaked(address user) external view returns (uint256) {
        return staked[user];
    }

    //
    // get total staked
    //
    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    //
    // get current custody address
    //
    function getCustodyAddress() external view returns (address) {
        return _custodyAddress;
    }
}
