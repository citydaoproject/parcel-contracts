import { BigNumber, BigNumberish, ethers } from 'ethers';
import { keccak256 } from 'ethers/lib/utils';
import { DateTime } from 'luxon';
import { MerkleTree } from 'merkletreejs';
import { EthereumAddress } from '../constants/accounts';

export type AllowListByAddress = { [key: EthereumAddress]: BigNumberish };

/**
 * Builds a Merkle Tree from the given allow list.
 *
 * @param allowList the account allowances to build the tree from
 */
export const buildMerkleTreeForAllowList = (allowList: AllowListByAddress): MerkleTree => {
  return new MerkleTree(
    Object.entries(allowList).map((entry) => buildAccountAllowanceHash(...entry)),
    keccak256,
    { sortPairs: true },
  );
};

/**
 * Gets the Merkle Tree hash for the given account allowance.
 *
 * @param address the account address
 * @param allowance the total allowed for the account
 * @param merkleTree the Merkle Tree to use
 */
export const getMerkleProof = (address: EthereumAddress, allowance: BigNumberish, merkleTree: MerkleTree): string[] =>
  merkleTree.getHexProof(buildAccountAllowanceHash(address, allowance));

/**
 * Hashes the given address and allowance to a 32 byte keccak256 hash.
 *
 * @see https://docs.ethers.io/v5/api/utils/hashing/#utils-solidityKeccak256
 *
 * @param address the account address
 * @param allowance the allowed tokens
 */
export const buildAccountAllowanceHash = (address: EthereumAddress, allowance: BigNumberish) =>
  ethers.utils.solidityKeccak256(['address', 'uint256'], [address, allowance]).slice(2);

/**
 * Convert the given timestamp and returns a Blockchain timestamp.
 *
 * @see https://moment.github.io/luxon/#/parsing
 *
 * @param timestamp A Luxon DateTime or a formatted timestamp (ISO 8601)
 */
export const convertToClaimPeriodTimestamp = (timestamp: string | DateTime): BigNumber => {
  const dateTime = 'toMillis' in DateTime ? timestamp : DateTime.fromISO(timestamp);
  return BigNumber.from(dateTime.toMillis()).div(1000);
};
