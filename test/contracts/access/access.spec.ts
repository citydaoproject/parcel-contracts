import { expect } from 'chai';
import { SUPER_ADMIN_ROLE } from '../../../dist/constants/roles';
import { ZERO_ADDRESS } from '../../../src/constants/accounts';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { createParcelNFT } from '../../helpers/ParcelNFTHelper';
import { ROLE1 } from '../../helpers/Roles';

describe('initialized with zero address', () => {
  it('should set caller as super admin', async () => {
    const parcelNFT = await createParcelNFT(ZERO_ADDRESS);
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, INITIALIZER.address)).to.be.true;
  });

  it('should allow caller to change roles', async () => {
    const parcelNFT = await createParcelNFT(ZERO_ADDRESS);
    await parcelNFT.grantRole(ROLE1, USER1.address);

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.true;
  });

  it('should not allow others to change roles', async () => {
    const parcelNFT = await createParcelNFT(ZERO_ADDRESS);
    await expect(parcelNFT.connect(USER1).grantRole(ROLE1, USER1.address)).to.be.rejectedWith('missing role');
  });
});

describe('initialized with another address', () => {
  it('should set caller as super admin', async () => {
    const parcelNFT = await createParcelNFT(USER1.address);
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER1.address)).to.be.true;
  });

  it('should allow caller to change roles', async () => {
    const parcelNFT = await createParcelNFT(USER1.address);
    await parcelNFT.connect(USER1).grantRole(ROLE1, USER2.address);

    expect(await parcelNFT.hasRole(ROLE1, USER2.address)).to.be.true;
  });

  it('should not allow others to change roles', async () => {
    const parcelNFT = await createParcelNFT(USER1.address);
    await expect(parcelNFT.connect(USER2).grantRole(ROLE1, USER2.address)).to.be.rejectedWith('missing role');
  });
});
