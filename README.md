# Comic Viewer

Tired of reading your favorite comics on sites with basically no navigation? worry no more, the comic reader is here!

## Getting Started

Just download the correct installer for your pc from the [releases tab](https://github.com/triktron/comic-reader/releases/latest).

### Prerequisites

download the latest version of [node](https://nodejs.org/en/download/) and [git](https://git-scm.com/downloads).


### Installing

Installing from source:

First clone this repository.

```
git clone https://github.com/triktron/comic-reader.git
cd comic-reader
```

Then install the Dependencies.

```
npm install
```

And you are set! just execute this and liftoff.

```
npm start
```

## Running the tests

Sadly there are no tests yet...


## Deployment

To build it's as easy as typing

```
npm build
```

## Built With

* [electron-forge](https://www.electronforge.io/) - Manges the electron versions
* [electron](https://electronjs.org/) - The web framework used
* [chrome-tab.js](https://github.com/adamschwartz/chrome-tabs) - Used to mimic the chrome tabs

## To-Do list

- [x] read date from the server
- [ ] auto update
- [ ] store the pages locally
- [ ] manage existing comics

## Authors

* **Luca Vanesche** - *Initial work* - [Triktron](https://github.com/triktron)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* thx PurpleBooth for the readme template ([gist here](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2))
