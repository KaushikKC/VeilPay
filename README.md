# ZK-Credentials

Privacy-preserving payroll system using zero-knowledge proofs. Employers pay employees on Plasma blockchain with private salary commitments. Employees generate ZK proofs to verify income thresholds (e.g. "I earn >= $50k/year") without revealing their actual salary.

Built for ETH Oxford Hackathon.

## Architecture

```
Employer Portal ──► PaymentExecutor ──► Plasma Chain
                         │
                    PayrollRegistry (stores Poseidon commitments)
                         │
Employee Wallet ──► ZK Proof Generator (Circom + SnarkJS)
                         │
Verifier Portal ◄── CredentialVerifier (on-chain Groth16 verification)
```

## Project Structure

```
VeilPay/
├── contracts/          # Solidity smart contracts (Hardhat)
│   ├── contracts/
│   │   ├── PayrollRegistry.sol     # Stores payroll commitments
│   │   ├── PaymentExecutor.sol     # Handles stablecoin payments
│   │   ├── CredentialVerifier.sol  # Verifies ZK proofs on-chain
│   │   └── MockUSDC.sol            # Test stablecoin
│   ├── scripts/deploy.ts
│   └── test/
├── circuits/           # Circom ZK circuits
│   ├── income_proof.circom         # Main ZK circuit
│   ├── scripts/                    # Compile, setup, generate verifier
│   └── test/
├── backend/            # Node.js + Express API
│   └── src/
│       ├── api/proofs.ts           # Proof generation endpoint
│       ├── api/commitments.ts      # Commitment creation endpoint
│       └── utils/poseidon.ts       # Poseidon hash helper
└── frontend/           # Next.js frontend (T3 Stack)
```

## Prerequisites

- **Node.js** >= 18
- **Circom** 2.0 ([install guide](https://docs.circom.io/getting-started/installation/))
- **SnarkJS** (installed via npm)

## Quick Start

### 1. Smart Contracts

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test

# Deploy locally
npx hardhat node                    # Terminal 1
npx hardhat run scripts/deploy.ts --network localhost  # Terminal 2
```

### 2. ZK Circuit

```bash
cd circuits
npm install

# Compile circuit
npm run compile

# Trusted setup (downloads Powers of Tau + generates keys)
npm run setup

# Generate Solidity verifier
npm run generate-verifier

# Test proof generation
npm test
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit with your config
npm run dev             # Runs on port 3001
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev             # Runs on port 3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/commitments/create` | Create a Poseidon salary commitment |
| GET | `/api/commitments/employee/:address` | Get stored employee data |
| POST | `/api/proofs/generate` | Generate a ZK income proof |
| POST | `/api/proofs/verify` | Verify a proof off-chain |
| GET | `/api/proofs/status` | Check circuit build status |

## Demo Flow

1. **Employer** registers employees and processes payroll via `PaymentExecutor`
2. Salary commitments (Poseidon hashes) are stored on-chain via `PayrollRegistry`
3. **Employee** generates a ZK proof: "My income >= $50k" using the Circom circuit
4. **Verifier** (lender/landlord) verifies the proof on-chain via `CredentialVerifier`
5. Verifier learns only that income meets the threshold — never the actual salary

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Blockchain | Plasma testnet |
| Smart Contracts | Solidity 0.8.24, OpenZeppelin, Hardhat |
| ZK Proofs | Circom 2.0, SnarkJS (Groth16) |
| Backend | Node.js, Express, TypeScript |
| Frontend | Next.js 15, React 19, Tailwind CSS |
