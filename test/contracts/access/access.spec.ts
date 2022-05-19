import { expect } from 'chai';
import { ZERO_ADDRESS } from '../../../src/constants/accounts';
import { ACCESS_CONTROL_INTERFACE_ID } from '../../../src/constants/interfaces';
import { SUPER_ADMIN_ROLE } from '../../../src/constants/roles';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { shouldSupportInterface } from '../../helpers/ERC165Helper';
import { ROLE1, ROLE2 } from '../../helpers/Roles';

describe('IAccessControl', () => {
  shouldSupportInterface('IAccessControl', () => createParcelNFT(), ACCESS_CONTROL_INTERFACE_ID);
});

describe('SuperUser initialized with zero address', () => {
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
    await expect(parcelNFT.connect(USER1).grantRole(ROLE1, USER1.address)).to.be.revertedWith('missing role');

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.false;
  });
});

describe('SuperUser initialized with another address', () => {
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
    await expect(parcelNFT.connect(USER2).grantRole(ROLE1, USER2.address)).to.be.revertedWith('missing role');

    expect(await parcelNFT.hasRole(ROLE1, USER2.address)).to.be.false;
  });
});

describe('grantRole', async () => {
  it('should grant the role to the given user', async () => {
    const parcelNFT = await createParcelNFT();

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.false;

    await parcelNFT.grantRole(ROLE1, USER1.address);

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.true;
    expect(await parcelNFT.hasRole(ROLE2, USER1.address)).to.be.false;
    expect(await parcelNFT.hasRole(ROLE1, USER2.address)).to.be.false;
  });

  it('should not fail if called by other than role admin', async () => {
    const parcelNFT = await createParcelNFT();

    await expect(parcelNFT.connect(USER1).grantRole(ROLE1, USER2.address)).to.be.revertedWith('missing role');

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.false;
  });

  it('should emit RoleGranted', async () => {
    const parcelNFT = await createParcelNFT();

    expect(await parcelNFT.grantRole(ROLE1, USER1.address))
      .to.emit(parcelNFT, 'RoleGranted')
      .withArgs(ROLE1, USER1.address, INITIALIZER.address);
  });
});

describe('revokeRole', async () => {
  it('should remove the role from the given user', async () => {
    const parcelNFT = await createParcelNFT();

    await parcelNFT.grantRole(ROLE1, USER1.address);
    await parcelNFT.grantRole(ROLE2, USER1.address);
    await parcelNFT.grantRole(ROLE1, USER2.address);

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.true;
    expect(await parcelNFT.hasRole(ROLE2, USER1.address)).to.be.true;
    expect(await parcelNFT.hasRole(ROLE1, USER2.address)).to.be.true;

    await parcelNFT.revokeRole(ROLE1, USER1.address);

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.false;
    expect(await parcelNFT.hasRole(ROLE2, USER1.address)).to.be.true;
    expect(await parcelNFT.hasRole(ROLE1, USER2.address)).to.be.true;
  });

  it('should not fail if called by other than role admin', async () => {
    const parcelNFT = await createParcelNFT();

    await parcelNFT.grantRole(ROLE1, USER1.address);

    await expect(parcelNFT.connect(USER1).revokeRole(ROLE1, USER2.address)).to.be.revertedWith('missing role');

    expect(await parcelNFT.hasRole(ROLE1, USER1.address)).to.be.true;
  });

  it('should emit RoleRevoked', async () => {
    const parcelNFT = await createParcelNFT();

    await parcelNFT.grantRole(ROLE1, USER1.address);

    expect(await parcelNFT.revokeRole(ROLE1, USER1.address))
      .to.emit(parcelNFT, 'RoleRevoked')
      .withArgs(ROLE1, USER1.address, INITIALIZER.address);
  });
});
