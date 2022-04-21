import { Signer } from 'ethers';
import { ParcelNFT, ParcelNFT__factory } from '../../types/contracts';
import { ContractAddress, EthereumAddress, ZERO_ADDRESS } from '../constants/accounts';
import { deployUpgradeableProxy } from './upgradeableProxy';

/**
 * Creates and initializes an upgradeable Parcel NFT contract using the already-deployed
 * ParcelNFT contract for implementation
 *
 * @param signer the signer to use to deploy the proxy
 * @param parcelNFTLogicAddress the deployed parcel contract that will be used for logic
 * @param superAdmin (optional) the super-admin address. Default is the caller.
 */
export const createParcelNFT = async (
  signer: Signer,
  parcelNFTLogicAddress: ContractAddress,
  superAdmin: EthereumAddress = ZERO_ADDRESS,
): Promise<ParcelNFT> => {
  const initFunction = ParcelNFT__factory.createInterface().encodeFunctionData('initialize', [superAdmin]);
  const proxy = await deployUpgradeableProxy(signer, parcelNFTLogicAddress, initFunction);
  return ParcelNFT__factory.connect(proxy.address, signer);
};
