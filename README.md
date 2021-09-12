# skills17/test-result-printer

<img src="https://cyrilwanner.github.io/packages/skills17/test-result-printer/assets/output-preview.png" align="center">

Prints test results in a nice format to the console.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

```bash
npm install @skills17/test-result-printer
```

## Usage

A `TestRun` instance of the [`@skills17/test-result`](https://github.com/skills17/test-result) package can be passed to the `Printer` constructor.

```typescript
import Printer from '@skills17/test-result-printer';

const printer = new Printer(testRun);
printer.print();
```

The result will be printed to the standard output.

Additionally, the `print` method supports an optional options parameter:

```typescript
{
  // use a different printing function (defaults to console.log)
  printer?: (...data: string[]) => void;

  // if the header should be printed or not (defaults to true)
  printHeader?: boolean;

  // if the footer should be printed or not (defaults to false)
  printFooter?: boolean;

  // if points should be printed or not (defaults to true)
  printPoints?: boolean;
}
```

## License

[MIT](https://github.com/skills17/test-result-printer/blob/master/LICENSE)
