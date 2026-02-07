import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, PayrollRegistryABI } from "~/lib/contracts";

export function useGetEmployees(employer: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.PayrollRegistry as `0x${string}`,
    abi: PayrollRegistryABI,
    functionName: "getEmployees",
    args: employer ? [employer] : undefined,
    query: { enabled: !!employer },
  });
}

export function useGetEmployeeCommitments(
  employee: `0x${string}` | undefined,
) {
  return useReadContract({
    address: CONTRACTS.PayrollRegistry as `0x${string}`,
    abi: PayrollRegistryABI,
    functionName: "getEmployeeCommitments",
    args: employee ? [employee] : undefined,
    query: { enabled: !!employee },
  });
}

export function useGetCommitmentCount(employee: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.PayrollRegistry as `0x${string}`,
    abi: PayrollRegistryABI,
    functionName: "getCommitmentCount",
    args: employee ? [employee] : undefined,
    query: { enabled: !!employee },
  });
}

export function useRegisterEmployee() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const registerEmployee = (employee: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.PayrollRegistry as `0x${string}`,
      abi: PayrollRegistryABI,
      functionName: "registerEmployee",
      args: [employee],
    });
  };

  return { registerEmployee, isPending, isConfirming, isSuccess, hash, error };
}

export function useRemoveEmployee() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const removeEmployee = (employee: `0x${string}`) => {
    writeContract({
      address: CONTRACTS.PayrollRegistry as `0x${string}`,
      abi: PayrollRegistryABI,
      functionName: "removeEmployee",
      args: [employee],
    });
  };

  return { removeEmployee, isPending, isConfirming, isSuccess, hash, error };
}
