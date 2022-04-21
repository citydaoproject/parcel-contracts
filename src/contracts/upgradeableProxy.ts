import { Signer } from 'ethers';
import { BytesLike } from 'ethers/lib/utils';
import { ERC1967Proxy__factory } from '../../types/contracts';
import { ContractAddress } from '../constants/accounts';

/**
 * Deploy an upgradeable proxy contract with the given contract address to be used
 * for the logic and initialization function
 *
 * @param signer The signer to use for deployment
 * @param logicAddress the address of the contract to use for the implementation logic
 * @param initFunction (optional) the initialization function, abi-encoded. Defaults to empty
 */
export const deployUpgradeableProxy = async (
  signer: Signer,
  logicAddress: ContractAddress,
  initFunction: BytesLike = '0x',
) => new ERC1967Proxy__factory(signer).deploy(logicAddress, initFunction);

/**
 * Build a transaction to deploy an upgradeable proxy contract with the given contract address
 * to be used for the logic and initialization function
 *
 * @param signer The signer to use for deployment
 * @param logicAddress the address of the contract to use for the implementation logic
 * @param initFunction (optional) the initialization function, abi-encoded. Defaults to empty
 */
export const buildUpgradeableProxyDeployment = async (
  signer: Signer,
  logicAddress: ContractAddress,
  initFunction: BytesLike = '0x',
) => new ERC1967Proxy__factory().getDeployTransaction(logicAddress, initFunction);
