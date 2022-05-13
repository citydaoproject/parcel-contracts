# ParcelNFT

![Use Case Diagram for the Vault](../../../.gitbook/assets/vault-use-case.png)

## External


### `setBaseURI`

```

 setBaseURI(string calldata __baseURI)
 
```

Sets a new BaseURI. The caller must have the Roles.PARCEL_MANGER role. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 

### `setTokenURI`

```
setTokenURI(uint256 tokenId, string memory _tokenURI)

```

Sets a TokenURI for the specific tokenID. The caller must have the Roles.PARCEL_MANGER role to do this. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 

### `setDefaultRoyalty`

```
setDefaultRoyalty(address receiver, uint96 feeNumerator)

emit DefaultRoyaltyChanged(receiver, feeNumerator);

```

 Sets default royalty fees. The caller must have the Roles.PARCEL_MANGER role to do this. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 

### `deleteDefaultRoyalty`

```
deleteDefaultRoyalty()
    
emit DefaultRoyaltyChanged(address(0), 0);

```

 Sets default royalty fees to zero. The caller must have the Roles.PARCEL_MANGER role to do this. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 


### `setTokenRoyalty`

```
 function setTokenRoyalty(
    uint256 tokenId,
    address receiver,
    uint96 feeNumerator
  ) 
  
emit TokenRoyaltyChanged(tokenId, receiver, feeNumerator);

```

Sets token royalty fees. The caller must have the Roles.PARCEL_MANGER role to do this. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 

### `resetTokenRoyalty`

```
function setTokenRoyalty(uint256 tokenId) 
  
emit TokenRoyaltyChanged(tokenId, address(0), 0);

```

Sets token royalty fees to zero. The caller must have the Roles.PARCEL_MANGER role to do this. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 



### `pause`

```
pause() 

emit Paused(_msgSender())

```

Set pauses to true. Safety mechanism to halt most operations in the event of an emergency. Implemented by `ParcelNFT` using `PausableUpgradeable` .

### `unpause

```
unpause() 

emit Unpaused(_msgSender())

```


Set pauses to false. Safety mechanism to halt most operations in the event of an emergency. Implemented by `ParcelNFT` using `PausableUpgradeable` .

## Public

### **`allowListMint`**

```
 allowListMint(
    uint256 amount,
    uint256 allowance,
    bytes32[] calldata proof
  ) 
    
emit Transfer(address(0), to, tokenId);

```

Payable function that allows the caller to mint x < allowance NFTs given they are within the merkle-proof tree. 

### `initialize`

```
initialize(InitParams memory initParams)

```

Sets up ParcelNFT inilization variables. Should be called once.


### `supportsInterface`

```
 supportsInterface(bytes4 interfaceId)  returns (bool)
```

Returns true if smart contract support a function call through proxy otherwise returns false.


### `baseURI`

```
baseURI()
returns (string memory)
```

Returns baseURI

### `tokenURI`

```
tokenURI(uint256 tokenId)
returns (string memory)
```

Returns tokenURI


### `setClaimPeriod`

```
setClaimPeriod(uint256 start, uint256 end)
    
emit ClaimPeriodChanged(start, end);

 ```
 
Sets a new claimPeriod. The caller must have the Roles.PARCEL_MANGER role. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 

### `setMerkleRoot`

```
setMerkleRoot(bytes32 _merkleRoot)   

emit MerkleRootChanged(_merkleRoot);

 ```
 
Sets a new merkleRoot. The caller must have the Roles.PARCEL_MANGER role. Implemented in `AccessControlUpgradeable` in gnus.ai/contracts-upgradeable-diamond. 

