import js from '@eslint/js'
import globals from 'globals'
// import tseslint from 'typescript-eslint'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'

export default [
	js.configs.recommended,
	reactRecommended,
	// tseslint,
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			// suppress errors for missing 'import React' in files
			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
			'no-mixed-spaces-and-tabs': 'off',
		},
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			globals: {
				...globals.serviceworker,
				...globals.browser,
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
]
