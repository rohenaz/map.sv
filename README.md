# MAP: [Website](https://map.sv/?affiliate=$satchmo)
[MAP.sv](https://map.sv/?affiliate=$satchmo) is a website for high level info on MAP protocol, the `bmapjs` library, and the BMAP Bitcoin application development strategy. It also includes a BMAP transaction & code generator.

![last commit](https://img.shields.io/github/last-commit/rohenaz/map.sv.svg)
![license](https://img.shields.io/github/license/rohenaz/map.sv.svg?style=flat)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat)](https://github.com/RichardLitt/standard-readme)
[![app health](https://img.shields.io/website-up-down-green-red/https/map.sv.svg?label=status)](https://map.sv/?affiliate=$satchmo)

[![Screenshot](.github/images/website-example.gif)](https://map.sv/?affiliate=$satchmo)

## Table of Contents
- [Installation](#installation)
- [Documentation](#documentation)
- [Examples](#examples)
- [Code Standards](#code-standards)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Installation
```bash
$ npm install -g silica
$ npm install
``` 

### Running the Website
The watch command will build, run, and watch for changes to the filesystem.

```bash
$ silica watch
``` 

### Deploying the Website
Follow [this installation guide](https://github.com/rohenaz/allaboard-faucet#installation) for setting up a Firebase website

Once your firebase environment is setup, it's as easy as `firebase deploy` to push code.
```bash
$ npm run deploy
```

## Documentation
This website is organized as follows:
```
- /build/ (all public accessible assets, will be deployed)
    - /css/
    - /images/
    - /js/
    - /views/
    - app.js
    - manifest.json
    - index.html
    - ror.xml
    - site.webmanifest
    - sitemap.xml
```

## Examples
The [MAP.sv website](https://map.sv/?affiliate=$satchmo) is the example of this repo.

## Code Standards
Always use the language's best practices

## Usage
Projects that used [MAP](https://github.com/rohenaz/map) and [bmap](https://github.com/rohenaz/bmap):
- [MetaLens](https://metalens.allaboard.cash/?affiliate=$satchmo)
- [TonicPow](https://tonicpow.com/?affiliate=$satchmo)

## Maintainers
[Satchmo](https://github.com/rohenaz) - [MrZ](https://github.com/mrz1836)

Support the development of this project and the [MAP](https://map.sv/?affiliate=$satchmo) team 🙏

[![Donate](https://img.shields.io/badge/donate-bitcoin%20SV-brightgreen.svg)](http://handcash.to/$satchmo)

## Contributing
Feel free to dive in! [Open an issue](https://github.com/rohenaz/map.sv/issues/new) or submit PRs.

## License
![License](https://img.shields.io/github/license/rohenaz/map.sv.svg?style=flat)