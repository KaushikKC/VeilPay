# VeilPay - ZK-Credentials

Privacy-preserving payroll system using zero-knowledge proofs. Employers pay employees on Plasma blockchain with private salary commitments. Employees generate ZK proofs to verify income thresholds (e.g. "I earn >= $50k/year") without revealing their actual salary.

Built for **ETH Oxford Hackathon** - Programmable Cryptography Track + Plasma Payments Bounty.

## Hackathon Context

### Programmable Cryptography Track

Cryptography has transitioned from a means to communicate in the presence of enemies to a tool for co-operation between potentially adversarial parties, unlocking new possibilities in how we can collaborate without compromising privacy.

Zero-knowledge proofs allow proving a statement is true without sharing the underlying data, fully homomorphic encryption enables computations on encrypted information without decrypting it, and multi-party computation lets multiple people or systems calculate results together without revealing their individual inputs.

VeilPay leverages ZK proofs (Circom + Groth16) to create a novel consumer experience: private payroll with verifiable income credentials.

### Plasma Payments Bounty ($5,000)

Plasma is a L1 blockchain purpose-built for stablecoin payments. VeilPay builds a new and practical onchain payment experience that improves how people send, receive, and understand stablecoin payments, with an emphasis on **privacy and confidentiality in onchain payments**.

**Focus areas addressed:**
- Enhancing privacy and confidentiality in onchain payments
- Increasing stablecoin accessibility with ZK-credential based verification

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
│   │   ├── Verifier.sol            # Auto-generated Groth16 verifier
│   │   └── MockUSDC.sol            # Test stablecoin
│   ├── scripts/deploy.ts
│   └── test/ZKCredentials.test.ts  # 17 comprehensive tests
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
    └── src/app/brutalist/
        ├── employer/               # Employer dashboard
        ├── employee/               # Employee portal
        └── verifier/               # Verifier portal
```

## How It Works

### Core Flow (ZK-Payroll MVP)

1. **Employer pays employee privately** - Stablecoin payment on Plasma with a Poseidon hash commitment stored on-chain (hides salary)
2. **Employee generates ZK proof** - "My income >= $50k/year" using Circom circuit, without revealing the exact salary
3. **Verifier checks proof on-chain** - Landlord/lender submits proof to CredentialVerifier smart contract, gets a boolean result

### Extended Vision (Same ZK Infrastructure)

The same proof infrastructure enables broader compliance use cases:

| Use Case | Proof Statement | Application |
|----------|----------------|-------------|
| Rental approval | income > $50k | Landlord verification |
| Accredited investor | income > $200k | DeFi protocol access |
| Tax residency | income_source = "US" | Regulatory compliance |
| Sanctions screening | no sanctioned countries | AML compliance |

## Prerequisites

- **Node.js** >= 18
- **Circom** 2.0 ([install guide](https://docs.circom.io/getting-started/installation/))
- **SnarkJS** (installed via npm)

## Quick Start

**NEW: Unified Development Experience** 🚀

We now have a root `package.json` that makes running the entire stack braindead easy!

### Ultra-Fast Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Setup circuits (first time only)
npm run setup:circuits

# 3. Start Hardhat node in a separate terminal
npm run node

# 4. Deploy all contracts (in another terminal)
npm run deploy:all

# 5. Start everything at once!
npm run dev
```

That's it! This runs the Hardhat node, backend, and frontend all at once.

### Unified Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Run all services (node + backend + frontend) |
| `npm run build` | 🏗️ Build everything |
| `npm test` | ✅ Run all tests |
| `npm run install:all` | 📦 Install deps in all modules |
| `npm run setup` | 🔧 Complete setup (install + circuits + contracts) |
| `npm run deploy:all` | 🚢 Deploy all contracts with ZK verifier |
| `npm run typecheck` | 📝 Type check all TypeScript |
| `npm run clean` | 🧹 Clean all build artifacts |

**Individual module commands:**
- `npm run dev:frontend`, `npm run dev:backend`, `npm run node`
- `npm run build:frontend`, `npm run build:backend`, `npm run build:contracts`, `npm run build:circuits`
- `npm run test:circuits`, `npm run test:contracts`

For full command reference, see the root `package.json`.

---

### Manual Setup (Old Way)

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

**Scene 1: Employer**
1. "I'm TechCorp, paying my employee Alice"
2. Click "Process Payroll" - $6,000 USDC sent on Plasma
3. Commitment created on-chain, salary stays private

**Scene 2: Employee**
1. "I'm Alice, I want to rent an apartment"
2. Landlord requires proof of income > $50k/year
3. Click "Generate Proof" - ZK proof created
4. Share proof, NOT actual salary

**Scene 3: Verifier**
1. "I'm the landlord, I received Alice's proof"
2. Upload proof - smart contract verifies
3. Confirmed: Alice earns > $50k - exact salary never revealed

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Blockchain | Plasma testnet |
| Smart Contracts | Solidity 0.8.24, OpenZeppelin, Hardhat |
| ZK Proofs | Circom 2.0, SnarkJS (Groth16) |
| Backend | Node.js, Express, TypeScript |
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Storage | In-memory (hackathon) / PostgreSQL (production) |
| Deployment | Vercel (frontend) + Railway (backend) |

## Submission Checklist

- [x] Public GitHub repository with all code, circuits, contracts
- [x] README with setup instructions and architecture explanation
- [ ] Demo video showing full flow (3-5 min)
- [ ] Deployed contracts on Plasma testnet
- [ ] Live hosted frontend
- [ ] Pitch deck with commercial vision
