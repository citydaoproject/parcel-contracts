// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.9;

library Roles {
  bytes32 public constant SUPER_ADMIN_ROLE = 0x00;
  bytes32 public constant ADMIN_ROLE = keccak256('citydao.Admin');
}
