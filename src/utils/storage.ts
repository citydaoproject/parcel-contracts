import { BigNumber, providers } from 'ethers';
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { ContractAddress } from '../constants/accounts';

export const readStorageValue = async (provider: providers.Provider, address: ContractAddress, location: BigNumber) =>
  (await readStorageValues(provider, address, location, 1))[0];

export const readStorageValues = async (
  provider: providers.Provider,
  address: ContractAddress,
  location: BigNumber,
  numValues: number,
) =>
  Promise.all(
    Array.from<number>(Array(numValues)).map((_, index) => provider.getStorageAt(address, location.add(index))),
  );

export const getStorageLocationFromText = (location: string) => BigNumber.from(keccak256(toUtf8Bytes(location)));

export const getStorageLocationFromBigNumber = (index: BigNumber) => BigNumber.from(keccak256(index.toHexString()));
