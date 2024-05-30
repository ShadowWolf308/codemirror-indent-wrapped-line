import { EditorState, Extension, Line, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, PluginValue, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { getIndentUnit } from "@codemirror/language";
import { IndentWrappedLinesOptions } from "./types";

class IndentWrappedLinesPlugin implements PluginValue {
	public decorations!: DecorationSet;

	private view: EditorView;
	private indentUnit: number;
	private options: IndentWrappedLinesOptions;
	private initialPadding: string | null = null;

	public constructor(view: EditorView, options: IndentWrappedLinesOptions) {
		this.view = view;
		this.indentUnit = getIndentUnit(view.state);
		this.options = options;

		this.generate(view.state);
	}

	public update(update: ViewUpdate): void {
		const indentUnit = getIndentUnit(update.state);

		this.indentUnit = indentUnit;

		if (update.docChanged || update.geometryChanged) {
			this.generate(update.state);
		}
	}

	private generate(state: EditorState): void {
		const builder = new RangeSetBuilder<Decoration>();

		if (this.initialPadding) {
			this.appendStylesToBuilder(builder, state, this.initialPadding);
		} else {
			const read = (view: EditorView): void => {
				const element = view.contentDOM.querySelector(".cm-line");

				if (element) {
					this.initialPadding = window.getComputedStyle(element).getPropertyValue("padding-left");

					this.appendStylesToBuilder(builder, state, this.initialPadding);
				}
			}

			this.view.requestMeasure({
				read,
			});
		}

		this.decorations = builder.finish();
	}

	private appendStylesToBuilder(builder: RangeSetBuilder<Decoration>, state: EditorState, initialPadding: string): void {
		const lines = this.getVisibleLines(state);
		const initialIndentValue = this.getInitialIndentValue(state.tabSize);

		for (const line of lines) {
			const indentSize = this.getIndentSize(line.text, state.tabSize);

			const characterSpacing = `${indentSize + initialIndentValue}ch`;

			const paddingValue = `calc(${characterSpacing} + ${initialPadding})`;
			const textIndentValue = `calc(-${characterSpacing} - 1px)`;

			builder.add(
				line.from,
				line.from,
				Decoration.line({
					attributes: {
						style: `padding-left: ${paddingValue}; text-indent: ${textIndentValue};`,
					},
				}),
			);
		}
	}

	private getVisibleLines(state: EditorState): Set<Line> {
		const lines: Set<Line> = new Set<Line>();
		let lastLine: Line | undefined = undefined;

		for (const range of this.view.visibleRanges) {
			let position: number = range.from;

			while (position < range.to) {
				const line: Line = state.doc.lineAt(position);

				if (line !== lastLine) {
					lines.add(line);
					lastLine = line;
				}

				position += line.length + 1;
			}
		}

		return lines;
	}

	public getIndentSize(value: string, tabSize: number): number {
		let amountOfSpaces = 0;
		let amountOfTabs = 0;

		for (let index = 0; index < value.length; index++) {
			if (value[index] === " ") {
				amountOfSpaces++;

				continue;
			} else if (value[index] === "\t") {
				amountOfTabs++;

				continue;
			} else if (value[index] === "\r") {
				continue;
			} else {
				break;
			}
		}

		return amountOfSpaces + (amountOfTabs * tabSize);
	}

	private getInitialIndentValue(tabSize: number): number {
		switch (this.options.initialIndentType) {
			case "space": {
				return this.options.initialIndent;
			}
			case "tab": {
				return this.options.initialIndent * tabSize;
			}
			case "indentUnit": {
				return this.options.initialIndent * this.indentUnit;
			}
			default: {
				throw new Error(`Unknown initialIndentType: ${this.options.initialIndentType}`);
			}
		}
	}
}

/**
 * An extension for CodeMirror to indent wrapped lines  
 * This extension also contains the extension to enable line wrapping
 * 
 * @example
 * const extensions = [
 * 	indentWrappedLines(),
 * ];
 * 
 * @example
 * const options = {
 * 	initialIndent: 4,
 * 	initialIndentType: "indentUnit",
 * };
 * 
 * const extensions = [
 * 	indentWrappedLines(options),
 * ];
 * 
 * @param options Options for the indent wrapped lines extension
 * @returns A CodeMirror extension
 */
export function indentWrappedLines(options?: Partial<IndentWrappedLinesOptions>): Extension {
	const constructedOptions: IndentWrappedLinesOptions = {
		initialIndent: 0,
		initialIndentType: "space",
		...options,
	};

	class IndentWrappedLines extends IndentWrappedLinesPlugin {
		constructor(view: EditorView) {
			super(view, constructedOptions);
		}
	}

	return ViewPlugin.fromClass(IndentWrappedLines, {
		decorations: (pluginClass) => pluginClass.decorations,
		provide: (pluginClass) => [
			pluginClass,
			EditorView.lineWrapping,
		],
	});
}