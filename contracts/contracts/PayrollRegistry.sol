// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PayrollRegistry
/// @notice Stores payroll commitments on-chain. Each commitment is a Poseidon
///         hash of (employeeAddress, salary, nonce) that binds an employer to a
///         payment without revealing the salary publicly.
contract PayrollRegistry is Ownable {

    // -----------------------------------------------------------------------
    //  Types
    // -----------------------------------------------------------------------

    struct PayrollCommitment {
        bytes32 commitment;   // Poseidon(employeeAddress, salary, nonce)
        uint256 timestamp;
        address employer;
    }

    // -----------------------------------------------------------------------
    //  Storage
    // -----------------------------------------------------------------------

    /// @notice employee address => array of payroll commitments
    mapping(address => PayrollCommitment[]) private _employeePayroll;

    /// @notice employer address => employee address => true if registered
    mapping(address => mapping(address => bool)) public isEmployeeOf;

    /// @notice employer address => list of employee addresses
    mapping(address => address[]) private _employerEmployees;

    /// @notice Addresses authorised to call commitPayroll on behalf of employer
    mapping(address => bool) public authorisedExecutors;

    // -----------------------------------------------------------------------
    //  Events
    // -----------------------------------------------------------------------

    event EmployeeRegistered(address indexed employer, address indexed employee);
    event EmployeeRemoved(address indexed employer, address indexed employee);
    event PayrollCommitted(
        address indexed employer,
        address indexed employee,
        bytes32 commitment,
        uint256 timestamp
    );
    event ExecutorAuthorised(address indexed executor, bool authorised);

    // -----------------------------------------------------------------------
    //  Errors
    // -----------------------------------------------------------------------

    error NotEmployer();
    error EmployeeAlreadyRegistered();
    error EmployeeNotRegistered();
    error ZeroAddress();
    error NotAuthorised();

    // -----------------------------------------------------------------------
    //  Constructor
    // -----------------------------------------------------------------------

    constructor() Ownable(msg.sender) {}

    // -----------------------------------------------------------------------
    //  Modifiers
    // -----------------------------------------------------------------------

    modifier onlyEmployerOf(address employee) {
        if (!isEmployeeOf[msg.sender][employee]) revert NotEmployer();
        _;
    }

    modifier onlyAuthorisedOrEmployer(address employee) {
        if (!isEmployeeOf[msg.sender][employee] && !authorisedExecutors[msg.sender]) {
            revert NotAuthorised();
        }
        _;
    }

    // -----------------------------------------------------------------------
    //  Admin
    // -----------------------------------------------------------------------

    /// @notice Owner can authorise external contracts (e.g. PaymentExecutor)
    ///         to call commitPayroll.
    function setExecutorAuthorised(address executor, bool authorised) external onlyOwner {
        if (executor == address(0)) revert ZeroAddress();
        authorisedExecutors[executor] = authorised;
        emit ExecutorAuthorised(executor, authorised);
    }

    // -----------------------------------------------------------------------
    //  Employee management
    // -----------------------------------------------------------------------

    /// @notice Register an employee under the calling employer.
    function registerEmployee(address employee) external {
        if (employee == address(0)) revert ZeroAddress();
        if (isEmployeeOf[msg.sender][employee]) revert EmployeeAlreadyRegistered();

        isEmployeeOf[msg.sender][employee] = true;
        _employerEmployees[msg.sender].push(employee);

        emit EmployeeRegistered(msg.sender, employee);
    }

    /// @notice Remove an employee from the calling employer's roster.
    function removeEmployee(address employee) external onlyEmployerOf(employee) {
        isEmployeeOf[msg.sender][employee] = false;

        // Remove from array
        address[] storage emps = _employerEmployees[msg.sender];
        for (uint256 i = 0; i < emps.length; i++) {
            if (emps[i] == employee) {
                emps[i] = emps[emps.length - 1];
                emps.pop();
                break;
            }
        }

        emit EmployeeRemoved(msg.sender, employee);
    }

    /// @notice Get all employees of a given employer.
    function getEmployees(address employer) external view returns (address[] memory) {
        return _employerEmployees[employer];
    }

    // -----------------------------------------------------------------------
    //  Commitments
    // -----------------------------------------------------------------------

    /// @notice Record a payroll commitment for an employee.
    /// @dev    Can be called by the employer directly or by an authorised
    ///         executor contract (e.g. PaymentExecutor).
    /// @param employer  The employer address (used when called via executor).
    /// @param employee  The employee address.
    /// @param commitment Poseidon(employeeAddress, salary, nonce).
    function commitPayroll(
        address employer,
        address employee,
        bytes32 commitment
    ) external {
        // Caller must be the employer themselves or an authorised executor
        if (msg.sender == employer) {
            if (!isEmployeeOf[employer][employee]) revert NotEmployer();
        } else if (!authorisedExecutors[msg.sender]) {
            revert NotAuthorised();
        }

        PayrollCommitment memory pc = PayrollCommitment({
            commitment: commitment,
            timestamp: block.timestamp,
            employer: employer
        });

        _employeePayroll[employee].push(pc);

        emit PayrollCommitted(employer, employee, commitment, block.timestamp);
    }

    /// @notice Retrieve all payroll commitments for an employee.
    function getEmployeeCommitments(
        address employee
    ) external view returns (PayrollCommitment[] memory) {
        return _employeePayroll[employee];
    }

    /// @notice Retrieve the latest payroll commitment for an employee.
    function getLatestCommitment(
        address employee
    ) external view returns (PayrollCommitment memory) {
        PayrollCommitment[] storage cs = _employeePayroll[employee];
        require(cs.length > 0, "No commitments");
        return cs[cs.length - 1];
    }

    /// @notice Total number of payroll commitments for an employee.
    function getCommitmentCount(address employee) external view returns (uint256) {
        return _employeePayroll[employee].length;
    }
}
