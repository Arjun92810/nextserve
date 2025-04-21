import { next } from '@eslint-config/next';
import tseslint from 'typescript-eslint';

export default [
    ...next(),
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];