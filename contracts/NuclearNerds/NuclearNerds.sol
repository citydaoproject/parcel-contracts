// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

/**
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@&BG5YJ??7777777?JY5PB#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@&BPJ7!!!7?JY55PPPP55YJ?7!!!7J5B&@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@&GJ7!!?YPB&&@@@@@@@@@@@@@@@&BGY?!!!JP#@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@BY!!7YG#@@@@@@@@@@@@@@@@@@@@@@@@@@&GY7!!JG@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@P?!!JG&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@BY!!?P&@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@B?!!Y#@@@@@@@@@@@@@@@@&GYJ@@@@@@@@@@@@@@@@@@#57!7G@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@&Y!!J#@@@@@@@@@@@@@@&B5??YG#@@@@@@@@@@@@@@@@@@@@&Y!!J#@@@@@@@@@@@@@
 * @@@@@@@@@@@@#?!!P@@@@@@@@@@@@@#PJ?JPB&#PY@@@@@@@@@@@@@@@@@@@@@@G7!7B@@@@@@@@@@@@
 * @@@@@@@@@@@B7!7B@@@@@@@@@@@GY??5B##GY??5B@@@@@@@@@@@@@@@@##@@@@@#?!!G@@@@@@@@@@@
 * @@@@@@@@@@#7!7#@@@@@@@@@@@@5P#&B5??YG#&G5@@@@@@@@@@@@&GY?!7?5B&@@&?!!B@@@@@@@@@@
 * @@@@@@@@@@?!!B@@@@@@@@@@@@@#PJ?JP#&BPJ?JG@@@@@@@@&B5J7!!!!J#PJ?JP##7!7&@@@@@@@@@
 * @@@@@@@@@P!!Y@@@@@@@@@@@@@@Y5B&#GY?J5B&#G@@@@@#PY7!!!!!!!!J@@@&B5JJ7!!Y@@@@@@@@@
 * @@@@@@@@@?!!#@@@@@@@@@@@@@@&B5??YG&#GY??P@@@@J!!!!!!!!!!!!J@@@@@@@&BPJ?&@@@@@@@@
 * @@@@@@@@#!!?@@@@@@@@@@@@@@@YJP#&B5J?YG#&B@@@&7!!!!!!!!!!!!J@@@@@@@@@@@&@@@@@@@@@
 * @@@@@@@@B!!Y@@@@@@@@@@@@@@@&#PJ?JP#&#PJ?Y@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@B!!Y@@@@@@@@@@@@@@@Y?5B&#GY??5B&#@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@#!!?@@@@@@@@@@@@@@@&&B5??YG#&BY?J@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@?!!#@@@@@@#GYJ5B&@5?JP#&BPJ?YG#&@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@G!!Y@@&B5?!!!!YJ?JYB#GY?JPB&#PJJ@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@J!!YJ7!!!!!!7&@#GY?!!JB#GY??5B&@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@&7!!!!!!!!!!7&@@@@@#PJ??YG#&B5Y@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@#7!!!!!!!!!7&@@@@@@@@&&#PJ?JP#@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@&?!!!!!!!!7&@@@@@@@@@Y?5B&#PY@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@5!!!!!!!7&@@@@@@@@@&&GY??5B@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@#J!!!!!7&@@@@@@@@@Y?YG#&BP@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@BJ!!!7&@@@@@@@@@#&#PJ?JG@@@&7!!!!!!!!!!!!J@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@#57!&@@@@@@@@@5?J5B&#B@@@&7!!!!!!!!!!!!Y@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@&B&@@@@@@@@@G#&B5?!7@@@@7!!!!!!!!!?YG&@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@J?7!!!!7YYYJ!!!!!7?YP#@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@PYJJJ??????JY5PB#&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * |--------------------------------------------------------------------------------|
 * Hello fellow CityDAO Citizen,
 * In this smart contract you find the Parcel-0 Drop from CityDAO!
 * We are using an merkle proof whitelisting drop to reduce gas cost.
 *
 * ~ Let's Build this City!
 *
 * Developed By: @slyRacoon23 & @mdnatx
 * Derived Smart Contract: Nuclear Nerds
 */

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
// import "./ERC721Enumerable.sol";


contract CityDAOParcelDrop is ERC721Enumerable, Ownable {
    string  public              baseURI;

    bytes32 public              whitelistMerkleRoot;
    uint256 public              MINT_END_PERIOD;
    

    mapping(address => uint256) public addressToMinted;
    
    event MerkleRootChanged(bytes32 _newWhitelistMerkleRoot);
    event MintEndPeriodChanged(uint256 _end_mint_period);

    constructor(
        string memory _baseURI,
        uint256 _mint_length
    )
        ERC721("CityDAO Parcel-0 NFT", "CITY-PARCEL-0")
    {
        baseURI = _baseURI;
        MINT_END_PERIOD = block.timestamp + _mint_length;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }


    function setMintEndPeriod( uint256 _end_mint_period) public onlyOwner {
        MINT_END_PERIOD = _end_mint_period;
        emit MintEndPeriodChanged(_end_mint_period);
    }
    
    function setWhitelistMerkleRoot(bytes32 _whitelistMerkleRoot) external onlyOwner {
        whitelistMerkleRoot = _whitelistMerkleRoot;
        emit MerkleRootChanged(whitelistMerkleRoot);
    }

    
    function _leaf(address account, uint256 allowance) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(account, allowance));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof) internal view returns (bool) {
        return MerkleProof.verify(proof, whitelistMerkleRoot, leaf);
    }

    function getAllowance(address account, uint256 allowance, bytes32[] calldata proof) public view returns (uint256) {
        require(_verify(_leaf(account, allowance), proof), "Invalid Merkle Tree proof supplied.");
        return allowance;
    }

    function whitelistMint(address account, uint256 count, uint256 allowance, bytes32[] calldata proof) public payable {
        require( block.timestamp <= MINT_END_PERIOD, "Mint Period has overlapsed");
        require(_verify(_leaf(account, allowance), proof), "Invalid Merkle Tree proof supplied.");
        require(addressToMinted[account] + count <= allowance, "Exceeds whitelist allowance");

        addressToMinted[account] += count;
        uint256 totalSupply = totalSupply();
        for(uint i; i < count; i++) {
            _mint(account, totalSupply + i);
        }
    }

    function batchTransferFrom(address _from, address _to, uint256[] memory _tokenIds) public {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            transferFrom(_from, _to, _tokenIds[i]);
        }
    }

    function batchSafeTransferFrom(address _from, address _to, uint256[] memory _tokenIds, bytes memory data_) public {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            safeTransferFrom(_from, _to, _tokenIds[i], data_);
        }
    }

}
