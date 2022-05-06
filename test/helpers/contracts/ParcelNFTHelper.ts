import { defaultParcelNFTInitParams, ParcelNFTInitParams } from '../../../src/contracts/parcelNFT';
import { ParcelNFT__factory } from '../../../types/contracts';
import { INITIALIZER } from '../Accounts';

export const createParcelNFT = async (initParams: Partial<ParcelNFTInitParams> = {}) => {
  const parcelNFT = await deployParcelNFT();
  await parcelNFT.initialize({ ...defaultParcelNFTInitParams, ...initParams });
  return parcelNFT;
};

export const deployParcelNFT = async () => new ParcelNFT__factory(INITIALIZER).deploy();
