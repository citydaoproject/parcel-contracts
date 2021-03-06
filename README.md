# Parcel Contracts

## Setup

### Node

1.  Install `nvm` ([Node Version Manager](https://github.com/nvm-sh/nvm))
2.  `cd` to the project directory and execute the following:
    ```
    nvm install
    nvm use
    npm install
    ```

### IDE Setup

This project uses [EditorConfig](https://editorconfig.org/) for IDE configuration.

See `.editorconfig` for settings.

Many popular IDEs and editors support this out of the box or with a plugin.

## Development

### Prettier

This project uses [Prettier](https://prettier.io/), so please run it before checking in:

```
npm run pretty
```

See `.prettierrc` for settings.

Some IDEs and editors have plugins for running Prettier.

### Linting

This project uses [ESLint](https://eslint.org/). Check linting before checking in:

```
npm run lint
```

See `tslint.json` for settings.

Many IDEs and editors support TSLint.

## Testing

This project uses [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/), and [Waffle](https://getwaffle.io/) for testing. Run tests before checking in.

```
npm test
```

## Building

```
npm run build
```

## Verification

Set up a `.secrets.json` file that looks similar to `example.secrets.json`:

After deploying your contract, you can verify it by running the following.

### Rinkeby
```
npx hardhat verify --network rinkeby CONTRACT_ADDRESS
```

For a proxy contract, you'll need to pass the arguments to the proxy contract, and pass the contract as well:

```
npx hardhat verify --network rinkeby \
  --contract contracts/common/UpgradeableProxy.sol:UpgradeableProxy \
  --constructor-args examples/parcelNFTConstructorParams.js \
  CONTRACT_ADDRESS
```

### Mainnet
```
npx hardhat verify --network rinkeby CONTRACT_ADDRESS
```

```
npx hardhat verify --network mainnet \
  --contract contracts/common/UpgradeableProxy.sol:UpgradeableProxy \
  --constructor-args examples/parcelNFTConstructorParams.js \
  CONTRACT_ADDRESS
```

See [hardhat-etherscan](https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html) for more examples
