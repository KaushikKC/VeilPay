// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IPayrollRegistry {
    function commitPayroll(address employer, address employee, bytes32 commitment) external;
    function isEmployeeOf(address employer, address employee) external view returns (bool);
}

/// @title PaymentExecutor
/// @notice Handles stablecoin salary payments on Plasma and records payroll
///         commitments in the PayrollRegistry in a single transaction.
contract PaymentExecutor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // -----------------------------------------------------------------------
    //  Storage
    // -----------------------------------------------------------------------

    IERC20 public stablecoin;
    IPayrollRegistry public payrollRegistry;

    // -----------------------------------------------------------------------
    //  Events
    // -----------------------------------------------------------------------

    event PaymentExecuted(
        address indexed employer,
        address indexed employee,
        uint256 amount,
        bytes32 commitment,
        uint256 timestamp
    );
    event BatchPaymentExecuted(
        address indexed employer,
        uint256 employeeCount,
        uint256 totalAmount,
        uint256 timestamp
    );
    event StablecoinUpdated(address indexed oldToken, address indexed newToken);
    event RegistryUpdated(address indexed oldRegistry, address indexed newRegistry);

    // -----------------------------------------------------------------------
    //  Errors
    // -----------------------------------------------------------------------

    error ZeroAddress();
    error ZeroAmount();
    error ArrayLengthMismatch();
    error NotEmployerOfEmployee(address employee);

    // -----------------------------------------------------------------------
    //  Constructor
    // -----------------------------------------------------------------------

    /// @param _stablecoin  Address of the ERC-20 stablecoin (e.g. USDC on Plasma).
    /// @param _registry    Address of the deployed PayrollRegistry.
    constructor(address _stablecoin, address _registry) Ownable(msg.sender) {
        if (_stablecoin == address(0) || _registry == address(0)) revert ZeroAddress();
        stablecoin = IERC20(_stablecoin);
        payrollRegistry = IPayrollRegistry(_registry);
    }

    // -----------------------------------------------------------------------
    //  Admin
    // -----------------------------------------------------------------------

    function setStablecoin(address _stablecoin) external onlyOwner {
        if (_stablecoin == address(0)) revert ZeroAddress();
        address old = address(stablecoin);
        stablecoin = IERC20(_stablecoin);
        emit StablecoinUpdated(old, _stablecoin);
    }

    function setRegistry(address _registry) external onlyOwner {
        if (_registry == address(0)) revert ZeroAddress();
        address old = address(payrollRegistry);
        payrollRegistry = IPayrollRegistry(_registry);
        emit RegistryUpdated(old, _registry);
    }

    // -----------------------------------------------------------------------
    //  Payments
    // -----------------------------------------------------------------------

    /// @notice Pay a single employee and record the payroll commitment.
    /// @dev    Caller must have approved this contract for `amount` of stablecoin.
    /// @param employee    Recipient address.
    /// @param amount      Payment amount in stablecoin (with decimals).
    /// @param commitment  Poseidon(employeeAddress, salary, nonce).
    function payEmployee(
        address employee,
        uint256 amount,
        bytes32 commitment
    ) external nonReentrant {
        if (employee == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();

        // Transfer stablecoin from employer to employee
        stablecoin.safeTransferFrom(msg.sender, employee, amount);

        // Record commitment in registry
        payrollRegistry.commitPayroll(msg.sender, employee, commitment);

        emit PaymentExecuted(msg.sender, employee, amount, commitment, block.timestamp);
    }

    /// @notice Pay multiple employees in a single transaction.
    /// @param employees    Array of employee addresses.
    /// @param amounts      Array of payment amounts.
    /// @param commitments  Array of Poseidon commitments.
    function batchPayEmployees(
        address[] calldata employees,
        uint256[] calldata amounts,
        bytes32[] calldata commitments
    ) external nonReentrant {
        uint256 len = employees.length;
        if (len != amounts.length || len != commitments.length) revert ArrayLengthMismatch();

        uint256 totalAmount = 0;

        for (uint256 i = 0; i < len; i++) {
            if (employees[i] == address(0)) revert ZeroAddress();
            if (amounts[i] == 0) revert ZeroAmount();

            stablecoin.safeTransferFrom(msg.sender, employees[i], amounts[i]);
            payrollRegistry.commitPayroll(msg.sender, employees[i], commitments[i]);

            totalAmount += amounts[i];

            emit PaymentExecuted(
                msg.sender,
                employees[i],
                amounts[i],
                commitments[i],
                block.timestamp
            );
        }

        emit BatchPaymentExecuted(msg.sender, len, totalAmount, block.timestamp);
    }
}
