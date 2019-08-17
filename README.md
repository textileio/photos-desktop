# Textile Wallet in Javascript _(js-textile-wallet)_

[![Made by Textile](https://img.shields.io/badge/made%20by-Textile-informational.svg?style=popout-square)](https://textile.io)
[![Chat on Slack](https://img.shields.io/badge/slack-slack.textile.io-informational.svg?style=popout-square)](https://slack.textile.io)
[![Keywords](https://img.shields.io/github/package-json/keywords/textileio/js-textile-wallet.svg?style=popout-square)](./package.json)

[![GitHub package.json version](https://img.shields.io/github/package-json/v/textileio/js-textile-wallet.svg?style=popout-square)](./package.json)
[![npm (scoped)](https://img.shields.io/npm/v/@textile/wallet.svg?style=popout-square)](https://www.npmjs.com/package/@textile/wallet)
[![node (scoped)](https://img.shields.io/node/v/@textile/wallet.svg?style=popout-square)](https://www.npmjs.com/package/@textile/wallet)
[![GitHub license](https://img.shields.io/github/license/textileio/js-textile-wallet.svg?style=popout-square)](./LICENSE)
[![David](https://img.shields.io/david/dev/textileio/js-textile-wallet.svg)](https://david-dm.org/textileio/js-textile-wallet)
[![CircleCI branch](https://img.shields.io/circleci/project/github/textileio/js-textile-wallet/master.svg?style=popout-square)](https://circleci.com/gh/textileio/js-textile-wallet)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=popout-square)](https://github.com/RichardLitt/standard-readme)
[![docs](https://img.shields.io/badge/docs-master-success.svg?style=popout-square)](https://textileio.github.io/js-textile-wallet/)

> Official Textile data wallet implemented in Javascript

Join us on our [public Slack channel](https://slack.textile.io/) for news, discussions, and status updates.

## Table of Contents

- [Background](#background)
- [Development](#development)
- [Browser](#browser)
- [Documentation](#documentation)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Background

[Textile](https://www.textile.io) provides encrypted, recoverable, schema-based, and cross-application data storage built on [IPFS](https://github.com/ipfs) and [libp2p](https://github.com/libp2p). We like to think of it as a decentralized data wallet with built-in protocols for sharing and recovery, or more simply, **an open and programmable iCloud**.

A Textile 'wallet' is a core component of the Textile system. A wallet is represented by mnemonic phrase, and in practice is a [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) Hierarchical [Deterministic Wallet](https://en.bitcoin.it/wiki/Deterministic_wallet) based on Stellar's implementation of [SLIP-0010](https://github.com/satoshilabs/slips/blob/master/slip-0010.md). You can learn more about BIP39 mnemonics and more in this really nice [interactive webpage](https://iancoleman.io/bip39/).

You can think of a wallet as a master key, and the account represents keys specific to a given application or use-case. Every account seed "inside" the wallet can be derived from the wallet's mnemonic phrase. Meaning that the wallet effectively _is_ the mnemonic phrase. Any given wallet may create an arbitrary number of accounts. For example, a single wallet can be used to provision multiple Textile Photos "accounts", each with a completely different persona. This provides a powerful partitioning framework.

Textile account seeds (private keys) always starts with an "S" for "secret" and account addresses (public keys) always start with a "P" for "public". See https://docs.textile.io/concepts/the-wallet/ for more details. 

## Development

```sh
# Run all the unit tests
yarn test

# Lint everything
# NOTE: Linting uses `prettier` to auto-fix styling issues when possible
yarn lint
```

You can also compile the Typescript yourself with:

```sh
yarn build
```

And even build a nice browser-compatible bundle with:

```sh
yarn browser
```

These will both build and add the exported Javascript files to `dist`, ready to be used in your next NodeJS, browser, React, Vue, or whatever app!

## Browser

Running `yarn browser` will produce a minified `bundle.js` in `dist`. This can be included in your browser app using something like:

```html
<!DOCTYPE html>
<html>
...
<script src="./dist/bundle.js"></script>
...
</html>
```

You'll have a global `var wallet` variable which gives you access to the Textile Wallet and other exported objects.

## Documentation

The auto-generated documentation can be found at https://textileio.github.io/js-textile-wallet/.

```sh
# Re-build the documentation
yarn docs
```

## Maintainer

[Carson Farmer](https://github.com/carsonfarmer)

## Contributing

This library is a work in progress. As such, there's a few things you can do right now to help out:

  * Ask questions! We'll try to help. Be sure to drop a note (on the above issue) if there is anything you'd like to work on and we'll update the issue to let others know. Also [get in touch](https://slack.textile.io) on Slack.
  * Log bugs, [file issues](https://github.com/textileio/js-textile-wallet/issues), submit pull requests!
  * **Perform code reviews**. More eyes will help a) speed the project along b) ensure quality and c) reduce possible future bugs.
  * Take a look at [go-textile-wallet](https://github.com/textileio/go-textile-wallet) (which we intend to follow to a point). Contributions here that would be most helpful are **top-level comments** about how it should look based on our understanding. Again, the more eyes the better.
  * **Add tests**. There can never be enough tests.
  * **Contribute to the [Textile docs](https://github.com/textileio/docs)** with any additions or questions you have about Textile and its various implementations. A good example would be asking, "What is an Account". If you don't know a term, odds are someone else doesn't either. Eventually, we should have a good understanding of where we need to improve communications and teaching together to make Textile even better.

 Before you get started, be sure to read our [contributors guide](./CONTRIBUTING.md) and our [contributor covenant code of conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE)
