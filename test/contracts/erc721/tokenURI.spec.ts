import { expect } from 'chai';
import { PARCEL_MANAGER_ROLE } from '../../../src/constants/roles';
import { buildMerkleTreeForAllowList, getMerkleProof } from '../../../src/contracts/AllowListClaim';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { setValidClaimPeriod } from '../../helpers/contracts/AllowListClaimHelper';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';

describe('setBaseURI', () => {
  it('should set baseURI', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));

    expect(await parcelNFT.tokenURI(1)).to.eq('');

    await parcelNFT.connect(USER1).setBaseURI('the-base/');

    expect(await parcelNFT.baseURI()).to.eq('the-base/');
    expect(await parcelNFT.tokenURI(1)).to.eq('the-base/1');
  });

  it('should fail if not called with parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));

    expect(parcelNFT.connect(USER1).setBaseURI('the-base/')).to.be.revertedWith('missing role');

    expect(await parcelNFT.tokenURI(1)).to.eq('');
  });
});

describe('setTokenURI', () => {
  it('should set the individual token uri', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));

    expect(await parcelNFT.tokenURI(1)).to.eq('');

    await parcelNFT.connect(USER1).setTokenURI(1, 'the-best-token');

    expect(await parcelNFT.tokenURI(1)).to.eq('the-best-token');
  });

  it('should fail if not called with parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));

    expect(parcelNFT.connect(USER1).setTokenURI(1, 'the-best-token')).to.be.revertedWith('missing role');

    expect(await parcelNFT.tokenURI(1)).to.eq('');
  });

  it('should fail if called with an invalid tokenId', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    expect(parcelNFT.connect(USER1).setTokenURI(100, 'the-best-token')).to.be.revertedWith('missing role');
  });
});

describe('tokenURI', () => {
  it('should return the concatenated uri when both are set', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await setValidClaimPeriod(parcelNFT);

    const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
    await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

    await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));
    await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));

    expect(await parcelNFT.tokenURI(1)).to.eq('');

    await parcelNFT.connect(USER1).setBaseURI('the-base/');
    await parcelNFT.connect(USER1).setTokenURI(1, 'the-best-token');

    expect(await parcelNFT.tokenURI(1)).to.eq('the-base/the-best-token');
    expect(await parcelNFT.tokenURI(2)).to.eq('the-base/2');
  });
});
