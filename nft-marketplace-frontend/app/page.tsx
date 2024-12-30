"use client";

import { ListNFTForm } from "@/components/ListNFTForm";
import { NFTGrid } from "@/components/NFTGrid";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-8">
          <ConnectButton />
        </div>

        {isConnected ? (
          <>
            <div className="mb-12">
              <h1 className="text-3xl font-bold mb-6">List Your NFT</h1>
              <ListNFTForm />
            </div>
            <NFTGrid />
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">
              Connect your wallet to get started
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
