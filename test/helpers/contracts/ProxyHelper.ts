import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Contract } from 'ethers';
import { ERC1967Proxy__factory } from '../../../types/contracts';
import { INITIALIZER } from '../Accounts';

export const asProxy = (contract: Contract, signer: SignerWithAddress = INITIALIZER) =>
  ERC1967Proxy__factory.connect(contract.address, signer);
