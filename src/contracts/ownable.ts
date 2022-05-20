import { OwnableUpgradeable__factory } from '../../types/contracts';
import { EthereumAddress } from '../constants/accounts';

export const encodeTransferOwnershipFunction = (newOwner: EthereumAddress) =>
  OwnableUpgradeable__factory.createInterface().encodeFunctionData('transferOwnership', [newOwner]);
