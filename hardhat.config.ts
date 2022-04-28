import 'dotenv/config'; // https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import "@nomiclabs/hardhat-etherscan";
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

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: process.env.RINKEBY_NODE_URI,
      accounts: [process.env.WALLET_PRIVATE_KEY!], // https://bobbyhadz.com/blog/typescript-type-undefined-is-not-assignable-to-type-string
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },



};

export default hardhatConfig;
