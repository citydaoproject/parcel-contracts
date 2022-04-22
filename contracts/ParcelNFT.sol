// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import '@gnus.ai/contracts-upgradeable-diamond/access/AccessControlUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/proxy/utils/UUPSUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/security/PausableUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol';
import './ParcelNFTStorage.sol';
import './Roles.sol';

contract ParcelNFT is UUPSUpgradeable, ERC721URIStorageUpgradeable, AccessControlUpgradeable, PausableUpgradeable {
  struct InitParams {
    string name;
    string symbol;
    address superAdmin;
  }

  function initialize(InitParams memory initParams) public initializer {
    __ERC721_init(initParams.name, initParams.symbol);
    __ERC721URIStorage_init_unchained();
    __AccessControl_init_unchained();
    __Pausable_init_unchained();

    if (initParams.superAdmin == address(0)) {
      initParams.superAdmin = _msgSender();
    }
    _setupRole(Roles.SUPER_ADMIN, initParams.superAdmin);
  }

  // todo: temporary until minting is supported
  function mint(uint256 tokenId) external onlyRole(Roles.PARCEL_MANAGER) {
    _safeMint(_msgSender(), tokenId);
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

  /**
   * @notice Sets `baseURI` as the base URI for all tokens. Used when explicit tokenURI not set.
   */
  function setBaseURI(string calldata baseURI) external onlyRole(Roles.PARCEL_MANAGER) {
    ParcelNFTStorage.setBaseURI(baseURI);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return ParcelNFTStorage.baseURI();
  }

  /**
   * @notice Sets `_tokenURI` as the tokenURI of `tokenId`.
   *
   * Requirements:
   *
   * - `tokenId` must exist.
   */
  function setTokenURI(uint256 tokenId, string memory _tokenURI) external onlyRole(Roles.PARCEL_MANAGER) {
    _setTokenURI(tokenId, _tokenURI);
  }

  /**
   * @notice Triggers stopped state.
   *
   * Requirements:
   *
   * - The contract must not be paused.
   */
  function pause() external onlyRole(Roles.PAUSER) {
    _pause();
  }

  /**
   * @notice Returns to normal state.
   *
   * Requirements:
   *
   * - The contract must be paused.
   */
  function unpause() external onlyRole(Roles.PAUSER) {
    _unpause();
  }

  // solhint-disable-next-line no-empty-blocks
  function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(Roles.UPGRADER) {}
}
