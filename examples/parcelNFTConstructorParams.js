const { buildParcelNFTInitFunction } = require('../dist/src/contracts/parcelNFT');
module.exports = [
  '0xEB667659b19dfc8B6b3b6FaAFaE3b5D7661dcB68',
  buildParcelNFTInitFunction({
    name: 'CityDAO Parcel-0',
    symbol: 'CityDAO-P0',
  }),
];
