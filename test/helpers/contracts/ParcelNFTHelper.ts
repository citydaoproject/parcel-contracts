import { EthereumAddress, ZERO_ADDRESS } from '../../../src/constants/accounts';
import { ParcelNFT__factory } from '../../../types/contracts';
import { INITIALIZER } from '../Accounts';

export const createParcelNFT = async (superAdmin: EthereumAddress = ZERO_ADDRESS) => {
  const parcelNFT = await deployParcelNFT();
  await parcelNFT.initialize(superAdmin);
  return parcelNFT;
};

export const deployParcelNFT = async () => new ParcelNFT__factory(INITIALIZER).deploy();
