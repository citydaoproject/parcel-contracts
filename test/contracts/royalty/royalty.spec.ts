import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ZERO_ADDRESS } from '../../../src/constants/accounts';
import { ERC2981_INTERFACE_ID } from '../../../src/constants/interfaces';
import { PARCEL_MANAGER_ROLE } from '../../../src/constants/roles';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { shouldSupportInterface } from '../../helpers/ERC165Helper';

describe('supportsInterface', () => {
  shouldSupportInterface('IERC2981', () => createParcelNFT(), ERC2981_INTERFACE_ID);
});

describe('setDefaultRoyalty', () => {
  it('should update the default royalty', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([ZERO_ADDRESS, BigNumber.from(0)]);

    await parcelNFT.connect(USER1).setDefaultRoyalty(USER2.address, 200);

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);
  });

  it('should fail if not called by parcel manager', async () => {
    const parcelNFT = await createParcelNFT();

    await expect(parcelNFT.connect(USER1).setDefaultRoyalty(USER2.address, 200)).to.be.revertedWith('missing role');

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([ZERO_ADDRESS, BigNumber.from(0)]);
  });

  it('should send DefaultRoyaltyChanged event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    expect(await parcelNFT.connect(USER1).setDefaultRoyalty(USER2.address, 200))
      .to.emit(parcelNFT, 'DefaultRoyaltyChanged')
      .withArgs(USER2.address, 200);
  });
});

describe('deleteDefaultRoyalty', () => {
  it('should update the default royalty to 0', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).setDefaultRoyalty(USER2.address, 200);

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);

    await parcelNFT.connect(USER1).deleteDefaultRoyalty();

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([ZERO_ADDRESS, BigNumber.from(0)]);
  });

  it('should fail if not called by parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await parcelNFT.setDefaultRoyalty(USER2.address, 200);

    await expect(parcelNFT.connect(USER1).deleteDefaultRoyalty()).to.be.revertedWith('missing role');

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);
  });

  it('should send DefaultRoyaltyChanged event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).setDefaultRoyalty(USER2.address, 200);

    expect(await parcelNFT.connect(USER1).deleteDefaultRoyalty())
      .to.emit(parcelNFT, 'DefaultRoyaltyChanged')
      .withArgs(ZERO_ADDRESS, 0);
  });
});

describe('setTokenRoyalty', () => {
  it('should update the token royalty', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([ZERO_ADDRESS, BigNumber.from(0)]);

    await parcelNFT.connect(USER1).setTokenRoyalty(100, USER2.address, 200);

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);
    expect(await parcelNFT.royaltyInfo(101, 10000)).to.deep.eq([ZERO_ADDRESS, BigNumber.from(0)]);
  });

  it('should fail if not called by parcel manager', async () => {
    const parcelNFT = await createParcelNFT();

    await expect(parcelNFT.connect(USER1).setTokenRoyalty(100, USER2.address, 200)).to.be.revertedWith('missing role');

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([ZERO_ADDRESS, BigNumber.from(0)]);
  });

  it('should send TokenRoyaltyChanged event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    expect(await parcelNFT.connect(USER1).setTokenRoyalty(100, USER2.address, 200))
      .to.emit(parcelNFT, 'TokenRoyaltyChanged')
      .withArgs(100, USER2.address, 200);
  });
});

describe('resetTokenRoyalty', () => {
  it('should update the token royalty to 0', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).setTokenRoyalty(100, USER2.address, 200);
    await parcelNFT.connect(USER1).setTokenRoyalty(101, USER2.address, 200);

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);
    expect(await parcelNFT.royaltyInfo(101, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);

    await parcelNFT.connect(USER1).resetTokenRoyalty(100);

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([ZERO_ADDRESS, BigNumber.from(0)]);
    expect(await parcelNFT.royaltyInfo(101, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);
  });

  it('should fail if not called by parcel manager', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, INITIALIZER.address);

    await parcelNFT.setTokenRoyalty(100, USER2.address, 200);

    await expect(parcelNFT.connect(USER1).resetTokenRoyalty(100)).to.be.revertedWith('missing role');

    expect(await parcelNFT.royaltyInfo(100, 10000)).to.deep.eq([USER2.address, BigNumber.from(200)]);
  });

  it('should send TokenRoyaltyChanged event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).setTokenRoyalty(100, USER2.address, 200);

    expect(await parcelNFT.connect(USER1).resetTokenRoyalty(100))
      .to.emit(parcelNFT, 'TokenRoyaltyChanged')
      .withArgs(100, ZERO_ADDRESS, 0);
  });
});
