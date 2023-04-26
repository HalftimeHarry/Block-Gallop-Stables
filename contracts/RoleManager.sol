// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleManager is AccessControl {
    bytes32 public constant SELLER_ROLE = keccak256("SELLER_ROLE");
    bytes32 public constant VETERINARIAN_ROLE = keccak256("VETERINARIAN_ROLE");
    bytes32 public constant BUYER_ROLE = keccak256("BUYER_ROLE");
    bytes32 public constant DAO_ROLE = keccak256("DAO_ROLE");

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(SELLER_ROLE, msg.sender);
        _setupRole(VETERINARIAN_ROLE, msg.sender);
        _setupRole(BUYER_ROLE, msg.sender);
        _setupRole(DAO_ROLE, msg.sender);
    }

    function grantRoleToDefaultAdmin(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function revokeRoleFromDefaultAdmin(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(DEFAULT_ADMIN_ROLE, account);
    }

    function grantRoleToSeller(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SELLER_ROLE, account);
    }

    function revokeRoleFromSeller(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(SELLER_ROLE, account);
    }

    function grantRoleToVeterinarian(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VETERINARIAN_ROLE, account);
    }

    function revokeRoleFromVeterinarian(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VETERINARIAN_ROLE, account);
    }

    function grantRoleToBuyer(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(BUYER_ROLE, account);
    }

    function revokeRoleFromBuyer(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(BUYER_ROLE, account);
    }

    function grantRoleToDAO(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DAO_ROLE, account);
    }

    function revokeRoleFromDAO(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(DAO_ROLE, account);
    }
}
