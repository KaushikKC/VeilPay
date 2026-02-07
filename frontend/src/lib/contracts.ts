export const CONTRACTS = {
  PayrollRegistry: "0x503DB9a05E6fdab51abD3FB702185fF78A9a9A1F",
  PaymentExecutor: "0xE462717d56fF402B19B6f6dA931811f6714715c1",
  CredentialVerifier: "0xc578E1fe90922664fF10913696d2b44Dfc135295",
  ZKVerifier: "0xa993CFC2dE1C1dAc43aB227FA699f0DeAa2F4B16",
  USDT: "0x502012b361AebCE43b26Ec812B74D9a51dB4D412",
} as const;

export const PayrollRegistryABI = [
  {
    type: "function",
    name: "registerEmployee",
    inputs: [{ name: "employee", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeEmployee",
    inputs: [{ name: "employee", type: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getEmployees",
    inputs: [{ name: "employer", type: "address" }],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEmployeeCommitments",
    inputs: [{ name: "employee", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "commitment", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
          { name: "employer", type: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getLatestCommitment",
    inputs: [{ name: "employee", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "commitment", type: "bytes32" },
          { name: "timestamp", type: "uint256" },
          { name: "employer", type: "address" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCommitmentCount",
    inputs: [{ name: "employee", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "commitPayroll",
    inputs: [
      { name: "employer", type: "address" },
      { name: "employee", type: "address" },
      { name: "commitment", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "EmployeeRegistered",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "employee", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "EmployeeRemoved",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "employee", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "PayrollCommitted",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "employee", type: "address", indexed: true },
      { name: "commitment", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const PaymentExecutorABI = [
  {
    type: "function",
    name: "payEmployee",
    inputs: [
      { name: "employee", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "commitment", type: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "batchPayEmployees",
    inputs: [
      { name: "employees", type: "address[]" },
      { name: "amounts", type: "uint256[]" },
      { name: "commitments", type: "bytes32[]" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "PaymentExecuted",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "employee", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "commitment", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BatchPaymentExecuted",
    inputs: [
      { name: "employer", type: "address", indexed: true },
      { name: "employeeCount", type: "uint256", indexed: false },
      { name: "totalAmount", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const CredentialVerifierABI = [
  {
    type: "function",
    name: "verifyIncomeProof",
    inputs: [
      { name: "_pA", type: "uint256[2]" },
      { name: "_pB", type: "uint256[2][2]" },
      { name: "_pC", type: "uint256[2]" },
      { name: "_pubSignals", type: "uint256[3]" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "checkIncomeCredential",
    inputs: [
      { name: "employee", type: "address" },
      { name: "threshold", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCredentials",
    inputs: [{ name: "employee", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "threshold", type: "uint256" },
          { name: "timestamp", type: "uint256" },
          { name: "commitment", type: "bytes32" },
          { name: "valid", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getCredentialCount",
    inputs: [{ name: "employee", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "IncomeVerified",
    inputs: [
      { name: "employee", type: "address", indexed: true },
      { name: "threshold", type: "uint256", indexed: false },
      { name: "commitment", type: "bytes32", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;

export const ERC20ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
] as const;
