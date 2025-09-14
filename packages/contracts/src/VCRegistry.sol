// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title VCRegistry
 * @author PensionTrust
 * @notice Anchors and manages the status of Verifiable Credentials (VCs).
 * This contract is upgradeable and follows the UUPS pattern.
 */
contract VCRegistry is Initializable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
    
    // --- State Variables ---

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    enum VCStatus { Invalid, Active, Revoked }

    struct VCEntry {
        VCStatus status;
        address issuer;
        uint256 timestamp;
    }

    // Mapping from a VC hash to its on-chain entry.
    mapping(bytes32 => VCEntry) private _vcRegistry;

    // --- Events ---

    event VCAnchored(bytes32 indexed vcHash, address indexed issuer);
    event VCRevoked(bytes32 indexed vcHash, address indexed issuer);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the contract, setting the deployer as the default admin.
     */
    function initialize() public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // --- Public & External Functions ---

    /**
     * @notice Anchors a new Verifiable Credential hash to the registry.
     * @dev Can only be called by an address with the ISSUER_ROLE.
     * @param vcHash The keccak256 hash of the VC's contents.
     */
    function anchorVC(bytes32 vcHash) external nonReentrant onlyRole(ISSUER_ROLE) {
        // Checks
        require(_vcRegistry[vcHash].status == VCStatus.Invalid, "VC: Already anchored");
        
        // Effects
        _vcRegistry[vcHash] = VCEntry({
            status: VCStatus.Active,
            issuer: msg.sender,
            timestamp: block.timestamp
        });

        // Interactions (None)

        emit VCAnchored(vcHash, msg.sender);
    }

    /**
     * @notice Revokes a previously anchored Verifiable Credential.
     * @dev Can only be called by the original issuer of the VC.
     * @param vcHash The hash of the VC to revoke.
     */
    function revokeVC(bytes32 vcHash) external nonReentrant {
        VCEntry storage entry = _vcRegistry[vcHash];

        // Checks
        require(entry.status == VCStatus.Active, "VC: Not active or does not exist");
        require(entry.issuer == msg.sender, "Caller: Not the original issuer");

        // Effects
        entry.status = VCStatus.Revoked;

        // Interactions (None)

        emit VCRevoked(vcHash, msg.sender);
    }

    // --- View Functions ---

    /**
     * @notice Retrieves the full entry for a given VC hash.
     * @param vcHash The VC hash to query.
     * @return The status, issuer address, and timestamp of the VC.
     */
    function getVCEntry(bytes32 vcHash) external view returns (VCStatus, address, uint256) {
        VCEntry storage entry = _vcRegistry[vcHash];
        return (entry.status, entry.issuer, entry.timestamp);
    }
}

