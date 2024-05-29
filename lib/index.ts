import { EditorState, Extension, Line, RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView, PluginValue, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { getIndentUnit } from "@codemirror/language";

/**
 * Options for the indent wrapped lines extension
 */
export interface IndentWrappedLinesOptions {
	/**
	 * The initial indent for the wrapped lines
	 * 
	 * This indent is added before calculating the rest of the indent
	 * 
	 * @example
	 * // initialIndent: 4
	 * 
	 * `this line would indent the wrapped lines
	 *     by 4 times the initialIndentType
	 *     and so forth`
	 * 
	 * @default 0
	 */
	initialIndent: number;
	
	/**
	 * Determines the type of indent to use for the initial indent
	 * 
	 * @example
	 * // initialIndentType: "space"
	 * 
	 * `this line would indent the wrapped lines
	 *     by 4 spaces
	 *     and so forth`
	 * 
	 * @default "space"
	 */
	initialIndentType: "space" | "tab" | "indentUnit";
}

interface Spacing {
	amountOfSpacing: number;
	containsTab: boolean;
}

class IndentWrappedLinesPlugin implements PluginValue {
	public decorations!: DecorationSet;
	
	private view: EditorView;
	private indentUnit: number;
	private isChrome: boolean;
	private options: IndentWrappedLinesOptions;
	private initialPadding: string | null = null;

	public constructor(view: EditorView, options: IndentWrappedLinesOptions) {
		this.view = view;
		this.indentUnit = getIndentUnit(view.state);
		this.options = options;
		this.isChrome = /Chrome/.test(navigator.userAgent);

		this.generate(view.state);
	}

	public update(update: ViewUpdate): void {
		const indentUnit = getIndentUnit(update.state);

		if (
			this.indentUnit !== indentUnit ||
			update.docChanged ||
			update.viewportChanged
		) {
			this.indentUnit = indentUnit;

			this.generate(update.state);
		}
	}

	public destroy(): void {
		
	}

	private generate(state: EditorState) {
		const builder = new RangeSetBuilder<Decoration>();

		if (this.initialPadding) {
			this.appendStylesToBuilder(builder, state, this.initialPadding);
		} else {
			const read = (view: EditorView) => {
				const element = view.contentDOM.querySelector(".cm-line");

				if (element) {
					const initPadding = window.getComputedStyle(element).getPropertyValue("padding-left");

					if (initPadding) {
						this.initialPadding = initPadding;
					} else {
						throw new Error("Could not get initial padding value");
					}

					this.appendStylesToBuilder(builder, state, this.initialPadding)
				}
			}

			this.view.requestMeasure({
				read,
			});

			this.decorations = builder.finish();
		}

		this.decorations = builder.finish();
	}

	private appendStylesToBuilder(builder: RangeSetBuilder<Decoration>, state: EditorState, initialPadding: string): void {				
		const lines = this.getVisibleLines(state);

		const initialIndentValue = this.getInitialIndentValue(state.tabSize);

		for (const line of lines) {
			const columnsDetails = this.getNumberOfColumns(line.text, state.tabSize);

			const paddingValue = `calc(${columnsDetails.amountOfSpacing + initialIndentValue}ch + ${initialPadding})`;
			
			let textIndentValue: string;

			if (this.isChrome) {
				textIndentValue = `calc(-${columnsDetails.amountOfSpacing + initialIndentValue}ch - ${Number(columnsDetails.containsTab)}px)`;
			} else {
				textIndentValue = `-${columnsDetails.amountOfSpacing + initialIndentValue}px`;
			}

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

	public getNumberOfColumns(value: string, tabSize: number): Spacing {
		let charSpacing = 0;
		let containsTab = false;
		
		for (let index = 0; index < value.length; index++) {
			if (value[index] === " ") {
				charSpacing++;

				continue;
			} else if (value[index] === "\t") {
				containsTab = true;
				charSpacing += tabSize - (charSpacing % tabSize);

				continue;
			} else if (value[index] === "\r") {
				continue;
			} else {
				break;
			}
		}

		return {
			amountOfSpacing: charSpacing,
			containsTab,
		}
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
	}
	
	class IndentWrappedLines extends IndentWrappedLinesPlugin {
		constructor(view: EditorView) {
			super(view, constructedOptions);
		}
	}
	
	return [
		ViewPlugin.fromClass(IndentWrappedLines, {
			decorations: (view) => view.decorations,
		}),
		EditorView.lineWrapping,
	];
}