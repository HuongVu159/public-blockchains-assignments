// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

// Import BaseAssignment.sol
import "../BaseAssignment.sol";

import "hardhat/console.sol";

contract CensorableToken is ERC20, Ownable, AccessControl, BaseAssignment {

    mapping(address => bool) public _isBlacklisted;
    address public validator;

    event Blacklisted(address indexed account);
    event UnBlacklisted(address indexed account);

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply, address _initialOwner)
        BaseAssignment(0xc4b72e5999E2634f4b835599cE0CBA6bE5Ad3155)
        ERC20(_name, _symbol)
        Ownable(_initialOwner)
    {
        validator = 0xc4b72e5999E2634f4b835599cE0CBA6bE5Ad3155;
        
        // Mint tokens.
        _mint(_initialOwner, _initialSupply - 10 * 10**decimals());
        _mint(validator, 10 * 10**decimals());
        _isBlacklisted[_initialOwner] = false;
    }

    function setValidatorAllowance() external onlyOwnerOrValidator {
        uint256 currentBalance = balanceOf(owner());
        _approve(owner(), validator, currentBalance);
    }

    function blacklistAddress(address _account) external onlyOwnerOrValidator {
        require(isValidator(msg.sender) || msg.sender == owner(), "Not authorized");
        _isBlacklisted[_account] = true;
        emit Blacklisted(_account);
    }

    function unblacklistAddress(address _account) external onlyOwnerOrValidator {
        _isBlacklisted[_account] = false;
        emit UnBlacklisted(_account);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(!_isBlacklisted[msg.sender], "Sender is blacklisted");
        require(!_isBlacklisted[recipient], "Recipient is blacklisted");
        return super.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(!_isBlacklisted[sender], "Sender is blacklisted");
        require(!_isBlacklisted[recipient], "Recipient is blacklisted");
        return super.transferFrom(sender, recipient, amount);
    }

    function isBlacklisted(address _account) external view returns (bool) {
        return _isBlacklisted[_account];
    }

    function isValidator(address _account) public view override returns (bool) {
        return BaseAssignment.isValidator(_account);
    }

    modifier onlyOwnerOrValidator() {
        require(msg.sender == owner() || isValidator(msg.sender), "Not authorized");
        _;
    }
}