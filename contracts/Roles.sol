// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

library Roles {
  bytes32 public constant SUPER_ADMIN_ROLE = 0x00;
  bytes32 public constant PARCEL_MANAGER_ROLE = keccak256('citydao.ParcelManager');
  bytes32 public constant PAUSER = keccak256('citydao.Pauser');
  bytes32 public constant UPGRADER_ROLE = keccak256('citydao.Upgrader');
}
