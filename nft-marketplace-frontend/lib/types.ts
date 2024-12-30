export interface NFTListing {
  seller: string;
  nftContract: string;
  tokenId: bigint;
  price: bigint;
  active: boolean;
}
