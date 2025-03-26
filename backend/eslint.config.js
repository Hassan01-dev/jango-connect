import globals from 'globals'
import unusedImports from 'eslint-plugin-unused-imports'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    // Ignore patterns
    ignores: ['dist', 'node_modules', '**/*.js', '**/*.d.ts', 'node_modules/.tmp'],
    
    // Language options
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      },
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest'
      }
    },
    
    // Plugins
    plugins: {
      'unused-imports': unusedImports,
      prettier,
      '@typescript-eslint': tsPlugin
    },
    
    // Rules
    rules: {
      // Unused imports and vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'after-used', ignoreRestSiblings: true }
      ],
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { 
        vars: 'all', 
        args: 'after-used', 
        ignoreRestSiblings: true 
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Formatting and style
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-mixed-spaces-and-tabs': 'error',
      'no-trailing-spaces': 'error',
      'space-before-blocks': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'comma-spacing': ['error', { before: false, after: true }],
      quotes: ['error', 'double'],
      'eol-last': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      
      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          useTabs: false,
          trailingComma: 'none'
        }
      ]
    },
    
    // File extensions to lint
    files: ['**/*.ts', '**/*.tsx']
  },
  {
    rules: eslintConfigPrettier.rules
  }
]