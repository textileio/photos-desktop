# Photos Desktop _(photos-desktop)_

[![Made by Textile](https://img.shields.io/badge/made%20by-Textile-informational.svg?style=popout-square)](https://textile.io)
[![Chat on Slack](https://img.shields.io/badge/slack-slack.textile.io-informational.svg?style=popout-square)](https://slack.textile.io)
[![Keywords](https://img.shields.io/github/package-json/keywords/textileio/photos-desktop.svg?style=popout-square)](./package.json)

[![GitHub package.json version](https://img.shields.io/github/package-json/v/textileio/photos-desktop.svg?style=popout-square)](./package.json)
[![GitHub license](https://img.shields.io/github/license/textileio/photos-desktop.svg?style=popout-square)](./LICENSE)
[![David](https://img.shields.io/david/dev/textileio/photos-desktop.svg)](https://david-dm.org/textileio/photos-desktop)
[![CircleCI branch](https://img.shields.io/circleci/project/github/textileio/photos-desktop/master.svg?style=popout-square)](https://circleci.com/gh/textileio/photos-desktop)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=popout-square)](https://github.com/RichardLitt/standard-readme)

> Textile Photos... for desktop!

Join us on our [public Slack channel](https://slack.textile.io/) for news, discussions, and status updates. For current status, and where you can help, please see [issue #1](https://github.com/textileio/js-http-client/issues/1).

## Table of Contents

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Background](#background)
- [Textile Photos](#textile-photos)
- [Use it](#use-it)
- [Develop](#develop)
  * [Get started](#get-started)
  * [`yarn start`](#yarn-start)
  * [`yarn dev`](#yarn-dev)
  * [`yarn dist`](#yarn-dist)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)
<!-- AUTO-GENERATED-CONTENT:END -->

## Background

[Textile](https://www.textile.io) provides encrypted, recoverable, schema-based, and cross-application data storage built on [IPFS](https://github.com/ipfs) and [libp2p](https://github.com/libp2p). We like to think of it as a decentralized data wallet with built-in protocols for sharing and recovery, or more simply, **an open and programmable iCloud**.

## Textile Photos

[Textile Photos](https://www.textile.photos/) is a mobile, encrypted, secure, decentralized personal data wallet for your photos. It allows you to do things like:

* Organize your photos across your devices or back them up remotely
* Publish your photos to friends, family, or your favorite communities
* Store your data in a decentralized system designed to last forever

Textile photos is _censorship resistant_ because it is built on decentralized protocols for storage and sharing, helping to prevent any form of censorship. On top of that, your your photos and messages are _encrypted directly on your device_, giving you complete control over your privacy and sharing. We've also kept the whole thing open source, because we believe transparency starts with our code. Have a look here, and in our other repos on GitHub. You could even build your own Textile-based app!

## Use it

You can grab a [Photos Desktop release](https://github.com/textileio/photos-desktop/releases) from our GitHub repo. From there, you can grab one of our installers and install the app on your machine. It requires the Textile tray app to be running (for now), which you can grab from our [Textile Desktop releases](https://github.com/textileio/desktop/releases/latest).

## Develop

### Get started

```
git clone https://github.com/textileio/photos-desktop.git
cd photos-desktop
yarn install
```

Then, in the project directory, you can run:

### `yarn start`

Runs the app in web-development mode. It should automatically open [http://localhost:3000](http://localhost:3000) for you. The page will reload if you make edits, and you'll see any linting errors in the console.

### `yarn dev`

Runs the app in electron-development mode. It should automatically open and electron window on your system. The app will reload if you make edits, and you'll see any linting errors in the console.

### `yarn dist`

Builds the app for production to the `build` folder. And then bundles it into an installer for various platforms and exports these to a `dist` folder. It correctly bundles React in production mode, optimizes the build for the best performance, and then bundles it with Electron for that native desktop feel.

The app is ready to be installed and enjoyed!

## Maintainer

[Carson Farmer](https://github.com/carsonfarmer)

## Contributing

Textile's Photos Desktop app is a work in progress. As such, there's a few things you can do right now to help out:

* **Ask questions**! We'll try to help. Be sure to drop a note (on the above issue) if there is anything you'd like to work on and we'll update the issue to let others know. Also [get in touch](https://slack.textile.io) on Slack.
* **Log bugs**, [file issues](https://github.com/textileio/photos-desktop/issues), submit pull requests!
* **Perform code reviews**. More eyes will help a) speed the project along b) ensure quality and c) reduce possible future bugs.
* Take a look at the code. Contributions here that would be most helpful are **top-level comments** about how it should look based on your understanding. Again, the more eyes the better.
* **Add tests**. There can never be enough tests.
  
 Before you get started, be sure to read our [contributors guide](./CONTRIBUTING.md) and our [contributor covenant code of conduct](./CODE_OF_CONDUCT.md).

## Contributors
<!-- Update with yarn credit -->
<!-- ⛔️ AUTO-GENERATED-CONTENT:START (CONTRIBUTORS) -->
| **Commits** | **Contributor** |  
| --- | --- |  
| 23 | [carsonfarmer](https://github.com/carsonfarmer) |  
| 1  | [Gozala](https://github.com/Gozala) |  

<!-- ⛔️ AUTO-GENERATED-CONTENT:END -->

## License

[MIT](./LICENSE)
