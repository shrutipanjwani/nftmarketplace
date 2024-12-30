"use client";

import { useState } from "react";
import { useListNFT } from "@/hooks/useMarketplace";
import { NFT_ADDRESS } from "@/lib/contracts";

export function ListNFTForm() {
  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");
  const { listNFT, isLoading, isSuccess } = useListNFT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId || !price) return;

    try {
      await listNFT(NFT_ADDRESS, tokenId, price);
    } catch (error) {
      console.error("Error listing NFT:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block text-sm font-medium">Token ID</label>
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="Enter token ID"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Price (ETH)</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full rounded-md border p-2"
          placeholder="0.1"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? "Listing..." : "List NFT"}
      </button>
      {isSuccess && (
        <div className="text-green-500 text-center mt-2">
          NFT listed successfully!
        </div>
      )}
    </form>
  );
}
