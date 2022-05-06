import { BytesLike } from 'ethers';
import { Hexable } from 'ethers/lib/utils';
import { toByte4String } from '../utils/fixedBytes';

export type Erc165InterfaceId = string;

export const toErc165InterfaceId = (value: BytesLike | Hexable | number): Erc165InterfaceId => toByte4String(value);

export const ACCESS_CONTROL_INTERFACE_ID = toErc165InterfaceId(0x7965db0b);
export const ERC2981_INTERFACE_ID = toErc165InterfaceId(0x2a55205a);
export const ERC721_INTERFACE_ID = toErc165InterfaceId(0x80ac58cd);
export const ERC721_METADATA_INTERFACE_ID = toErc165InterfaceId(0x5b5e139f);
