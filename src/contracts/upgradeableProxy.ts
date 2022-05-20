import { TransactionRequest } from '@ethersproject/providers';
import { BigNumber, providers, Signer } from 'ethers';
import { BytesLike } from 'ethers/lib/utils';
import { ERC1967Proxy, UpgradeableProxy__factory } from '../../types/contracts';
import { ContractAddress, toEthereumAddress } from '../constants/accounts';
import { getStorageLocationFromText, readStorageValue } from '../utils/storage';

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

/**
 * Retrieves the proxy implementation address from a proxy contract's storage.
 *
 * @param proxy the contract to retrieve the proxy implementation from
 * @param provider (optional) the provider to use. Defaults to contract provider
 */
export const getProxyImplementationAddress = async (proxy: ERC1967Proxy, provider?: providers.Provider) =>
  toEthereumAddress(
    BigNumber.from(
      await readStorageValue(
        provider || proxy.provider,
        proxy.address,
        getStorageLocationFromText('eip1967.proxy.implementation').sub(1),
      ),
    ),
  );
