import { BytesLike } from 'ethers';
import { Hexable, hexlify, zeroPad } from 'ethers/lib/utils';

export const toFixedByteString = (value: BytesLike | Hexable | number, size: number): string =>
  hexlify(zeroPad(hexlify(value), size));

export const toByte4String = (value: BytesLike | Hexable | number) => toFixedByteString(value, 4);
export const toByte32String = (value: BytesLike | Hexable | number) => toFixedByteString(value, 32);
