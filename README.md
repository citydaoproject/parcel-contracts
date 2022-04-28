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

## Deploying
```
npx hardhat run --network <localhost, rinkeby> scripts/deploy.ts
```

## Test Deployment info

Ether_scan: https://rinkeby.etherscan.io/tx/0x8fb136794471e6d2e3b5ecb099b7921dcca4ef61d7c9c5707f3d97c7a132fd39

Deployment Fee: 0.201023293242139011  ETHER

Deployment Adddress: 0xe079dB2e4f4722bfc6d4C67383eD4caA1e577e26