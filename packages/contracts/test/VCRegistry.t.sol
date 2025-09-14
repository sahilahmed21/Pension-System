// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {VCRegistry} from "../src/VCRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract VCRegistryTest is Test {
    VCRegistry public vcRegistry;

    // --- Test Fixtures ---
    address public admin;
    address public issuer = makeAddr("issuer");
    address public randomHacker = makeAddr("randomHacker");
    bytes32 public constant VC_HASH = keccak256("VC_DATA");

    function setUp() public {
        VCRegistry implementation = new VCRegistry();
        bytes memory data = abi.encodeWithSelector(VCRegistry.initialize.selector);
        ERC1967Proxy proxy = new ERC1967Proxy(address(implementation), data);
        vcRegistry = VCRegistry(address(proxy));
        admin = address(this);
        
        // Debug: Let's verify the admin setup
        console.log("Admin address:", admin);
        console.log("Has admin role:", vcRegistry.hasRole(vcRegistry.DEFAULT_ADMIN_ROLE(), admin));
        console.log("RandomHacker address:", randomHacker);
        console.log("RandomHacker has admin role:", vcRegistry.hasRole(vcRegistry.DEFAULT_ADMIN_ROLE(), randomHacker));
    }

    // --- Test: Access Control ---

    function test_Succeeds_GrantAndUseIssuerRole() public {
        vcRegistry.grantRole(vcRegistry.ISSUER_ROLE(), issuer);
        assertTrue(vcRegistry.hasRole(vcRegistry.ISSUER_ROLE(), issuer));

        vm.prank(issuer); // Set prank for the anchor call
        vcRegistry.anchorVC(VC_HASH);

        (VCRegistry.VCStatus status, , ) = vcRegistry.getVCEntry(VC_HASH);
        assertEq(uint(status), uint(VCRegistry.VCStatus.Active));
    }

    function test_RevertIf_NonAdminGrantsRole() public {
        bytes32 adminRole = vcRegistry.DEFAULT_ADMIN_ROLE();
        bytes32 issuerRole = vcRegistry.ISSUER_ROLE();
        
        // Verify randomHacker doesn't have admin role
        assertFalse(vcRegistry.hasRole(adminRole, randomHacker));
        
        // FIXED: Use startPrank/stopPrank to maintain the prank across multiple vm calls
        vm.startPrank(randomHacker);
        vm.expectRevert(
            abi.encodeWithSignature(
                "AccessControlUnauthorizedAccount(address,bytes32)",
                randomHacker,
                adminRole
            )
        );
        vcRegistry.grantRole(issuerRole, issuer);
        vm.stopPrank();
    }
    
    // Alternative version of the test with different approach
    function test_RevertIf_NonAdminGrantsRole_Alternative() public {
        bytes32 adminRole = vcRegistry.DEFAULT_ADMIN_ROLE();
        bytes32 issuerRole = vcRegistry.ISSUER_ROLE();
        
        // Ensure randomHacker doesn't have admin role
        assertFalse(vcRegistry.hasRole(adminRole, randomHacker));
        
        // Try the call and expect it to fail
        vm.prank(randomHacker);
        try vcRegistry.grantRole(issuerRole, issuer) {
            // If we reach here, the call succeeded when it shouldn't have
            assertTrue(false, "Expected the grantRole call to revert, but it succeeded");
        } catch (bytes memory reason) {
            // Decode the revert reason to verify it's the correct error
            bytes4 selector = bytes4(reason);
            bytes4 expectedSelector = bytes4(keccak256("AccessControlUnauthorizedAccount(address,bytes32)"));
            assertEq(selector, expectedSelector, "Wrong revert reason");
        }
    }

    // --- Test: anchorVC ---

    function test_RevertIf_NonIssuerAnchorsVC() public {
        bytes32 issuerRole = vcRegistry.ISSUER_ROLE();
        
        vm.prank(randomHacker);
        vm.expectRevert(
            abi.encodeWithSignature(
                "AccessControlUnauthorizedAccount(address,bytes32)",
                randomHacker,
                issuerRole
            )
        );
        vcRegistry.anchorVC(VC_HASH);
    }

    function test_RevertIf_VCAlreadyAnchored() public {
        vcRegistry.grantRole(vcRegistry.ISSUER_ROLE(), issuer);
        
        vm.prank(issuer); // Prank for the first anchor call
        vcRegistry.anchorVC(VC_HASH);

        vm.prank(issuer); // **FIX:** Set the prank again for the second call
        vm.expectRevert("VC: Already anchored");
        vcRegistry.anchorVC(VC_HASH);
    }

    // --- Test: revokeVC ---

    function test_Succeeds_IssuerRevokesOwnVC() public {
        vcRegistry.grantRole(vcRegistry.ISSUER_ROLE(), issuer);

        vm.prank(issuer); // Prank for the anchor call
        vcRegistry.anchorVC(VC_HASH);

        vm.prank(issuer); // **FIX:** Set the prank again for the revoke call
        vcRegistry.revokeVC(VC_HASH);

        (VCRegistry.VCStatus status, , ) = vcRegistry.getVCEntry(VC_HASH);
        assertEq(uint(status), uint(VCRegistry.VCStatus.Revoked));
    }
    
    function test_RevertIf_NonIssuerRevokesVC() public {
        vcRegistry.grantRole(vcRegistry.ISSUER_ROLE(), issuer);
        
        vm.prank(issuer); // Prank for the anchor call
        vcRegistry.anchorVC(VC_HASH);

        vm.prank(randomHacker); // Set prank for the (failing) revoke call
        vm.expectRevert("Caller: Not the original issuer");
        vcRegistry.revokeVC(VC_HASH);
    }
}