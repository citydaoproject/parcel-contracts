import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/config';

const hardhatConfig: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },

  typechain: {
    externalArtifacts: ['node_modules/@openzeppelin/contracts/build/contracts/ERC1967Proxy.json'],
    outDir: 'types/contracts',
    target: 'ethers-v5',
  },
};

export default hardhatConfig;
