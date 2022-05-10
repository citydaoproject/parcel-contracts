import { expect } from 'chai';
import { ERC721_BATCH_TRANSFER_INTERFACE_ID } from '../../../src/constants/interfaces';
import { PARCEL_MANAGER_ROLE } from '../../../src/constants/roles';
import { buildMerkleTreeForAllowList, getMerkleProof } from '../../../src/contracts/AllowListClaim';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { setValidClaimPeriod } from '../../helpers/contracts/AllowListClaimHelper';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { shouldSupportInterface } from '../../helpers/ERC165Helper';

describe('ERC721BatchTransfer', () => {
  shouldSupportInterface('IERC721BatchTransfer', () => createParcelNFT(), ERC721_BATCH_TRANSFER_INTERFACE_ID);
});

describe('batchTransferFrom', () => {
  it('should transfer multiple tokens to other user', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(5, 10, getMerkleProof(USER1.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);

    await parcelNFT.connect(USER1).batchTransferFrom(USER1.address, USER2.address, [1, 3, 5]);
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);
  });

  it('should fail if any token is not owned by the sender', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(5, 10, getMerkleProof(USER1.address, 10, merkleTree));
    await parcelNFT.connect(USER2).allowListMint(5, 10, getMerkleProof(USER2.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(8);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(9);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(10);
    expect(await parcelNFT.totalSupply()).to.eq(10);

    await expect(
      parcelNFT.connect(USER1).batchTransferFrom(USER1.address, USER2.address, [1, 3, 5, 6, 8, 10]),
    ).to.be.revertedWith('transfer caller is not owner nor approved');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(8);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(9);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(10);
    expect(await parcelNFT.totalSupply()).to.eq(10);
  });

  it('should fail if any token does not exist', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(5, 10, getMerkleProof(USER1.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);

    await expect(
      parcelNFT.connect(USER1).batchTransferFrom(USER1.address, USER2.address, [1, 3, 5, 6]),
    ).to.be.revertedWith('nonexistent token');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);
  });
});

describe('batchSafeTransferFrom', () => {
  it('should transfer multiple tokens to other user', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(5, 10, getMerkleProof(USER1.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);

    await parcelNFT.connect(USER1).batchSafeTransferFrom(USER1.address, USER2.address, [1, 3, 5], '0x');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);
  });

  it('should fail if any token is not owned by the sender', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(5, 10, getMerkleProof(USER1.address, 10, merkleTree));
    await parcelNFT.connect(USER2).allowListMint(5, 10, getMerkleProof(USER2.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(8);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(9);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(10);
    expect(await parcelNFT.totalSupply()).to.eq(10);

    await expect(
      parcelNFT.connect(USER1).batchSafeTransferFrom(USER1.address, USER2.address, [1, 3, 5, 6, 8, 10], '0x'),
    ).to.be.revertedWith('transfer caller is not owner nor approved');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(8);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(9);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(10);
    expect(await parcelNFT.totalSupply()).to.eq(10);
  });

  it('should fail if any token does not exist', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(5, 10, getMerkleProof(USER1.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);

    await expect(
      parcelNFT.connect(USER1).batchSafeTransferFrom(USER1.address, USER2.address, [1, 3, 5, 6], '0x'),
    ).to.be.revertedWith('nonexistent token');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 3)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 4)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);
  });
});
