
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
    eslint.configs.recommended,
    ...tseslint.configs.stylistic,
    ...tseslint.configs.strict,
    {
        rules: {
            "no-console": "warn"
        }
    }
];