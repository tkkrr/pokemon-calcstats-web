module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    settings: {
        react: {
        version: "detect"
        }
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
        "prettier"
    ],
    parser: '@typescript-eslint/parser',
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'react',
        'react-hooks',
        '@typescript-eslint',
    ],
    rules: {
        'react/react-in-jsx-scope': 'off',
        // 早期リターンによる可読性向上のために、いったんwarningに下げる
        "react-hooks/rules-of-hooks": "warn",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { // "_"から始まる変数は未使用でも許可する
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_",
                "destructuredArrayIgnorePattern": "^_"
            }
        ]
    }
}
