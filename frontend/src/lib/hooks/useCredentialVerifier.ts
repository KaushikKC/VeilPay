import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS, CredentialVerifierABI } from "~/lib/contracts";

export function useVerifyIncomeProof() {
  const {
    writeContract,
    writeContractAsync,
    data: hash,
    isPending,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const verify = (
    pA: [bigint, bigint],
    pB: [[bigint, bigint], [bigint, bigint]],
    pC: [bigint, bigint],
    pubSignals: [bigint, bigint, bigint],
  ) => {
    writeContract({
      address: CONTRACTS.CredentialVerifier as `0x${string}`,
      abi: CredentialVerifierABI,
      functionName: "verifyIncomeProof",
      args: [pA, pB, pC, pubSignals],
    });
  };

  const verifyAsync = (
    pA: [bigint, bigint],
    pB: [[bigint, bigint], [bigint, bigint]],
    pC: [bigint, bigint],
    pubSignals: [bigint, bigint, bigint],
  ) => {
    return writeContractAsync({
      address: CONTRACTS.CredentialVerifier as `0x${string}`,
      abi: CredentialVerifierABI,
      functionName: "verifyIncomeProof",
      args: [pA, pB, pC, pubSignals],
    });
  };

  return {
    verify,
    verifyAsync,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  };
}

export function useCheckIncomeCredential(
  employee: `0x${string}` | undefined,
  threshold: bigint,
) {
  return useReadContract({
    address: CONTRACTS.CredentialVerifier as `0x${string}`,
    abi: CredentialVerifierABI,
    functionName: "checkIncomeCredential",
    args: employee ? [employee, threshold] : undefined,
    query: { enabled: !!employee },
  });
}

export function useGetCredentials(employee: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACTS.CredentialVerifier as `0x${string}`,
    abi: CredentialVerifierABI,
    functionName: "getCredentials",
    args: employee ? [employee] : undefined,
    query: { enabled: !!employee },
  });
}
