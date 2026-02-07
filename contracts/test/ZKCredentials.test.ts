import { expect } from "chai";
import { ethers } from "hardhat";
import { PayrollRegistry, PaymentExecutor, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ZK-Credentials", function () {
  let registry: PayrollRegistry;
  let executor: PaymentExecutor;
  let usdc: MockUSDC;
  let owner: SignerWithAddress;
  let employer: SignerWithAddress;
  let employee: SignerWithAddress;
  let verifier: SignerWithAddress;

  const SALARY_USDC = 6000n * 10n ** 6n; // $6,000 USDC (6 decimals)

  beforeEach(async function () {
    [owner, employer, employee, verifier] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();

    // Deploy PayrollRegistry
    const PayrollRegistry = await ethers.getContractFactory("PayrollRegistry");
    registry = await PayrollRegistry.deploy();
    await registry.waitForDeployment();

    // Deploy PaymentExecutor
    const PaymentExecutor = await ethers.getContractFactory("PaymentExecutor");
    executor = await PaymentExecutor.deploy(
      await usdc.getAddress(),
      await registry.getAddress()
    );
    await executor.waitForDeployment();

    // Authorise executor in registry
    await registry.setExecutorAuthorised(await executor.getAddress(), true);

    // Fund employer with USDC
    await usdc.mint(employer.address, 1_000_000n * 10n ** 6n);
  });

  // ---------------------------------------------------------------------------
  //  PayrollRegistry
  // ---------------------------------------------------------------------------

  describe("PayrollRegistry", function () {
    it("should register an employee", async function () {
      await expect(registry.connect(employer).registerEmployee(employee.address))
        .to.emit(registry, "EmployeeRegistered")
        .withArgs(employer.address, employee.address);

      expect(await registry.isEmployeeOf(employer.address, employee.address)).to.be.true;
    });

    it("should reject duplicate employee registration", async function () {
      await registry.connect(employer).registerEmployee(employee.address);
      await expect(
        registry.connect(employer).registerEmployee(employee.address)
      ).to.be.revertedWithCustomError(registry, "EmployeeAlreadyRegistered");
    });

    it("should reject zero address employee", async function () {
      await expect(
        registry.connect(employer).registerEmployee(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(registry, "ZeroAddress");
    });

    it("should remove an employee", async function () {
      await registry.connect(employer).registerEmployee(employee.address);
      await expect(registry.connect(employer).removeEmployee(employee.address))
        .to.emit(registry, "EmployeeRemoved")
        .withArgs(employer.address, employee.address);

      expect(await registry.isEmployeeOf(employer.address, employee.address)).to.be.false;
    });

    it("should commit payroll as employer", async function () {
      await registry.connect(employer).registerEmployee(employee.address);
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("test-commitment"));

      await expect(
        registry.connect(employer).commitPayroll(employer.address, employee.address, commitment)
      ).to.emit(registry, "PayrollCommitted");

      const commitments = await registry.getEmployeeCommitments(employee.address);
      expect(commitments.length).to.equal(1);
      expect(commitments[0].commitment).to.equal(commitment);
    });

    it("should reject commitment from non-employer", async function () {
      await expect(
        registry.connect(verifier).commitPayroll(
          verifier.address,
          employee.address,
          ethers.keccak256(ethers.toUtf8Bytes("fake"))
        )
      ).to.be.revertedWithCustomError(registry, "NotEmployer");
    });

    it("should return employee list", async function () {
      await registry.connect(employer).registerEmployee(employee.address);
      const employees = await registry.getEmployees(employer.address);
      expect(employees).to.include(employee.address);
    });

    it("should get latest commitment", async function () {
      await registry.connect(employer).registerEmployee(employee.address);
      const c1 = ethers.keccak256(ethers.toUtf8Bytes("commitment-1"));
      const c2 = ethers.keccak256(ethers.toUtf8Bytes("commitment-2"));

      await registry.connect(employer).commitPayroll(employer.address, employee.address, c1);
      await registry.connect(employer).commitPayroll(employer.address, employee.address, c2);

      const latest = await registry.getLatestCommitment(employee.address);
      expect(latest.commitment).to.equal(c2);
      expect(await registry.getCommitmentCount(employee.address)).to.equal(2);
    });
  });

  // ---------------------------------------------------------------------------
  //  PaymentExecutor
  // ---------------------------------------------------------------------------

  describe("PaymentExecutor", function () {
    beforeEach(async function () {
      // Register employee and approve stablecoin
      await registry.connect(employer).registerEmployee(employee.address);
      await usdc.connect(employer).approve(await executor.getAddress(), ethers.MaxUint256);
    });

    it("should pay employee and record commitment", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("pay-commitment"));

      const balanceBefore = await usdc.balanceOf(employee.address);

      await expect(
        executor.connect(employer).payEmployee(employee.address, SALARY_USDC, commitment)
      ).to.emit(executor, "PaymentExecuted");

      const balanceAfter = await usdc.balanceOf(employee.address);
      expect(balanceAfter - balanceBefore).to.equal(SALARY_USDC);

      // Verify commitment recorded in registry
      const commitments = await registry.getEmployeeCommitments(employee.address);
      expect(commitments.length).to.equal(1);
      expect(commitments[0].commitment).to.equal(commitment);
    });

    it("should reject payment to zero address", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("c"));
      await expect(
        executor.connect(employer).payEmployee(ethers.ZeroAddress, SALARY_USDC, commitment)
      ).to.be.revertedWithCustomError(executor, "ZeroAddress");
    });

    it("should reject zero amount payment", async function () {
      const commitment = ethers.keccak256(ethers.toUtf8Bytes("c"));
      await expect(
        executor.connect(employer).payEmployee(employee.address, 0, commitment)
      ).to.be.revertedWithCustomError(executor, "ZeroAmount");
    });

    it("should batch pay employees", async function () {
      const signers = await ethers.getSigners();
      const emp1 = signers[4]!;
      const emp2 = signers[5]!;
      const emp3 = signers[6]!;
      await registry.connect(employer).registerEmployee(emp1.address);
      await registry.connect(employer).registerEmployee(emp2.address);
      await registry.connect(employer).registerEmployee(emp3.address);

      const amounts = [5000n * 10n ** 6n, 6000n * 10n ** 6n, 7000n * 10n ** 6n];
      const commitments = [
        ethers.keccak256(ethers.toUtf8Bytes("c1")),
        ethers.keccak256(ethers.toUtf8Bytes("c2")),
        ethers.keccak256(ethers.toUtf8Bytes("c3")),
      ];

      await executor.connect(employer).batchPayEmployees(
        [emp1.address, emp2.address, emp3.address],
        amounts,
        commitments
      );

      expect(await usdc.balanceOf(emp1.address)).to.equal(amounts[0]);
      expect(await usdc.balanceOf(emp2.address)).to.equal(amounts[1]);
      expect(await usdc.balanceOf(emp3.address)).to.equal(amounts[2]);
    });

    it("should reject batch with mismatched arrays", async function () {
      await expect(
        executor.connect(employer).batchPayEmployees(
          [employee.address],
          [SALARY_USDC, SALARY_USDC],
          [ethers.keccak256(ethers.toUtf8Bytes("c"))]
        )
      ).to.be.revertedWithCustomError(executor, "ArrayLengthMismatch");
    });
  });

  // ---------------------------------------------------------------------------
  //  Admin functions
  // ---------------------------------------------------------------------------

  describe("Admin", function () {
    it("should allow owner to authorise executors", async function () {
      await expect(registry.setExecutorAuthorised(verifier.address, true))
        .to.emit(registry, "ExecutorAuthorised")
        .withArgs(verifier.address, true);

      expect(await registry.authorisedExecutors(verifier.address)).to.be.true;
    });

    it("should reject non-owner from authorising executors", async function () {
      await expect(
        registry.connect(employer).setExecutorAuthorised(verifier.address, true)
      ).to.be.reverted;
    });

    it("should allow owner to update stablecoin", async function () {
      const newToken = ethers.Wallet.createRandom().address;
      await executor.setStablecoin(newToken);
      expect(await executor.stablecoin()).to.equal(newToken);
    });
  });

  // ---------------------------------------------------------------------------
  //  Helpers
  // ---------------------------------------------------------------------------

  async function getBlockTimestamp(): Promise<number> {
    const block = await ethers.provider.getBlock("latest");
    return block!.timestamp;
  }
});
