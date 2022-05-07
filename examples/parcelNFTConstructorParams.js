const { buildParcelNFTInitFunction } = require('../dist/src/contracts/parcelNFT');
module.exports = [
  '0xc0cA359c8ce6De21B98fC6c7921a08703f453Fe9',
  buildParcelNFTInitFunction({
    name: 'ParcelNFT Test 2022-05-07-02',
    symbol: 'PT050702',
  }),
];
