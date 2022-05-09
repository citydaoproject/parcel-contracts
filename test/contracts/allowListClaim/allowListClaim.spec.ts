import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ZERO_ADDRESS } from '../../../src/constants/accounts';
import { ALLOW_LIST_CLAIM_INTERFACE_ID } from '../../../src/constants/interfaces';
import { PARCEL_MANAGER_ROLE } from '../../../src/constants/roles';
import { buildMerkleTreeForAllowList, getMerkleProof } from '../../../src/contracts/AllowListClaim';
import { toByte32String } from '../../../src/utils/fixedBytes';
import { INITIALIZER, USER1, USER2, USER3 } from '../../helpers/Accounts';
import { setValidClaimPeriod } from '../../helpers/contracts/AllowListClaimHelper';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { shouldSupportInterface } from '../../helpers/ERC165Helper';

describe('AllowListClaim', () => {
  shouldSupportInterface('IAllowListClaim', () => createParcelNFT(), ALLOW_LIST_CLAIM_INTERFACE_ID);
});

describe('setMerkleRoot', () => {
  it('should set the merkle root', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).setMerkleRoot(toByte32String('0x1234'));
    expect(await parcelNFT.merkleRoot()).to.eq(toByte32String('0x1234'));

    await parcelNFT.connect(USER1).setMerkleRoot(toByte32String('0x5678'));
    expect(await parcelNFT.merkleRoot()).to.eq(toByte32String('0x5678'));
  });

  it('should fail if not called with parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await parcelNFT.setMerkleRoot(toByte32String('0x1111'));

    await expect(parcelNFT.connect(USER1).setMerkleRoot(toByte32String('0x1234'))).to.be.revertedWith('missing role');
    expect(await parcelNFT.merkleRoot()).to.eq(toByte32String('0x1111'));
  });

  it('should send MerkleRootChanged event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    expect(await parcelNFT.connect(USER1).setMerkleRoot(toByte32String('0x1234')))
      .to.emit(parcelNFT, 'MerkleRootChanged')
      .withArgs(toByte32String('0x1234'));
  });
});

describe('setClaimPeriod', () => {
  it('should set the claim period start and end', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).setClaimPeriod(1000, 2000);
    expect(await parcelNFT.claimPeriod()).to.deep.eq([BigNumber.from(1000), BigNumber.from(2000)]);

    await parcelNFT.connect(USER1).setClaimPeriod(3000, 4000);
    expect(await parcelNFT.claimPeriod()).to.deep.eq([BigNumber.from(3000), BigNumber.from(4000)]);
  });

  it('should fail if not called with parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await parcelNFT.setClaimPeriod(100, 200);

    await expect(parcelNFT.connect(USER1).setClaimPeriod(1000, 2000)).to.be.revertedWith('missing role');
    expect(await parcelNFT.claimPeriod()).to.deep.eq([BigNumber.from(100), BigNumber.from(200)]);
  });

  it('should fail if called start after end', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).setClaimPeriod(100, 200);

    await expect(parcelNFT.connect(USER1).setClaimPeriod(2000, 1000)).to.be.revertedWith('start must be before end');
    expect(await parcelNFT.claimPeriod()).to.deep.eq([BigNumber.from(100), BigNumber.from(200)]);

    await expect(parcelNFT.connect(USER1).setClaimPeriod(1000, 1000)).to.be.revertedWith('start must be before end');
    expect(await parcelNFT.claimPeriod()).to.deep.eq([BigNumber.from(100), BigNumber.from(200)]);
  });

  it('should send ClaimPeriodChanged event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    expect(await parcelNFT.connect(USER1).setClaimPeriod(1000, 2000))
      .to.emit(parcelNFT, 'ClaimPeriodChanged')
      .withArgs(BigNumber.from(1000), BigNumber.from(2000));
  });
});

describe('allowListMint', () => {
  it('should provide a token', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 1 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(1, 1, getMerkleProof(USER1.address, 1, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.totalSupply()).to.eq(1);
  });

  it('should provide the next token', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 2, [USER2.address]: 1 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(1, 2, getMerkleProof(USER1.address, 2, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(1);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.totalSupply()).to.eq(1);

    await parcelNFT.connect(USER2).allowListMint(1, 1, getMerkleProof(USER2.address, 1, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(1);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(2);
    expect(await parcelNFT.totalSupply()).to.eq(2);

    await parcelNFT.connect(USER1).allowListMint(1, 2, getMerkleProof(USER1.address, 2, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(2);
    expect(await parcelNFT.totalSupply()).to.eq(3);
  });

  it('should provide multiple tokens when allowance more than 1', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 2, [USER2.address]: 5, [USER3.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(2, 2, getMerkleProof(USER1.address, 2, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.totalSupply()).to.eq(2);

    await parcelNFT.connect(USER2).allowListMint(1, 5, getMerkleProof(USER2.address, 5, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(1);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(3);
    expect(await parcelNFT.totalSupply()).to.eq(3);

    await parcelNFT.connect(USER2).allowListMint(2, 5, getMerkleProof(USER2.address, 5, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(3);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(3);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(5);

    await parcelNFT.connect(USER2).allowListMint(2, 5, getMerkleProof(USER2.address, 5, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(7);
    expect(await parcelNFT.totalSupply()).to.eq(7);

    await parcelNFT.connect(USER3).allowListMint(5, 10, getMerkleProof(USER3.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 0)).to.eq(8);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 1)).to.eq(9);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 2)).to.eq(10);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 3)).to.eq(11);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 4)).to.eq(12);
    expect(await parcelNFT.totalSupply()).to.eq(12);

    await parcelNFT.connect(USER3).allowListMint(2, 10, getMerkleProof(USER3.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(7);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 0)).to.eq(8);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 1)).to.eq(9);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 2)).to.eq(10);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 3)).to.eq(11);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 4)).to.eq(12);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 5)).to.eq(13);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 6)).to.eq(14);
    expect(await parcelNFT.totalSupply()).to.eq(14);

    await parcelNFT.connect(USER3).allowListMint(3, 10, getMerkleProof(USER3.address, 10, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(5);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(10);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(10);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(2);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(3);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 1)).to.eq(4);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 2)).to.eq(5);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 3)).to.eq(6);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 4)).to.eq(7);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 0)).to.eq(8);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 1)).to.eq(9);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 2)).to.eq(10);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 3)).to.eq(11);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 4)).to.eq(12);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 5)).to.eq(13);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 6)).to.eq(14);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 7)).to.eq(15);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 8)).to.eq(16);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER3.address, 9)).to.eq(17);
    expect(await parcelNFT.totalSupply()).to.eq(17);
  });

  it('should fail if allowance incorrect for account', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 1, [USER2.address]: 5, [USER3.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await expect(
      parcelNFT.connect(USER1).allowListMint(1, 2, getMerkleProof(USER1.address, 2, merkleTree)),
    ).to.be.revertedWith('invalid Merkle Tree proof');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.totalSupply()).to.eq(0);

    await expect(
      parcelNFT.connect(USER2).allowListMint(1, 2, getMerkleProof(USER2.address, 5, merkleTree)),
    ).to.be.revertedWith('invalid Merkle Tree proof');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.totalSupply()).to.eq(0);

    await expect(
      parcelNFT.connect(USER3).allowListMint(1, 20, getMerkleProof(USER3.address, 10, merkleTree)),
    ).to.be.revertedWith('invalid Merkle Tree proof');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.totalSupply()).to.eq(0);
  });

  it('should fail if too many tokens requested', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 1, [USER2.address]: 5, [USER3.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await expect(
      parcelNFT.connect(USER1).allowListMint(2, 1, getMerkleProof(USER1.address, 1, merkleTree)),
    ).to.be.revertedWith('exceeds claim allowance');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.totalSupply()).to.eq(0);

    await parcelNFT.connect(USER2).allowListMint(3, 5, getMerkleProof(USER2.address, 5, merkleTree));
    await expect(
      parcelNFT.connect(USER2).allowListMint(3, 5, getMerkleProof(USER2.address, 5, merkleTree)),
    ).to.be.revertedWith('exceeds claim allowance');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(3);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(3);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(0);
    expect(await parcelNFT.totalSupply()).to.eq(3);

    await parcelNFT.connect(USER3).allowListMint(3, 10, getMerkleProof(USER3.address, 10, merkleTree));
    await parcelNFT.connect(USER3).allowListMint(3, 10, getMerkleProof(USER3.address, 10, merkleTree));
    await parcelNFT.connect(USER3).transferFrom(USER3.address, USER2.address, 4);
    await expect(
      parcelNFT.connect(USER3).allowListMint(5, 10, getMerkleProof(USER3.address, 10, merkleTree)),
    ).to.be.revertedWith('exceeds claim allowance');
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(0);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(4);
    expect(await parcelNFT.balanceOf(USER3.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(3);
    expect(await parcelNFT.alreadyClaimed(USER3.address)).to.eq(6);
    expect(await parcelNFT.totalSupply()).to.eq(9);
  });

  it('should send Transfer event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 2 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    expect(await parcelNFT.connect(USER1).allowListMint(1, 2, getMerkleProof(USER1.address, 2, merkleTree)))
      .to.emit(parcelNFT, 'Transfer')
      .withArgs(ZERO_ADDRESS, USER1.address, 1);

    expect(await parcelNFT.connect(USER1).allowListMint(1, 2, getMerkleProof(USER1.address, 2, merkleTree)))
      .to.emit(parcelNFT, 'Transfer')
      .withArgs(ZERO_ADDRESS, USER1.address, 2);
  });

  it('should cost less than 400k gas', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 1, [USER2.address]: 5 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    expect(
      await USER1.estimateGas(
        await parcelNFT
          .connect(USER1)
          .populateTransaction.allowListMint(1, 1, getMerkleProof(USER1.address, 1, merkleTree)),
      ),
    ).to.be.lt(400000);

    expect(
      await USER2.estimateGas(
        await parcelNFT
          .connect(USER2)
          .populateTransaction.allowListMint(1, 5, getMerkleProof(USER2.address, 5, merkleTree)),
      ),
    ).to.be.lt(400000);
  });
});

describe('alreadyClaimed', () => {
  it('should return 0 if not claimed', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 1, [USER2.address]: 1 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);

    await parcelNFT.connect(USER1).allowListMint(1, 1, getMerkleProof(USER1.address, 1, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(1);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
    expect(await parcelNFT.totalSupply()).to.eq(1);
  });

  it('should return the correct number when claimed', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 5, [USER2.address]: 5 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);

    await parcelNFT.connect(USER1).allowListMint(2, 5, getMerkleProof(USER1.address, 5, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(2);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(0);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(0);
    expect(await parcelNFT.totalSupply()).to.eq(2);

    await parcelNFT.connect(USER2).allowListMint(3, 5, getMerkleProof(USER2.address, 5, merkleTree));
    await parcelNFT.connect(USER2).transferFrom(USER2.address, USER1.address, 5);
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(3);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(3);
    expect(await parcelNFT.totalSupply()).to.eq(5);

    await parcelNFT.connect(USER1).allowListMint(3, 5, getMerkleProof(USER1.address, 5, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(6);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(2);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(3);
    expect(await parcelNFT.totalSupply()).to.eq(8);

    await parcelNFT.connect(USER2).allowListMint(2, 5, getMerkleProof(USER2.address, 5, merkleTree));
    expect(await parcelNFT.balanceOf(USER1.address)).to.eq(6);
    expect(await parcelNFT.balanceOf(USER2.address)).to.eq(4);
    expect(await parcelNFT.alreadyClaimed(USER1.address)).to.eq(5);
    expect(await parcelNFT.alreadyClaimed(USER2.address)).to.eq(5);
    expect(await parcelNFT.totalSupply()).to.eq(10);
  });
});
