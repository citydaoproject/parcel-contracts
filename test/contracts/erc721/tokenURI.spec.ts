import { expect } from 'chai';
import { PARCEL_MANAGER_ROLE } from '../../../src/constants/roles';
import { INITIALIZER, USER1 } from '../../helpers/Accounts';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';

describe('setBaseURI', () => {
  it('should set baseURI', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).mint(100);

    expect(await parcelNFT.tokenURI(100)).to.eq('');

    await parcelNFT.connect(USER1).setBaseURI('the-base/');

    expect(await parcelNFT.baseURI()).to.eq('the-base/');
    expect(await parcelNFT.tokenURI(100)).to.eq('the-base/100');
  });

  it('should fail if not called with parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await parcelNFT.mint(100);

    expect(parcelNFT.connect(USER1).setBaseURI('the-base/')).to.be.revertedWith('missing role');

    expect(await parcelNFT.tokenURI(100)).to.eq('');
  });
});

describe('setTokenURI', () => {
  it('should set the individual token uri', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).mint(100);

    expect(await parcelNFT.tokenURI(100)).to.eq('');

    await parcelNFT.connect(USER1).setTokenURI(100, 'the-best-token');

    expect(await parcelNFT.tokenURI(100)).to.eq('the-best-token');
  });

  it('should fail if not called with parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await parcelNFT.mint(100);

    expect(parcelNFT.connect(USER1).setTokenURI(100, 'the-best-token')).to.be.revertedWith('missing role');

    expect(await parcelNFT.tokenURI(100)).to.eq('');
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
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).mint(100);
    await parcelNFT.connect(USER1).mint(101);

    expect(await parcelNFT.tokenURI(100)).to.eq('');

    await parcelNFT.connect(USER1).setBaseURI('the-base/');
    await parcelNFT.connect(USER1).setTokenURI(100, 'the-best-token');

    expect(await parcelNFT.tokenURI(100)).to.eq('the-base/the-best-token');
    expect(await parcelNFT.tokenURI(101)).to.eq('the-base/101');
  });
});
