import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy MockUSDC (skip on mainnet – use real USDC address)
  const isLocal = (await ethers.provider.getNetwork()).chainId === 31337n;

  let stablecoinAddress: string;
  if (isLocal) {
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();
    await usdc.waitForDeployment();
    stablecoinAddress = await usdc.getAddress();
    console.log("MockUSDC deployed to:", stablecoinAddress);
  } else {
    // Replace with actual USDC address on Plasma
    stablecoinAddress = process.env.STABLECOIN_ADDRESS || "";
    if (!stablecoinAddress) {
      throw new Error("Set STABLECOIN_ADDRESS env var for non-local deployment");
    }
    console.log("Using stablecoin at:", stablecoinAddress);
  }

  // 2. Deploy PayrollRegistry
  const PayrollRegistry = await ethers.getContractFactory("PayrollRegistry");
  const registry = await PayrollRegistry.deploy();
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("PayrollRegistry deployed to:", registryAddress);

  // 3. Deploy PaymentExecutor
  const PaymentExecutor = await ethers.getContractFactory("PaymentExecutor");
  const executor = await PaymentExecutor.deploy(stablecoinAddress, registryAddress);
  await executor.waitForDeployment();
  const executorAddress = await executor.getAddress();
  console.log("PaymentExecutor deployed to:", executorAddress);

  // 4. Authorise PaymentExecutor in PayrollRegistry
  const tx = await registry.setExecutorAuthorised(executorAddress, true);
  await tx.wait();
  console.log("PaymentExecutor authorised in PayrollRegistry");

  // 5. Deploy Groth16 Verifier (generated from circuit)
  console.log("\nDeploying ZK Verifier contracts...");
  const Verifier = await ethers.getContractFactory("Groth16Verifier");
  const verifier = await Verifier.deploy();
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("Groth16 Verifier deployed to:", verifierAddress);

  // 6. Deploy CredentialVerifier
  const CredentialVerifier = await ethers.getContractFactory("CredentialVerifier");
  const credentialVerifier = await CredentialVerifier.deploy(verifierAddress);
  await credentialVerifier.waitForDeployment();
  const credentialVerifierAddress = await credentialVerifier.getAddress();
  console.log("CredentialVerifier deployed to:", credentialVerifierAddress);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  if (isLocal) console.log("MockUSDC:            ", stablecoinAddress);
  console.log("PayrollRegistry:     ", registryAddress);
  console.log("PaymentExecutor:     ", executorAddress);
  console.log("Groth16 Verifier:    ", verifierAddress);
  console.log("CredentialVerifier:  ", credentialVerifierAddress);

  // 7. Update environment files
  console.log("\n=== Updating Environment Files ===");

  // Update backend .env
  const backendEnvPath = path.join(__dirname, "../../backend/.env");
  if (fs.existsSync(backendEnvPath)) {
    let backendEnv = fs.readFileSync(backendEnvPath, "utf8");
    backendEnv = backendEnv.replace(
      /REGISTRY_CONTRACT_ADDRESS=.*/,
      `REGISTRY_CONTRACT_ADDRESS=${registryAddress}`
    );
    backendEnv = backendEnv.replace(
      /PAYMENT_CONTRACT_ADDRESS=.*/,
      `PAYMENT_CONTRACT_ADDRESS=${executorAddress}`
    );
    backendEnv = backendEnv.replace(
      /VERIFIER_CONTRACT_ADDRESS=.*/,
      `VERIFIER_CONTRACT_ADDRESS=${credentialVerifierAddress}`
    );
    fs.writeFileSync(backendEnvPath, backendEnv);
    console.log("✓ Updated backend/.env");
  }

  // Update frontend contracts.ts
  const contractsPath = path.join(__dirname, "../../frontend/src/lib/contracts.ts");
  if (fs.existsSync(contractsPath)) {
    let contractsTs = fs.readFileSync(contractsPath, "utf8");
    contractsTs = contractsTs.replace(
      /PayrollRegistry: "0x[a-fA-F0-9]{40}"/,
      `PayrollRegistry: "${registryAddress}"`
    );
    contractsTs = contractsTs.replace(
      /PaymentExecutor: "0x[a-fA-F0-9]{40}"/,
      `PaymentExecutor: "${executorAddress}"`
    );
    contractsTs = contractsTs.replace(
      /CredentialVerifier: "0x[a-fA-F0-9]{40}".*$/m,
      `CredentialVerifier: "${credentialVerifierAddress}",`
    );
    contractsTs = contractsTs.replace(
      /ZKVerifier: "0x[a-fA-F0-9]{40}".*$/m,
      `ZKVerifier: "${verifierAddress}",`
    );
    contractsTs = contractsTs.replace(
      /USDT: "0x[a-fA-F0-9]{40}".*$/m,
      `USDT: "${stablecoinAddress}", // MockUSDC on local`
    );
    fs.writeFileSync(contractsPath, contractsTs);
    console.log("✓ Updated frontend/src/lib/contracts.ts");
  }

  console.log("\n✓ All contracts deployed and environment files updated!");
  console.log("\nNext steps:");
  console.log("1. Make sure your Hardhat node is running: npx hardhat node");
  console.log("2. Start the backend: cd backend && npm run dev");
  console.log("3. Start the frontend: cd frontend && npm run dev");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
