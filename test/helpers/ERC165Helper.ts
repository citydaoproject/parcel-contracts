import { expect } from 'chai';
import { Contract } from 'ethers';
import { Erc165InterfaceId } from '../../src/constants/interfaces';
import { IERC165Upgradeable__factory } from '../../types/contracts';
import { INITIALIZER } from './Accounts';

export const asErc165 = (contract: Contract) => IERC165Upgradeable__factory.connect(contract.address, INITIALIZER);

export const shouldSupportInterface = (
  interfaceName: string,
  create: () => Promise<Contract>,
  interfaceId: Erc165InterfaceId,
) => {
  it(`should support ${interfaceName} interface`, async () => {
    const obj = asErc165(await create());

    expect(await obj.supportsInterface(interfaceId)).to.be.true;
  });
};
