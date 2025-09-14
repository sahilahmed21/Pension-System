// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

/**
 * @title DIDRegistry
 * @author PensionTrust
 * @notice Manages the registration and ownership of Decentralized Identifiers (DIDs).
 * This contract is upgradeable and follows the UUPS pattern.
 */
contract DIDRegistry is Initializable, AccessControlUpgradeable, ReentrancyGuardUpgradeable {
    
    // --- State Variables ---

    // Mapping from a DID string to the owner's address.
    mapping(string => address) private _didOwners;
    // Mapping from an owner's address to their DID string for uniqueness checks.
    mapping(address => string) private _ownerDIDs;

    // --- Events ---

    event DIDRegistered(string indexed did, address indexed owner);
    event DIDOwnerUpdated(string indexed did, address indexed oldOwner, address indexed newOwner);

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
     * @notice Registers a new DID for the calling address.
     * @dev Reverts if the DID is already taken or if the caller already owns a DID.
     * @param did The unique DID string to register (e.g., "did:pension:12345").
     */
    function registerDID(string calldata did) external nonReentrant {
        // Checks
        require(bytes(did).length > 0, "DID cannot be empty");
        require(_didOwners[did] == address(0), "DID: Already registered");
        require(bytes(_ownerDIDs[msg.sender]).length == 0, "Owner: Already has a DID");

        // Effects
        _didOwners[did] = msg.sender;
        _ownerDIDs[msg.sender] = did;

        // Interactions (None)

        emit DIDRegistered(did, msg.sender);
    }

    /**
     * @notice Updates the owner of an existing DID.
     * @dev Only the current owner of the DID can call this function.
     * @param did The DID string to transfer.
     * @param newOwner The address of the new owner.
     */
    function updateDIDOwner(string calldata did, address newOwner) external nonReentrant {
        address currentOwner = _didOwners[did];

        // Checks
        require(currentOwner == msg.sender, "Caller is not the current owner");
        require(newOwner != address(0), "New owner cannot be the zero address");
        require(bytes(_ownerDIDs[newOwner]).length == 0, "New owner: Already has a DID");

        // Effects
        _didOwners[did] = newOwner;
        _ownerDIDs[newOwner] = did;
        delete _ownerDIDs[currentOwner];

        // Interactions (None)

        emit DIDOwnerUpdated(did, currentOwner, newOwner);
    }

    // --- View Functions ---

    /**
     * @notice Retrieves the owner of a given DID.
     * @param did The DID string to query.
     * @return The address of the owner.
     */
    function getDIDOwner(string calldata did) external view returns (address) {
        return _didOwners[did];
    }

    /**
     * @notice Retrieves the DID associated with a given owner address.
     * @param owner The address to query.
     * @return The DID string.
     */
    function getDIDByOwner(address owner) external view returns (string memory) {
        return _ownerDIDs[owner];
    }
}

