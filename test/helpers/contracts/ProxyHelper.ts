import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber, Contract } from 'ethers';
import { toEthereumAddress } from '../../../src/constants/accounts';
import { ERC1967Proxy__factory } from '../../../types/contracts';
import { INITIALIZER } from '../Accounts';
import { getStorageLocationFromText, readStorageValue } from '../storage';

export const asProxy = (contract: Contract, signer: SignerWithAddress = INITIALIZER) =>
  ERC1967Proxy__factory.connect(contract.address, signer);

export const getProxyImplementationAddress = async (contract: Contract) =>
  toEthereumAddress(
    BigNumber.from(
      await readStorageValue(
        INITIALIZER.provider!!,
        contract.address,
        getStorageLocationFromText('eip1967.proxy.implementation').sub(1),
      ),
    ),
  );
