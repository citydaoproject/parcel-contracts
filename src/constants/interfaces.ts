import { BytesLike } from 'ethers';
import { Hexable } from 'ethers/lib/utils';
import { toByte4String } from '../utils/fixedBytes';

export type Erc165InterfaceId = string;

export const toErc165InterfaceId = (value: BytesLike | Hexable | number): Erc165InterfaceId => toByte4String(value);

/**
 * @description Access Control List (ACL)
 */
export const ACCESS_CONTROL_INTERFACE_ID = toErc165InterfaceId(0x7965db0b);

/**
 * @description Royalty standard
 */
export const ERC2981_INTERFACE_ID = toErc165InterfaceId(0x2a55205a);

/**
 * @description NFT standard
 */
export const ERC721_INTERFACE_ID = toErc165InterfaceId(0x80ac58cd);

/**
 * @description Supports totalSupply, tokenOfOwnerByIndex, and tokenByIndex
 */
export const ERC721_ENUMERABLE_INTERFACE_ID = toErc165InterfaceId(0x780e9d63);

/**
 * @description Supports name, symbol, and tokenURI
 */
export const ERC721_METADATA_INTERFACE_ID = toErc165InterfaceId(0x5b5e139f);
