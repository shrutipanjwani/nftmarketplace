// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

// Sample NFT contract for testing
contract SampleNFT is ERC721 {
    uint256 private _tokenIds;
    
    constructor() ERC721("SampleNFT", "SNFT") {}
    
    function mint() public returns (uint256) {
        _tokenIds += 1;
        _mint(msg.sender, _tokenIds);
        return _tokenIds;
    }
}

contract NFTMarketplace is ReentrancyGuard, ERC721Holder {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }
    
    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;
    
    event NFTListed(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 price
    );
    
    event NFTSold(
        address indexed seller,
        address indexed buyer,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );
    
    event ListingCanceled(
        address indexed seller,
        address indexed nftContract,
        uint256 indexed tokenId
    );

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(price > 0, "Price must be greater than zero");
        
        IERC721 nft = IERC721(nftContract);
        require(
            nft.ownerOf(tokenId) == msg.sender,
            "You don't own this NFT"
        );
        
        require(
            nft.getApproved(tokenId) == address(this) ||
            nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
        
        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });
        
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        
        emit NFTListed(msg.sender, nftContract, tokenId, price);
    }
    
    function buyNFT(
        address nftContract,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Listing is not active");
        require(msg.value == listing.price, "Incorrect price");
        require(msg.sender != listing.seller, "Seller cannot buy their own NFT");
        
        listing.active = false;
        
        IERC721(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        
        (bool success, ) = payable(listing.seller).call{value: msg.value}("");
        require(success, "Transfer failed");
        
        emit NFTSold(
            listing.seller,
            msg.sender,
            nftContract,
            tokenId,
            listing.price
        );
    }
    
    function cancelListing(
        address nftContract,
        uint256 tokenId
    ) external nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Listing is not active");
        require(
            listing.seller == msg.sender,
            "Only seller can cancel listing"
        );
        
        listing.active = false;
        
        IERC721(nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        
        emit ListingCanceled(msg.sender, nftContract, tokenId);
    }
    
    function getListing(
        address nftContract,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return listings[nftContract][tokenId];
    }
}