# codemirror-indent-wrapped-line
An extension to CodeMirror to indent wrapped newlines

## Installation
The step to use codemirror-indent-wrapped-line is to install the package from npm.
```
npm install codemirror-indent-wrapped-line
```

## How to use
Import the extension into the file where you are using CodeMirror. Then add the extension to the CodeMirror instance.

You can also supply options to the extension to change the behavior of the extension.

The options object is optional and has default values. The default values are:
- initialIndent: 0
- initialIndentType: "space"

The initialIndent is the number of the specified IndentType will be applied to the indented line after the indenting is matched to the start of the line.

The initialIndentType is the type of indent that will be applied to the indented line after the indenting is matched to the start of the line. The options are:
- "space"
- "tab"
- "indentUnit"

The tab size is supplied by the CodeMirror instance which is by default 4 spaces.

The indentUnit is supplied by CodeMirror instance which is by default 2 spaces.

## Example
This example will show how to add the extension to a plain CodeMirror instance. The extension will indent the wrapped line by 2 times the size of a tab as defined in the options passes to the extension.

```ts
import { indentWrappedLine } from 'codemirror-indent-wrapped-line';
import { EditorView } from '@codemirror/view';

// Define the options object
// This will indent the wrapped line by 2 times the size of a tab (8 spaces in this case as default tab size isn't overriden)
const options = {
	initialIndent: 2,
	initialIndentType: "tab",
}

new EditorView({
	extensions: [
		// Give the extension the options object or define the options object in the extension
		indentWrappedLine(options),
	],
})
```

## Contributing
I welcome any and all issuea and PRs submitted. I will respond and or solve the issues as soon as possible. If you have any questions or concerns, please feel free to reach out to me on [discord](https://discord.com/): shadowwolf308.

### Requirements
- [PNPM](https://pnpm.io/) (npm i -g pnpm)

### Live Development
To run in live development mode, run the following `pnpm dev` in the project directory. This will start the [Vite](https://vitejs.dev/) development server.

## License
codemirror-indent-wrapped-line is licensed under [MIT](LICENSE)

Copyright (c) 2024, Levy van der Valk