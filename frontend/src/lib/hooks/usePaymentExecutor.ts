import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, PaymentExecutorABI, ERC20ABI } from "~/lib/contracts";

export function useUSDTBalance(account: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.USDT as `0x${string}`,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: account ? [account] : undefined,
    query: { enabled: !!account },
  });
}

export function useUSDTAllowance(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.USDT as `0x${string}`,
    abi: ERC20ABI,
    functionName: "allowance",
    args: owner
      ? [owner, CONTRACTS.PaymentExecutor as `0x${string}`]
      : undefined,
    query: { enabled: !!owner },
  });
}

export function useApproveUSDT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const approve = (amount: bigint) => {
    writeContract({
      address: CONTRACTS.USDT as `0x${string}`,
      abi: ERC20ABI,
      functionName: "approve",
      args: [CONTRACTS.PaymentExecutor as `0x${string}`, amount],
    });
  };

  return { approve, isPending, isConfirming, isSuccess, hash, error };
}

export function usePayEmployee() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const payEmployee = (
    employee: `0x${string}`,
    amount: bigint,
    commitment: `0x${string}`,
  ) => {
    writeContract({
      address: CONTRACTS.PaymentExecutor as `0x${string}`,
      abi: PaymentExecutorABI,
      functionName: "payEmployee",
      args: [employee, amount, commitment],
    });
  };

  return { payEmployee, isPending, isConfirming, isSuccess, hash, error };
}

export function useBatchPayEmployees() {
  const {
    writeContract,
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const batchPay = (
    employees: `0x${string}`[],
    amounts: bigint[],
    commitments: `0x${string}`[],
  ) => {
    writeContract({
      address: CONTRACTS.PaymentExecutor as `0x${string}`,
      abi: PaymentExecutorABI,
      functionName: "batchPayEmployees",
      args: [employees, amounts, commitments],
    });
  };

  const batchPayAsync = (
    employees: `0x${string}`[],
    amounts: bigint[],
    commitments: `0x${string}`[],
  ) => {
    return writeContractAsync({
      address: CONTRACTS.PaymentExecutor as `0x${string}`,
      abi: PaymentExecutorABI,
      functionName: "batchPayEmployees",
      args: [employees, amounts, commitments],
    });
  };

  return {
    batchPay,
    batchPayAsync,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}
