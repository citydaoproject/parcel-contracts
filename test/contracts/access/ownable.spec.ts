import { expect } from 'chai';
import { ZERO_ADDRESS } from '../../../src/constants/accounts';
import { INITIALIZER, USER1 } from '../../helpers/Accounts';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';

describe('Owner initialized with zero address', () => {
  it('should set caller as super admin', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    expect(await parcelNFT.owner()).to.eq(INITIALIZER.address);
  });
});

describe('Owner initialized with another address', () => {
  it('should set caller as super admin', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: USER1.address });
    expect(await parcelNFT.owner()).to.eq(USER1.address);
  });
});

describe('transferOwnership', () => {
  it('should transfer ownership', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await parcelNFT.transferOwnership(USER1.address);

    expect(await parcelNFT.owner()).to.eq(USER1.address);
  });

  it('should fail to transfer ownership when not owner', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await expect(parcelNFT.connect(USER1).transferOwnership(USER1.address)).to.be.revertedWith(
      'caller is not the owner',
    );

    expect(await parcelNFT.owner()).to.eq(INITIALIZER.address);
  });
});
