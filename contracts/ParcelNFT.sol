// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.9;

import '@gnus.ai/contracts-upgradeable-diamond/access/AccessControlUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/ERC721Upgradeable.sol';
import './Roles.sol';

contract ParcelNFT is AccessControlUpgradeable, ERC721Upgradeable {
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
}
