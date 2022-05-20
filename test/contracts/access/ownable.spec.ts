import { expect } from 'chai';
import { ZERO_ADDRESS } from '../../../src/constants/accounts';
import {
  OWNERSHIP_MANAGER_ROLE,
  PARCEL_MANAGER_ROLE,
  PAUSER_ROLE,
  SUPER_ADMIN_ROLE,
  UPGRADER_ROLE,
} from '../../../src/constants/roles';
import { encodeTransferOwnershipFunction } from '../../../src/contracts/ownable';
import { createParcelNFT as createParcelNFTProxy } from '../../../src/contracts/parcelNFT';
import { INITIALIZER, USER1 } from '../../helpers/Accounts';
import { createParcelNFT, deployParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';

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
  it('should transfer ownership if owner', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await parcelNFT.transferOwnership(USER1.address);

    expect(await parcelNFT.owner()).to.eq(USER1.address);
  });

  it('should transfer ownership if ownership manager', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await parcelNFT.grantRole(OWNERSHIP_MANAGER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).transferOwnership(USER1.address);

    expect(await parcelNFT.owner()).to.eq(USER1.address);
  });

  it('should fail to transfer ownership when not owner or ownership manager', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await parcelNFT.grantRole(SUPER_ADMIN_ROLE, USER1.address);
    await parcelNFT.grantRole(PARCEL_MANAGER_ROLE, USER1.address);
    await parcelNFT.grantRole(PAUSER_ROLE, USER1.address);
    await parcelNFT.grantRole(UPGRADER_ROLE, USER1.address);

    await expect(parcelNFT.connect(USER1).transferOwnership(USER1.address)).to.be.revertedWith(
      'caller is not the owner nor ownership manager',
    );

    expect(await parcelNFT.owner()).to.eq(INITIALIZER.address);
  });

  it('should fail to transfer ownership when paused', async () => {
    const parcelNFT = await createParcelNFT({ superAdmin: ZERO_ADDRESS });
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);

    await parcelNFT.pause();

    await expect(parcelNFT.transferOwnership(USER1.address)).to.be.revertedWith('paused');

    expect(await parcelNFT.owner()).to.eq(INITIALIZER.address);
  });
});

describe('setOwner', () => {
  it('should set owner during upgrade', async () => {
    const parcelNFTLogic = await deployParcelNFT();
    const parcelNFT = await createParcelNFTProxy(INITIALIZER, parcelNFTLogic.address);
    await parcelNFT.grantRole(UPGRADER_ROLE, INITIALIZER.address);
    await parcelNFT.grantRole(OWNERSHIP_MANAGER_ROLE, INITIALIZER.address);

    // reset it back to as if it were uninitialized
    await parcelNFT.renounceOwnership();

    const newParcelNFTLogic = await deployParcelNFT();
    await parcelNFT.upgradeToAndCall(newParcelNFTLogic.address, encodeTransferOwnershipFunction(USER1.address));

    expect(await parcelNFT.owner()).to.eq(USER1.address);
  });
});
