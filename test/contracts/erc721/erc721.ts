import { ERC721_INTERFACE_ID, ERC721_METADATA_INTERFACE_ID } from '../../../src/constants/interfaces';
import { createParcelNFT } from '../../helpers/contracts/ParcelNFTHelper';
import { shouldSupportInterface } from '../../helpers/ERC165Helper';

describe('supportsInterface', () => {
  shouldSupportInterface('IERC721', () => createParcelNFT(), ERC721_INTERFACE_ID);
  shouldSupportInterface('IERC721Metadata', () => createParcelNFT(), ERC721_METADATA_INTERFACE_ID);
});
