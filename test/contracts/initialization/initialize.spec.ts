import { expect } from 'chai';
import { SUPER_ADMIN_ROLE } from '../../../src/constants/roles';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { deployParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';

describe('initialize', () => {
  it('should initialize the contract', async () => {
    const parcelNFT = await deployParcelNFT();

    expect(await parcelNFT.name()).to.eq('');
    expect(await parcelNFT.symbol()).to.eq('');
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, INITIALIZER.address)).to.be.false;
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER1.address)).to.be.false;

    await parcelNFT.initialize({ name: 'the name', symbol: 'the symbol', superAdmin: USER1.address });

    expect(await parcelNFT.name()).to.eq('the name');
    expect(await parcelNFT.symbol()).to.eq('the symbol');
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, INITIALIZER.address)).to.be.false;
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER1.address)).to.be.true;
  });

  it('should not allow initialization twice', async () => {
    const parcelNFT = await deployParcelNFT();
    await parcelNFT.initialize({ name: 'the name', symbol: 'the symbol', superAdmin: USER1.address });

    expect(
      parcelNFT.initialize({ name: 'the new name', symbol: 'the new symbol', superAdmin: USER2.address }),
    ).to.be.revertedWith('contract is already initialized');

    expect(await parcelNFT.name()).to.eq('the name');
    expect(await parcelNFT.symbol()).to.eq('the symbol');
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, INITIALIZER.address)).to.be.false;
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER1.address)).to.be.true;
    expect(await parcelNFT.hasRole(SUPER_ADMIN_ROLE, USER2.address)).to.be.false;
  });
});
