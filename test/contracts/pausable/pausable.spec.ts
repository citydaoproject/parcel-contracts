import { expect } from 'chai';
import { PAUSER_ROLE } from '../../../src/constants/roles';
import { INITIALIZER, USER1, USER2 } from '../../helpers/Accounts';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';

describe('pause', () => {
  it('should pause the contract', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);

    expect(await parcelNFT.paused()).to.be.false;

    await parcelNFT.grantRole(PAUSER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).pause();

    expect(await parcelNFT.paused()).to.be.true;
  });

  it('should fail if called by non-pauser', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);
    await parcelNFT.transferOwnership(USER1.address);

    expect(parcelNFT.connect(USER1).pause()).to.be.revertedWith('missing role');

    expect(await parcelNFT.paused()).to.be.false;

    await parcelNFT.grantRole(PAUSER_ROLE, USER1.address);
    await parcelNFT.connect(USER1).transferOwnership(USER2.address);

    expect(parcelNFT.connect(USER2).pause()).to.be.revertedWith('missing role');

    expect(await parcelNFT.paused()).to.be.false;
  });

  it('should fail if called when paused', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);

    await parcelNFT.pause();

    expect(parcelNFT.pause()).to.be.revertedWith('paused');

    expect(await parcelNFT.paused()).to.be.true;
  });

  it('should send a Paused event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);

    expect(await parcelNFT.pause())
      .to.emit(parcelNFT, 'Paused')
      .withArgs(INITIALIZER.address);
  });
});

describe('unpause', () => {
  it('should unpause the contract', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);

    await parcelNFT.pause();

    expect(await parcelNFT.paused()).to.be.true;

    await parcelNFT.grantRole(PAUSER_ROLE, USER1.address);

    await parcelNFT.connect(USER1).unpause();

    expect(await parcelNFT.paused()).to.be.false;
  });

  it('should fail if called by non-pauser', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);
    await parcelNFT.transferOwnership(USER1.address);

    await parcelNFT.pause();

    expect(parcelNFT.connect(USER1).unpause()).to.be.revertedWith('missing role');

    expect(await parcelNFT.paused()).to.be.true;

    await parcelNFT.grantRole(PAUSER_ROLE, USER1.address);
    await parcelNFT.connect(USER1).transferOwnership(USER2.address);

    expect(parcelNFT.connect(USER2).unpause()).to.be.revertedWith('missing role');

    expect(await parcelNFT.paused()).to.be.true;
  });

  it('should fail if called when unpaused', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);

    expect(parcelNFT.unpause()).to.be.revertedWith('not paused');

    expect(await parcelNFT.paused()).to.be.false;
  });

  it('should send a Unpaused event', async () => {
    const parcelNFT = await createParcelNFT();
    await parcelNFT.grantRole(PAUSER_ROLE, INITIALIZER.address);

    await parcelNFT.pause();

    expect(await parcelNFT.unpause())
      .to.emit(parcelNFT, 'Unpaused')
      .withArgs(INITIALIZER.address);
  });
});
