import { expect } from 'chai';
import { SUPER_ADMIN_ROLE, UPGRADER_ROLE } from '../../../src/constants/roles';
import { createParcelNFT } from '../../../src/contracts/parcelNFT';
import { INITIALIZER, USER1 } from '../../helpers/Accounts';
import { deployParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { getProxyImplementationAddress } from '../../helpers/contracts/ProxyHelper';

describe('createParcelNFT', () => {
  it('should create and initialize the contract', async () => {
    const parcelNFTLogic = await deployParcelNFT();
    const parcelNFT = await createParcelNFT(INITIALIZER, parcelNFTLogic.address, { superAdmin: USER1.address });

    expect(await getProxyImplementationAddress(parcelNFT)).to.eq(parcelNFTLogic.address);

    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER1.address)).to.be.true;
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, INITIALIZER.address)).to.be.false;
  });

  it('should create upgradeable contract', async () => {
    const parcelNFTLogic = await deployParcelNFT();
    const parcelNFT = await createParcelNFT(INITIALIZER, parcelNFTLogic.address);
    await parcelNFT.grantRole(UPGRADER_ROLE, INITIALIZER.address);

    const newParcelNFTLogic = await deployParcelNFT();
    await parcelNFT.upgradeTo(newParcelNFTLogic.address);

    expect(await getProxyImplementationAddress(parcelNFT)).to.eq(newParcelNFTLogic.address);
  });

  it('should fail to upgrade when not an upgrader', async () => {
    const parcelNFTLogic = await deployParcelNFT();
    const parcelNFT = await createParcelNFT(INITIALIZER, parcelNFTLogic.address);
    await parcelNFT.grantRole(UPGRADER_ROLE, INITIALIZER.address);

    const newParcelNFTLogic = await deployParcelNFT();
    await expect(parcelNFT.connect(USER1).upgradeTo(newParcelNFTLogic.address)).to.be.revertedWith('missing role');

    expect(await getProxyImplementationAddress(parcelNFT)).to.eq(parcelNFTLogic.address);
  });
});
