import { expect } from 'chai';
import { ZERO_ADDRESS } from '../../../src/constants/accounts';
import { SUPER_ADMIN_ROLE } from '../../../src/constants/roles';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { ROLE1 } from '../../helpers/Roles';

describe('initialized with zero address', () => {
  it('should set caller as super admin', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, INITIALIZER.address)).to.be.true;
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER1.address)).to.be.false;
  });

  it('should allow caller to change roles', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await parcelNFT.grantRole(ROLE1, USER1.address);

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.true;
  });

  it('should not allow others to change roles', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await expect(parcelNFT.connect(USER1).grantRole(ROLE1, USER1.address)).to.be.rejectedWith('missing role');

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.false;
  });
});

describe('initialized with another address', () => {
  it('should set caller as super admin', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: USER1.address });
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER1.address)).to.be.true;
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, INITIALIZER.address)).to.be.false;
  });

  it('should allow caller to change roles', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: USER1.address });
    await parcelNFT.connect(USER1).grantRole(ROLE1, USER2.address);

    expect(await parcelNFT.hasRole(ROLE1, USER2.address)).to.be.true;
  });

  it('should not allow others to change roles', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: USER1.address });
    await expect(parcelNFT.connect(USER2).grantRole(ROLE1, USER2.address)).to.be.rejectedWith('missing role');

    expect(await parcelNFT.hasRole(ROLE1, USER2.address)).to.be.false;
  });
});
