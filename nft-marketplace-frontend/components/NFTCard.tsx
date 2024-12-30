"use client";

import { useBuyNFT, useGetListing } from "@/hooks/useMarketplace";
import { formatEther } from "viem";
import { NFT_ADDRESS } from "@/lib/contracts";

interface NFTCardProps {
  tokenId: bigint;
}

export function NFTCard({ tokenId }: NFTCardProps) {
  const {
    data: listing,
    isError,
    isLoading: loadingListing,
  } = useGetListing(NFT_ADDRESS, tokenId);
  const { buyNFT, isLoading: buyingNFT, isSuccess } = useBuyNFT();

  if (isError || !listing || !listing.active) return null;
  if (loadingListing) return <div>Loading...</div>;

  const handleBuy = async () => {
    try {
      await buyNFT(NFT_ADDRESS, tokenId.toString(), listing.price);
    } catch (error) {
      console.error("Error buying NFT:", error);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Token ID: {tokenId.toString()}</p>
        <p className="text-sm text-gray-600">Seller: {listing.seller}</p>
        <p className="text-lg font-bold">
          Price: {formatEther(listing.price)} ETH
        </p>
      </div>

      <button
        onClick={handleBuy}
        disabled={buyingNFT}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
      >
        {buyingNFT ? "Processing..." : "Buy NFT"}
      </button>

      {isSuccess && (
        <div className="text-green-500 text-center text-sm">
          Purchase successful!
        </div>
      )}
    </div>
  );
}
