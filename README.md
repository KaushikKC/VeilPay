# VeilPay - ZK-Credentials

**Turn private payroll into portable, verifiable income credentials using zero-knowledge proofs.**

Employers pay employees on Plasma with private salary commitments. Employees generate ZK proofs to verify income thresholds (e.g. "I earn >= $50k/year") to landlords, lenders, or DeFi protocols — without ever revealing their actual salary, employer, or wallet history.

Built for **ETH Oxford 2026** | Programmable Cryptography Track + Plasma Payments Bounty

> **Live Demo:** [veil-pay-systems.vercel.app](https://veil-pay-systems.vercel.app)
> **Contracts:** Deployed on Plasma Testnet (Chain ID: 9746)

---

## The Problem

Every DAO and crypto company paying contributors in stablecoins exposes:
- **Individual salaries** — anyone can see exactly what you earn
- **Compensation structure** — pay equity becomes uncomfortably public
- **Financial identity** — salary history is permanently linked to your wallet

But the bigger problem is on the **other side**: when employees need to prove their income (for a rental, loan, or DeFi access), there's no way to do it without revealing everything.

## Our Solution

VeilPay creates a **3-party system** where privacy and verifiability coexist:

```
Employer ─── pays privately ───► Employee ─── proves income ───► Verifier
                 │                                │                    │
          Poseidon commitment              ZK proof generated    On-chain verification
          stored on-chain                  (salary hidden)       (YES/NO only)
```

**What makes this different from private payments:**
Other projects hide payments. We go further — we turn private payments into **portable, reusable income credentials**. One payroll creates unlimited proofs for unlimited verifiers, each with different thresholds, and none of them learn your actual salary.

---

## How It Works

### 1. Employer Processes Payroll
- Pays employees in USDT on Plasma
- Each payment includes a **Poseidon hash commitment**: `Poseidon(employeeAddress, salary, nonce)`
- The commitment is stored on-chain — the salary stays private

### 2. Employee Generates Income Proof
- Selects a threshold to prove against (e.g. "Income > $50,000")
- Backend generates a **Groth16 ZK proof** using the Circom circuit
- The proof mathematically guarantees: *"My salary is at least $X"* without revealing the actual amount
- Proof is packaged as a shareable credential with QR code

### 3. Verifier Checks On-Chain
- Receives proof via QR scan, paste, or file drop
- Submits to the **CredentialVerifier** smart contract
- Gets a cryptographic YES/NO — salary, employer, and wallet history remain hidden

### What the Verifier Sees vs What's Hidden

| | Revealed | Hidden |
|---|---|---|
| Income above threshold | Yes | Exact salary |
| Proof is valid | Yes | Employer identity |
| On-chain verification | Yes | Wallet history |
| Timestamp | Yes | Payment amount |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js 15 + wagmi v2)                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │ Employer Portal  │  │ Employee Portal   │  │ Verifier Portal    │  │
│  │ - Register emps  │  │ - View payments   │  │ - Paste/scan proof │  │
│  │ - Process payroll│  │ - Generate proofs │  │ - On-chain verify  │  │
│  │ - USDT payments  │  │ - Share via QR    │  │ - Camera QR scan   │  │
│  └─────────────────┘  └──────────────────┘  └────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + TypeScript)                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │ /api/commitments  │  │ /api/proofs      │  │ /api/proofs/store  │  │
│  │ - Poseidon hash   │  │ - snarkjs        │  │ - Proof storage    │  │
│  │ - Nonce generation│  │ - Groth16        │  │ - Short URL for QR │  │
│  │ - File-backed DB  │  │ - Witness gen    │  │ - Retrieval API    │  │
│  └──────────────────┘  └──────────────────┘  └────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    SMART CONTRACTS (Plasma Testnet)                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │ PayrollRegistry   │  │ PaymentExecutor   │  │ CredentialVerifier │  │
│  │ - Employee mgmt   │  │ - USDT transfers  │  │ - Groth16 verify   │  │
│  │ - Commitment store│  │ - Batch payments  │  │ - Proof validation │  │
│  │ - Access control  │  │ - Event logging   │  │ - Output check     │  │
│  └──────────────────┘  └──────────────────┘  └────────────────────┘  │
│  ┌──────────────────┐  ┌──────────────────┐                         │
│  │ Verifier.sol      │  │ MockUSDC          │                        │
│  │ - Auto-generated  │  │ - Test stablecoin │                        │
│  │ - BN128 / Groth16 │  │ - 6 decimals      │                        │
│  └──────────────────┘  └──────────────────┘                         │
└──────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    ZK CIRCUIT (Circom 2.0)                           │
│                                                                      │
│  Private Inputs:  salary, nonce, employeeAddress                     │
│  Public Inputs:   threshold, commitment                              │
│  Output:          valid (1 if salary >= threshold, 0 otherwise)      │
│                                                                      │
│  Constraints:                                                        │
│    1. GreaterEqThan(64): salary >= threshold                         │
│    2. Poseidon(address, salary, nonce) === commitment (hard check)   │
│                                                                      │
│  Proof System: Groth16 on BN128 curve                                │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Deployed Contracts (Plasma Testnet)

| Contract | Address |
|----------|---------|
| PayrollRegistry | `0x503DB9a05E6fdab51abD3FB702185fF78A9a9A1F` |
| PaymentExecutor | `0xE462717d56fF402B19B6f6dA931811f6714715c1` |
| CredentialVerifier | `0xc578E1fe90922664fF10913696d2b44Dfc135295` |
| ZK Verifier (Groth16) | `0xa993CFC2dE1C1dAc43aB227FA699f0DeAa2F4B16` |
| USDT (Mock) | `0x502012b361AebCE43b26Ec812B74D9a51dB4D412` |

**Chain:** Plasma Testnet | **Chain ID:** 9746 | **RPC:** `https://testnet-rpc.plasma.to`

---

## Features

### Employer Portal
- Register employees on-chain
- Process batch payroll with USDT on Plasma
- Automatic Poseidon commitment generation per employee
- ERC-20 approve + batch pay in a single flow

### Employee Portal
- View on-chain payment history from event logs
- Generate ZK income proofs for any threshold ($1, $10, $50k, $100k)
- Share proofs via QR code or clipboard
- Multiple proofs from a single payroll — different thresholds, same commitment

### Verifier Portal
- Verify proofs via **paste**, **file drop**, or **camera QR scan**
- Client-side pre-validation (checks `valid` signal before sending tx)
- On-chain Groth16 verification via CredentialVerifier contract
- Clear result: VERIFIED or INVALID with specific reason

### Security
- **Tamper-proof:** Modifying any proof value makes it cryptographically invalid
- **Commitment-bound:** Proofs are tied to on-chain Poseidon commitments — you can't fake a salary
- **Zero-knowledge:** Verifier learns nothing except "income >= threshold"
- **Non-transferable:** Proofs are bound to the employee's Ethereum address

---

## Project Structure

```
VeilPay/
├── contracts/                    # Solidity smart contracts (Hardhat)
│   ├── contracts/
│   │   ├── PayrollRegistry.sol         # Employee management + commitment storage
│   │   ├── PaymentExecutor.sol         # USDT batch payments
│   │   ├── CredentialVerifier.sol      # On-chain ZK proof verification
│   │   ├── Verifier.sol                # Auto-generated Groth16 verifier
│   │   └── MockUSDC.sol               # Test stablecoin (6 decimals)
│   └── test/ZKCredentials.test.ts      # 16 comprehensive tests
├── circuits/                     # Circom ZK circuits
│   ├── income_proof.circom             # Main income proof circuit
│   ├── scripts/                        # Compile, setup, generate verifier
│   └── test/generate_proof.js          # Proof generation test
├── backend/                      # Express + TypeScript API
│   ├── src/
│   │   ├── api/proofs.ts               # Proof generation + storage
│   │   ├── api/commitments.ts          # Commitment creation (file-backed)
│   │   └── utils/poseidon.ts           # Poseidon hash helper
│   └── circuit-artifacts/              # Bundled WASM + zkey for deployment
└── frontend/                     # Next.js 15 + T3 Stack
    └── src/
        ├── lib/wagmi.ts                # Wagmi config + Plasma chain
        ├── lib/contracts.ts            # Contract addresses + ABIs
        ├── lib/hooks/                  # Custom hooks for each contract
        └── app/
            ├── app/employer/           # Employer dashboard
            ├── app/employee/           # Employee portal
            └── app/verifier/           # Verifier portal
```

---

## Quick Start

### Prerequisites
- **Node.js** >= 18
- **Circom** 2.0 ([install guide](https://docs.circom.io/getting-started/installation/))
- **MetaMask** with Plasma Testnet configured

### 1. Smart Contracts
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test          # 16 tests passing
```

### 2. ZK Circuit
```bash
cd circuits
npm install
npm run compile           # Compile circom → R1CS + WASM
npm run setup             # Trusted setup (downloads Powers of Tau)
npm run generate-verifier # Export Verifier.sol
npm test                  # Generate and verify a test proof
```

### 3. Backend
```bash
cd backend
npm install
npm run dev               # Runs on port 3001
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev               # Runs on port 3000
```

### 5. Configure MetaMask
- **Network:** Plasma Testnet
- **RPC URL:** `https://testnet-rpc.plasma.to`
- **Chain ID:** 9746
- **Explorer:** `https://testnet.plasmascan.io`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/commitments/create` | Create a Poseidon salary commitment |
| GET | `/api/commitments/employee/:address` | Get stored employee data for proof generation |
| POST | `/api/proofs/generate` | Generate a Groth16 ZK income proof |
| POST | `/api/proofs/store` | Store proof and return short ID for QR |
| GET | `/api/proofs/retrieve/:proofId` | Retrieve a stored proof by ID |
| POST | `/api/proofs/verify` | Verify a proof off-chain |
| GET | `/api/proofs/status` | Check circuit artifact availability |

---

## Demo Flow

### Scene 1: Employer (TechCorp)
1. Connect wallet as employer
2. Add employee Alice with wallet address and annual salary
3. Click **Process Payroll** → approves USDT → batch payment executes
4. Poseidon commitment recorded on-chain — salary stays private

### Scene 2: Employee (Alice)
1. Switch to Alice's wallet
2. See payment history pulled from on-chain events
3. Select threshold (e.g. $1 for demo) → Click **Generate ZK Proof**
4. Proof generated via Groth16 circuit → share via **QR code**

### Scene 3: Verifier (Landlord)
1. Open Verifier Portal → Click **Scan QR**
2. Camera opens → scan Alice's QR code
3. Proof auto-fills → Click **Verify Credential**
4. On-chain verification → **VERIFIED: Income > $1/year**
5. Landlord never learns Alice's actual salary or employer

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Blockchain | Plasma Testnet (Chain 9746) |
| Smart Contracts | Solidity 0.8.24, OpenZeppelin, Hardhat |
| ZK Proofs | Circom 2.0, SnarkJS, Groth16, BN128 |
| Hash Function | Poseidon (ZK-friendly, circomlibjs) |
| Backend | Node.js, Express, TypeScript, Zod |
| Frontend | Next.js 15, React 19, wagmi v2, viem |
| Styling | Tailwind CSS, Framer Motion |
| QR Sharing | react-qrcode-logo, html5-qrcode |
| Deployment | Vercel (frontend + backend serverless) |

---

## Future Potential

### Credential Types (Same Circuit Infrastructure)

| Credential | Proof Statement | Use Case |
|------------|----------------|----------|
| Rental qualification | income > $50k | Apartment applications |
| Accredited investor | income > $200k | SEC-compliant DeFi access |
| Creditworthiness | income > $X for N months | Under-collateralized DeFi loans |
| Tax residency | income_source = jurisdiction | Cross-border compliance |
| Sanctions screening | not in sanctioned list | AML/KYC without doxxing |
| Employment proof | has_active_payroll = true | Gig economy verification |

### Product Roadmap
- **Credential NFTs (SBTs)** — Non-transferable soul-bound tokens representing verified income credentials
- **Multi-chain support** — Deploy to Ethereum L2s, enable cross-chain credential portability
- **Flare Data Connector** — Pull real-world employment data (W2, payroll APIs) into ZK commitments
- **Credential marketplace** — Standardized credential types that DeFi protocols can integrate
- **Mobile app** — Native QR scanning and wallet integration for credential sharing
- **Employer SDK** — One-line integration for existing payroll systems to generate ZK commitments
- **Recursive proofs** — Aggregate multiple payroll periods into a single proof ("earned > $50k for 12 consecutive months")

---

## Hackathon Context

### Programmable Cryptography Track
VeilPay demonstrates the power of programmable cryptography for real consumer use cases. Zero-knowledge proofs transform private payroll data into **selective disclosure credentials** — proving exactly what you need, nothing more.

### Plasma Payments Bounty
VeilPay builds on Plasma to create a practical stablecoin payment experience with an emphasis on **privacy and confidentiality**. By combining Plasma's payment infrastructure with ZK proofs, we enable a new category of financial interactions where privacy and verifiability coexist.

---

## Team

Built at ETH Oxford 2026.

---

## License

MIT
