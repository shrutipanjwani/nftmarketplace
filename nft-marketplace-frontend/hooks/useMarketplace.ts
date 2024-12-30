"use client";

import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { MARKETPLACE_ADDRESS, MARKETPLACE_ABI } from "@/lib/contracts";
import { Abi, parseEther } from "viem";
import { NFTListing } from "@/lib/types";

export function useListNFT() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const listNFT = async (
    nftAddress: string,
    tokenId: string,
    price: string
  ) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI as Abi,
      functionName: "listNFT",
      args: [nftAddress, BigInt(tokenId), parseEther(price)],
    });
  };

  return { listNFT, isLoading, isSuccess };
}

export function useBuyNFT() {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buyNFT = async (nftAddress: string, tokenId: string, price: bigint) => {
    writeContract({
      address: MARKETPLACE_ADDRESS as `0x${string}`,
      abi: MARKETPLACE_ABI as Abi,
      functionName: "buyNFT",
      args: [nftAddress, BigInt(tokenId)],
      value: price,
    });
  };

  return { buyNFT, isLoading, isSuccess };
}

export function useGetListing(nftContract: string, tokenId: bigint) {
  const { data, isError, isLoading } = useReadContract({
    address: MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MARKETPLACE_ABI as Abi,
    functionName: "getListing",
    args: [nftContract, tokenId],
  }) as { data: NFTListing | undefined; isError: boolean; isLoading: boolean };

  return { data, isError, isLoading };
}
