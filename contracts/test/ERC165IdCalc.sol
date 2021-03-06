// SPDX-License-Identifier: GPL-3.0-only

pragma solidity ^0.8.9;

import '@gnus.ai/contracts-upgradeable-diamond/access/IAccessControlUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/interfaces/IERC2981Upgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/IERC721Upgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/extensions/IERC721MetadataUpgradeable.sol';
import '../common/IAllowListClaim.sol';
import '../common/IERC721BatchTransfer.sol';

library ERC165IdCalc {
  function calcAccessControlInterfaceId() external pure returns (bytes4) {
    return type(IAccessControlUpgradeable).interfaceId;
  }

  function calcAllowListClaimInterfaceId() external pure returns (bytes4) {
    return type(IAllowListClaim).interfaceId;
  }

  function calcERC2981InterfaceId() external pure returns (bytes4) {
    return type(IERC2981Upgradeable).interfaceId;
  }

  function calcERC721InterfaceId() external pure returns (bytes4) {
    return type(IERC721Upgradeable).interfaceId;
  }

  function calcERC721BatchTransferInterfaceId() external pure returns (bytes4) {
    return type(IERC721BatchTransfer).interfaceId;
  }

  function calcERC721EnumerableInterfaceId() external pure returns (bytes4) {
    return type(IERC721EnumerableUpgradeable).interfaceId;
  }

  function calcERC721MetadataInterfaceId() external pure returns (bytes4) {
    return type(IERC721MetadataUpgradeable).interfaceId;
  }
}
