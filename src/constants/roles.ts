import { BytesLike } from 'ethers';
import { Hexable, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { toByte32String } from '../utils/fixedBytes';

export type AccessRole = string;

export const toAccessRole = (value: BytesLike | Hexable | number): AccessRole => toByte32String(value);

export const SUPER_ADMIN_ROLE = toAccessRole(0);
export const ADMIN_ROLE = keccak256(toUtf8Bytes('citydao.Admin'));
