// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockUSDC
/// @notice A mock USDC token for testing. Uses 6 decimals like real USDC.
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 10_000_000 * 10 ** 6); // 10M USDC
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Mint tokens to any address (for testing only).
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
