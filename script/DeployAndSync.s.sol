// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/NFT.sol";
import "forge-std/console.sol";

contract DeployAndSync is Script {
    function run() external {
        // Deploy contracts
        vm.startBroadcast();
        NFTMarketplace marketplace = new NFTMarketplace();
        vm.stopBroadcast();

        // Output deployment info
        console.log("NFTMarketplace deployed to:", address(marketplace));

        // Write deployment info to frontend
        string memory deploymentInfo = vm.toString(address(marketplace));
        vm.writeFile(
            "frontend/lib/contracts.ts",
            string.concat(
                "export const MARKETPLACE_ADDRESS = '",
                deploymentInfo,
                "';\n"
            )
        );

        // You could also write the ABI here if needed
    }
}