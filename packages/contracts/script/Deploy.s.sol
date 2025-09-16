// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DIDRegistry} from "../src/DIDRegistry.sol";
import {VCRegistry} from "../src/VCRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployScript is Script {
    function run() external {
        // === CONFIGURATION ===
        // This is the address that will be granted the ISSUER_ROLE.
        // In a real deployment, this would be the secure backend wallet address.
        address initialIssuer = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // Default Anvil/Hardhat address [1]

        // --- DEPLOYMENT ---
        // Retrieve the private key from your environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy DIDRegistry
        console.log("Deploying DIDRegistry implementation...");
        DIDRegistry didRegistryImplementation = new DIDRegistry();
        console.log("DIDRegistry implementation deployed to:", address(didRegistryImplementation));

        bytes memory didData = abi.encodeWithSelector(DIDRegistry.initialize.selector);
        ERC1967Proxy didRegistryProxy = new ERC1967Proxy(address(didRegistryImplementation), didData);
        DIDRegistry didRegistry = DIDRegistry(address(didRegistryProxy));
        console.log("DIDRegistry proxy deployed to:", address(didRegistry));

        // 2. Deploy VCRegistry
        console.log("Deploying VCRegistry implementation...");
        VCRegistry vcRegistryImplementation = new VCRegistry();
        console.log("VCRegistry implementation deployed to:", address(vcRegistryImplementation));

        bytes memory vcData = abi.encodeWithSelector(VCRegistry.initialize.selector);
        ERC1967Proxy vcRegistryProxy = new ERC1967Proxy(address(vcRegistryImplementation), vcData);
        VCRegistry vcRegistry = VCRegistry(address(vcRegistryProxy));
        console.log("VCRegistry proxy deployed to:", address(vcRegistry));

        // --- POST-DEPLOYMENT SETUP ---
        console.log("Granting ISSUER_ROLE to:", initialIssuer);
        vcRegistry.grantRole(vcRegistry.ISSUER_ROLE(), initialIssuer);
        console.log("Role granted successfully.");

        vm.stopBroadcast();

        // --- VERIFICATION ---
        console.log("Verifying roles...");
        bool hasRole = vcRegistry.hasRole(vcRegistry.ISSUER_ROLE(), initialIssuer);
        require(hasRole, "Role granting failed");
        console.log("Issuer role verified for:", initialIssuer);
    }
}