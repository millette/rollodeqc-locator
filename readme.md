# rollodeqc-qc-locator [![Dependency Status](https://gemnasium.com/badges/github.com/millette/rollodeqc-qc-locator.svg)](https://gemnasium.com/github.com/millette/rollodeqc-qc-locator)
> Parse locations to extract city, etc.

Currently, this module is more like a proof on concept than anything useful.

The hard work is done by the [libpostal](https://github.com/openvenues/libpostal) library and its [node bindings](https://github.com/openvenues/node-postal).

Next thing to figure out is how to test on travis-ci, knowning we must compile/provide the libpostal C library.

## Install
```
$ npm install --save rollodeqc-qc-locator
```

## Usage
```js
const rollodeqcLocator = require('rollodeqc-qc-locator');

rollodeqcLocator('unicorns');
//=> 'unicorns & rainbows'
```

## API
### rollodeqcLocator(input, [options])
#### input
Type: `string`

Lorem ipsum.

#### options
##### foo
Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)
