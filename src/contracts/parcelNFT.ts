import { Signer } from 'ethers';
import { ParcelNFT, ParcelNFT__factory } from '../../types/contracts';
import { ContractAddress, EthereumAddress, ZERO_ADDRESS } from '../constants/accounts';
import { deployUpgradeableProxy } from './upgradeableProxy';

export interface ParcelNFTInitParams {
  // the name of the token
  name: string;

  // the symbol for the token
  symbol: string;

  // the super-admin address. Default is the caller.
  superAdmin: EthereumAddress;
}

export const defaultParcelNFTInitParams: ParcelNFTInitParams = {
  name: '',
  symbol: '',
  superAdmin: ZERO_ADDRESS,
};

/**
 * Creates and initializes an upgradeable Parcel NFT contract using the already-deployed
 * ParcelNFT contract for implementation
 *
 * @param signer the signer to use to deploy the proxy
 * @param parcelNFTLogicAddress the deployed parcel contract that will be used for logic
 * @param initParams (optional) the initialization parameters
 */
export const createParcelNFT = async (
  signer: Signer,
  parcelNFTLogicAddress: ContractAddress,
  initParams: Partial<ParcelNFTInitParams> = {},
): Promise<ParcelNFT> => {
  const initFunction = ParcelNFT__factory.createInterface().encodeFunctionData('initialize', [
    { ...defaultParcelNFTInitParams, ...initParams },
  ]);
  const proxy = await deployUpgradeableProxy(signer, parcelNFTLogicAddress, initFunction);
  return ParcelNFT__factory.connect(proxy.address, signer);
};
