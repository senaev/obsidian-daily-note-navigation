import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import obsidianmd from "eslint-plugin-obsidianmd";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.js',
						'manifest.json'
					]
				},
				tsconfigRootDir: import.meta.url,
				extraFileExtensions: ['.json']
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			'eslint-comments': eslintComments,
		},
		rules: {
			'eslint-comments/require-description': ['error', { ignore: [] }],
		},
	},
	{
		files: ['**/*.ts'],
		rules: {
			'@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
		},
	},
	...obsidianmd.configs.recommended,
	globalIgnores([
		"node_modules",
		"dist",
		"esbuild.config.mjs",
		"eslint.config.js",
		"version-bump.mjs",
		"versions.json",
		"main.js",
	]),
);
