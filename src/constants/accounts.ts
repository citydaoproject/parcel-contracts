import { toFixedByteString } from '../utils/fixedBytes';

export type AccountAddress = string;
export type ContractAddress = string;
export type EthereumAddress = AccountAddress | ContractAddress;

export const toEthereumAddress = (value: number): EthereumAddress => toFixedByteString(value, 20);

export const ZERO_ADDRESS = toEthereumAddress(0);
