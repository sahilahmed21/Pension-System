// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DIDRegistry} from "../src/DIDRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DIDRegistryTest is Test {
    DIDRegistry public didRegistry;

    // --- Test Fixtures ---
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    string public constant DID_1 = "did:pension:user1";
    string public constant DID_2 = "did:pension:user2";

    function setUp() public {
        // 1. Deploy the implementation contract
        DIDRegistry implementation = new DIDRegistry();
        
        // 2. Prepare the initialization call data
        bytes memory data = abi.encodeWithSelector(DIDRegistry.initialize.selector);
        
        // 3. Deploy the proxy and initialize it
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), data);
        
        // 4. Point our test instance to the proxy address
        didRegistry = DIDRegistry(address(proxy));
    }

    // --- Test: registerDID ---

    function test_Succeeds_RegisterDID() public {
        vm.prank(user1);
        didRegistry.registerDID(DID_1);

        assertEq(didRegistry.getDIDOwner(DID_1), user1);
        assertEq(didRegistry.getDIDByOwner(user1), DID_1);
    }

    function test_RevertIf_DIDAlreadyRegistered() public {
        vm.prank(user1);
        didRegistry.registerDID(DID_1);

        vm.prank(user2);
        vm.expectRevert("DID: Already registered");
        didRegistry.registerDID(DID_1);
    }

    function test_RevertIf_OwnerAlreadyHasDID() public {
        vm.prank(user1);
        didRegistry.registerDID(DID_1);

        vm.prank(user1); // Same user tries to register another DID
        vm.expectRevert("Owner: Already has a DID");
        didRegistry.registerDID(DID_2);
    }

    // --- Test: updateDIDOwner ---

    function test_Succeeds_UpdateDIDOwner() public {
        // Initial registration by user1
        vm.prank(user1);
        didRegistry.registerDID(DID_1);

        // user1 transfers ownership to user2
        vm.prank(user1);
        didRegistry.updateDIDOwner(DID_1, user2);

        assertEq(didRegistry.getDIDOwner(DID_1), user2, "New owner should be user2");
        assertEq(bytes(didRegistry.getDIDByOwner(user1)).length, 0, "Old owner should have no DID");
        assertEq(didRegistry.getDIDByOwner(user2), DID_1, "user2 should now own the DID");
    }

    function test_RevertIf_CallerIsNotOwner() public {
        vm.prank(user1);
        didRegistry.registerDID(DID_1);

        // user2 (not the owner) tries to transfer
        vm.prank(user2);
        vm.expectRevert("Caller is not the current owner");
        didRegistry.updateDIDOwner(DID_1, user2);
    }
}