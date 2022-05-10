import { expect } from 'chai';
import {
  ERC721_ENUMERABLE_INTERFACE_ID,
  ERC721_INTERFACE_ID,
  ERC721_METADATA_INTERFACE_ID,
} from '../../../src/constants/interfaces';
import { PARCEL_MANAGER_ROLE } from '../../../src/constants/roles';
import { buildMerkleTreeForAllowList, getMerkleProof } from '../../../src/contracts/AllowListClaim';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { setValidClaimPeriod } from '../../helpers/contracts/AllowListClaimHelper';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { shouldSupportInterface } from '../../helpers/ERC165Helper';

describe('ERC721', () => {
  shouldSupportInterface('IERC721', () => createParcelNFT(), ERC721_INTERFACE_ID);
  shouldSupportInterface('IERC721Enumerable', () => createParcelNFT(), ERC721_ENUMERABLE_INTERFACE_ID);
  shouldSupportInterface('IERC721Metadata', () => createParcelNFT(), ERC721_METADATA_INTERFACE_ID);
});

// these tests are cursory just to confirm that the implementation is included
describe('ERC721Enumerable', () => {
  // totalSupply, tokenOfOwnerByIndex, and tokenByIndex
  describe('totalSupply', () => {
    it('should return the totalSupply', async () => {
      const parcelNFT = await createParcelNFT();
      await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

      await setValidClaimPeriod(parcelNFT);

      const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
      await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

      expect(await parcelNFT.totalSupply()).to.eq(0);

      await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));
      expect(await parcelNFT.totalSupply()).to.eq(1);

      await parcelNFT.connect(USER1).allowListMint(2, 10, getMerkleProof(USER1.address, 10, merkleTree));
      await parcelNFT.connect(USER2).allowListMint(1, 10, getMerkleProof(USER2.address, 10, merkleTree));
      expect(await parcelNFT.totalSupply()).to.eq(4);
    });
  });

  describe('tokenOfOwnerByIndex', () => {
    it('should return the token at the given index for the given user', async () => {
      const parcelNFT = await createParcelNFT();
      await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

      await setValidClaimPeriod(parcelNFT);

      const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
      await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

      await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));
      expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);

      await parcelNFT.connect(USER2).allowListMint(1, 10, getMerkleProof(USER2.address, 10, merkleTree));
      expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
      expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(2);

      await parcelNFT.connect(USER1).allowListMint(2, 10, getMerkleProof(USER1.address, 10, merkleTree));
      expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 0)).to.eq(1);
      expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 1)).to.eq(3);
      expect(await parcelNFT.tokenOfOwnerByIndex(USER1.address, 2)).to.eq(4);
      expect(await parcelNFT.tokenOfOwnerByIndex(USER2.address, 0)).to.eq(2);
    });
  });

  describe('tokenByIndex', () => {
    it('should return the token at the given index', async () => {
      const parcelNFT = await createParcelNFT();
      await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

      await setValidClaimPeriod(parcelNFT);

      const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
      await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

      await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));
      expect(await parcelNFT.tokenByIndex(0)).to.eq(1);

      await parcelNFT.connect(USER2).allowListMint(1, 10, getMerkleProof(USER2.address, 10, merkleTree));
      expect(await parcelNFT.tokenByIndex(0)).to.eq(1);
      expect(await parcelNFT.tokenByIndex(1)).to.eq(2);

      await parcelNFT.connect(USER1).allowListMint(2, 10, getMerkleProof(USER1.address, 10, merkleTree));
      expect(await parcelNFT.tokenByIndex(0)).to.eq(1);
      expect(await parcelNFT.tokenByIndex(1)).to.eq(2);
      expect(await parcelNFT.tokenByIndex(2)).to.eq(3);
      expect(await parcelNFT.tokenByIndex(3)).to.eq(4);
    });
  });
});

describe('ERC721Metadata', () => {
  describe('name', () => {
    it('should return the name', async () => {
      const parcelNFT = await createParcelNFT({ name: 'The Name' });
      expect(await parcelNFT.name()).to.eq('The Name');
    });
  });

  describe('symbol', () => {
    it('should return the symbol', async () => {
      const parcelNFT = await createParcelNFT({ symbol: 'The Symbol' });
      expect(await parcelNFT.symbol()).to.eq('The Symbol');
    });
  });

  describe('tokenURI', () => {
    it('should return the token URI', async () => {
      const parcelNFT = await createParcelNFT();
      await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

      await setValidClaimPeriod(parcelNFT);

      const merkleTree = buildMerkleTreeForAllowList({ [USER1.address]: 10, [USER2.address]: 10 });
      await parcelNFT.setMerkleRoot(merkleTree.getHexRoot());

      await parcelNFT.connect(USER1).allowListMint(1, 10, getMerkleProof(USER1.address, 10, merkleTree));

      await parcelNFT.setBaseURI('https://the.base.uri/');
      expect(await parcelNFT.tokenURI(1)).to.eq('https://the.base.uri/1');
    });
  });
});
