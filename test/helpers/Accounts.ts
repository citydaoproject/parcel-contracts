import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers } from 'hardhat';

export let accounts: SignerWithAddress[] = [];

export let INITIALIZER: SignerWithAddress;
export let USER1: SignerWithAddress;
export let USER2: SignerWithAddress;
export let USER3: SignerWithAddress;

export type OnInitAccountsHandler = (accounts: SignerWithAddress[]) => void | Promise<void>;

const onInitAccountsHandlers: OnInitAccountsHandler[] = [];

export const onInitAccounts = (handler: OnInitAccountsHandler) => {
  onInitAccountsHandlers.push(handler);
};

export const initAccounts = async () => {
  accounts = await ethers.getSigners();

  [INITIALIZER, USER1, USER2, USER3] = accounts;

  await Promise.all(onInitAccountsHandlers.map(async (handler) => await handler(accounts)));
};
