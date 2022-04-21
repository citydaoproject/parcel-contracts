// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import '@gnus.ai/contracts-upgradeable-diamond/access/AccessControlUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/proxy/utils/UUPSUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/ERC721Upgradeable.sol';
import './Roles.sol';

contract ParcelNFT is UUPSUpgradeable, AccessControlUpgradeable, ERC721Upgradeable {
  function initialize(address superAdmin) public initializer {
    if (superAdmin == address(0)) {
      superAdmin = _msgSender();
    }
    _setupRole(Roles.SUPER_ADMIN_ROLE, superAdmin);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControlUpgradeable, ERC721Upgradeable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(Roles.UPGRADER_ROLE) {}
}
