// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import '@gnus.ai/contracts-upgradeable-diamond/access/AccessControlUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/proxy/utils/UUPSUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/security/PausableUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/extensions/ERC721RoyaltyUpgradeable.sol';
import '@gnus.ai/contracts-upgradeable-diamond/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol';
import './common/RoyaltyEventSupport.sol';
import './common/TokenUriStorage.sol';
import './Roles.sol';

contract ParcelNFT is
  UUPSUpgradeable,
  ERC721EnumerableUpgradeable,
  ERC721URIStorageUpgradeable,
  RoyaltyEventSupport,
  ERC721RoyaltyUpgradeable,
  AccessControlUpgradeable,
  PausableUpgradeable
{
  struct InitParams {
    string name;
    string symbol;
    address superAdmin;
  }

  function initialize(InitParams memory initParams) public initializer {
    __ERC721_init(initParams.name, initParams.symbol);
    __ERC721Enumerable_init_unchained();
    __ERC721URIStorage_init_unchained();
    __ERC2981_init_unchained();
    __ERC721Royalty_init_unchained();
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
    override(
      AccessControlUpgradeable,
      ERC721EnumerableUpgradeable,
      ERC721RoyaltyUpgradeable,
      ERC721Upgradeable,
      ERC2981Upgradeable
    )
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  /**
   * @notice Sets `baseURI` as the base URI for all tokens. Used when explicit tokenURI not set.
   */
  function setBaseURI(string calldata baseURI) external onlyRole(Roles.PARCEL_MANAGER) {
    TokenUriStorage.setBaseURI(baseURI);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return TokenUriStorage.baseURI();
  }

  /**
   * @dev See {IERC721Metadata-tokenURI}.
   */
  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override(ERC721URIStorageUpgradeable, ERC721Upgradeable)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
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
   * @notice Sets the royalty information that all ids in this contract will default to.
   *
   * Requirements:
   *
   * - `receiver` cannot be the zero address.
   * - `feeNumerator` cannot be greater than the fee denominator.
   */
  function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyRole(Roles.PARCEL_MANAGER) {
    _setDefaultRoyalty(receiver, feeNumerator);
  }

  /**
   * @inheritdoc ERC2981Upgradeable
   */
  function _setDefaultRoyalty(address receiver, uint96 feeNumerator)
    internal
    virtual
    override(RoyaltyEventSupport, ERC2981Upgradeable)
  {
    super._setDefaultRoyalty(receiver, feeNumerator);
  }

  /**
   * @notice Removes default royalty information.
   */
  function deleteDefaultRoyalty() external onlyRole(Roles.PARCEL_MANAGER) {
    _deleteDefaultRoyalty();
  }

  /**
   * @inheritdoc ERC2981Upgradeable
   */
  function _deleteDefaultRoyalty() internal virtual override(RoyaltyEventSupport, ERC2981Upgradeable) {
    super._deleteDefaultRoyalty();
  }

  /**
   * @notice Sets the royalty information for a specific token id, overriding the global default.
   *
   * Requirements:
   *
   * - `tokenId` must be already minted.
   * - `receiver` cannot be the zero address.
   * - `feeNumerator` cannot be greater than the fee denominator.
   */
  function setTokenRoyalty(
    uint256 tokenId,
    address receiver,
    uint96 feeNumerator
  ) external onlyRole(Roles.PARCEL_MANAGER) {
    _setTokenRoyalty(tokenId, receiver, feeNumerator);
  }

  /**
   * @inheritdoc ERC2981Upgradeable
   */
  function _setTokenRoyalty(
    uint256 tokenId,
    address receiver,
    uint96 feeNumerator
  ) internal virtual override(RoyaltyEventSupport, ERC2981Upgradeable) {
    super._setTokenRoyalty(tokenId, receiver, feeNumerator);
  }

  /**
   * @notice Resets royalty information for the token id back to the global default.
   */
  function resetTokenRoyalty(uint256 tokenId) external onlyRole(Roles.PARCEL_MANAGER) {
    _resetTokenRoyalty(tokenId);
  }

  /**
   * @inheritdoc ERC2981Upgradeable
   */
  function _resetTokenRoyalty(uint256 tokenId) internal virtual override(RoyaltyEventSupport, ERC2981Upgradeable) {
    super._resetTokenRoyalty(tokenId);
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

  function _burn(uint256 tokenId)
    internal
    virtual
    override(ERC721URIStorageUpgradeable, ERC721RoyaltyUpgradeable, ERC721Upgradeable)
  {
    super._burn(tokenId);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal virtual override(ERC721EnumerableUpgradeable, ERC721Upgradeable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  // solhint-disable-next-line no-empty-blocks
  function _authorizeUpgrade(address newImplementation) internal virtual override onlyRole(Roles.UPGRADER) {}
}
