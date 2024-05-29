import { EditorView, keymap } from "@codemirror/view";
import { indentWrappedLines } from "../lib";
import { Extension } from "@codemirror/state";
import { indentWithTab } from "@codemirror/commands";

const extensions: Extension = [
	indentWrappedLines({
		initialIndent: 0,
		initialIndentType: "space",
	}),
	keymap.of([
		indentWithTab,
	]),
];

const doc = `{
\t"testing": "more testing",
\t"wrapped testing": "amountOfSpacingamountOfSpacingamountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing amountOfSpacing"
}`;

const parent = document.getElementById("content")!;

new EditorView({
	doc,
	extensions,
	parent,
})