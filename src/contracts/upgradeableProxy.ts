import { TransactionRequest } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { BytesLike } from 'ethers/lib/utils';
import { UpgradeableProxy__factory } from '../../types/contracts';
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
) => new UpgradeableProxy__factory(signer).deploy(logicAddress, initFunction);

/**
 * Build a transaction to deploy an upgradeable proxy contract with the given contract address
 * to be used for the logic and initialization function
 *
 * @param logicAddress the address of the contract to use for the implementation logic
 * @param initFunction (optional) the initialization function, abi-encoded. Defaults to empty
 */
export const buildDeployUpgradeableProxyTransactionRequest = (
  logicAddress: ContractAddress,
  initFunction: BytesLike = '0x',
): TransactionRequest => new UpgradeableProxy__factory().getDeployTransaction(logicAddress, initFunction);
