"use client";

import { useState, useEffect } from "react";
import { NFTCard } from "./NFTCard";
import { useWatchContractEvent, usePublicClient } from "wagmi";
import { MARKETPLACE_ABI, MARKETPLACE_ADDRESS } from "@/lib/contracts";
import { Log } from "viem";

export function NFTGrid() {
  const [listedTokenIds, setListedTokenIds] = useState<bigint[]>([]);
  const publicClient = usePublicClient();

  // Load initial listings
  useEffect(() => {
    const loadListings = async () => {
      if (!publicClient) return;
      try {
        const logs = await publicClient.getLogs({
          address: MARKETPLACE_ADDRESS,
          event: {
            type: "event",
            name: "NFTListed",
            inputs:
              MARKETPLACE_ABI.find((x) => x.name === "NFTListed")?.inputs || [],
          },
          fromBlock: BigInt(0),
        });

        const soldLogs = await publicClient.getLogs({
          address: MARKETPLACE_ADDRESS,
          event: {
            type: "event",
            name: "NFTSold",
            inputs:
              MARKETPLACE_ABI.find((x) => x.name === "NFTSold")?.inputs || [],
          },
          fromBlock: BigInt(0),
        });
        const soldTokenIds = new Set(
          soldLogs.map((log) => BigInt(log.topics[3] || "0"))
        );
        const activeTokenIds = logs
          .map((log) => BigInt(log.topics[3] || "0"))
          .filter((tokenId) => !soldTokenIds.has(tokenId));

        setListedTokenIds(activeTokenIds);
      } catch (error) {
        console.error("Error loading listings:", error);
      }
    };

    loadListings();
  }, [publicClient]);

  useWatchContractEvent({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    eventName: "NFTListed",
    onLogs(logs: Log[]) {
      if (logs[0]?.topics[3]) {
        const tokenId = BigInt(logs[0].topics[3]);
        setListedTokenIds((prev) => [...prev, tokenId]);
      }
    },
  });

  useWatchContractEvent({
    address: MARKETPLACE_ADDRESS,
    abi: MARKETPLACE_ABI,
    eventName: "NFTSold",
    onLogs(logs: Log[]) {
      if (logs[0]?.topics[3]) {
        const tokenId = BigInt(logs[0].topics[3]);
        setListedTokenIds((prev) => prev.filter((id) => id !== tokenId));
      }
    },
  });

  if (listedTokenIds.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No active listings found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listedTokenIds.map((tokenId) => (
        <NFTCard key={tokenId.toString()} tokenId={tokenId} />
      ))}
    </div>
  );
}
