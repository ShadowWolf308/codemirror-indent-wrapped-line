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