import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default defineConfig([
	{
		// the plugins' own flat configs - FlatCompat's @eslint/eslintrc needs minimatch's default export, which the minimatch 11 override (a security fix) removed.
		// jsx-runtime is for React 17+'s JSX transform, which doesn't need React in scope
		extends: [js.configs.recommended, react.configs.flat.recommended, react.configs.flat['jsx-runtime'], reactHooks.configs.flat.recommended, tseslint.configs.recommended],

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
			},
		},

		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},

		settings: {
			react: {
				version: '19.2.5', // TODO: update to 'detect' when eslint-plugin-react supports eslint 10
			},
		},

		rules: {
			'react/prop-types': 'off',
			// warnings until each page's findings are fixed (one page per commit), then back to the plugin's errors
			'react-hooks/set-state-in-effect': 'warn',
			'react-hooks/immutability': 'warn',
			'react-hooks/globals': 'warn',
		},
	},
])
