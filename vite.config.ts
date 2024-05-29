import { defineConfig } from "vite";

export default defineConfig((env) => ({
	publicDir: env.command === "serve" ? "public" : undefined,
	build: {
		lib: {
			entry: "./lib/index.ts",
			name: "IndentWrappedLines",
			fileName: "indentWrappedLines",
		},
		rollupOptions: {
			external: [
				"@codemirror/language",
				"@codemirror/state",
				"@codemirror/view",
			],
			output: {
				globals: {
					'@codemirror/language': 'codemirrorLanguage',
					'@codemirror/state': 'codemirrorState',
					'@codemirror/view': 'codemirrorView',
				},
			},
		},
	},
}));