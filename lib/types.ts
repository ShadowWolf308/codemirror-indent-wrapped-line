/**
 * Options for the indent wrapped lines extension
 */
export interface IndentWrappedLinesOptions {
	/**
	 * The initial indent for the wrapped lines  
	 * This indent is added before calculating the rest of the indent
	 * @default 0
	 */
	initialIndent: number;

	/**
	 * Determines the type of indent to use for the initial indent  
	 * This indent is added before calculating the rest of the indent
	 * @default "space"
	 */
	initialIndentType: "space" | "tab" | "indentUnit";
}