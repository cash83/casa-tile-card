// Il controllo automatico del codice. Non impone uno stile: cerca solo gli
// SBAGLI veri - una variabile che non esiste, una chiave scritta due volte,
// un pezzo di codice che non viene mai eseguito, un `if` sempre vero.
//
// Le regole stanno scritte una per una invece di prendere `@eslint/js`, che
// in questo progetto non e' installato (c'e' solo il motore).
//   npx eslint src strumenti

export default [
  {
    files: ["src/**/*.js", "strumenti/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        window: "readonly", document: "readonly", customElements: "readonly",
        HTMLElement: "readonly", CustomEvent: "readonly", Event: "readonly",
        setTimeout: "readonly", clearTimeout: "readonly",
        setInterval: "readonly", clearInterval: "readonly",
        requestAnimationFrame: "readonly", cancelAnimationFrame: "readonly",
        fetch: "readonly", console: "readonly", navigator: "readonly",
        getComputedStyle: "readonly", Image: "readonly", Blob: "readonly",
        URL: "readonly", FileReader: "readonly", ResizeObserver: "readonly",
        IntersectionObserver: "readonly", MutationObserver: "readonly",
        localStorage: "readonly", location: "readonly", screen: "readonly",
        matchMedia: "readonly", DOMParser: "readonly", Node: "readonly",
        performance: "readonly", structuredClone: "readonly",
        process: "readonly", globalThis: "readonly", alert: "readonly",
        confirm: "readonly", Intl: "readonly", TextEncoder: "readonly",
        FormData: "readonly", File: "readonly", AbortController: "readonly",
      },
    },
    rules: {
      // -- roba che NON esiste o non si raggiunge
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": ["error", {
        args: "none", caughtErrors: "none", varsIgnorePattern: "^_",
      }],
      "no-unused-private-class-members": "error",
      // -- roba scritta DUE volte
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-case": "error",
      "no-duplicate-imports": "error",
      "no-redeclare": "error",
      "no-import-assign": "error",
      // -- condizioni sbagliate, confronti che non possono funzionare
      "no-constant-condition": "error",
      "no-constant-binary-expression": "error",
      "no-self-assign": "error",
      "no-self-compare": "error",
      "no-cond-assign": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      "no-unsafe-negation": "error",
      "no-unsafe-optional-chaining": "error",
      "no-compare-neg-zero": "error",
      // -- trappole note
      "no-fallthrough": "error",
      "no-func-assign": "error",
      "no-sparse-arrays": "error",
      "no-irregular-whitespace": "error",
      "no-loss-of-precision": "error",
      "no-prototype-builtins": "error",
      "no-case-declarations": "error",
      "no-async-promise-executor": "error",
      "no-setter-return": "error",
      "no-useless-escape": "error",
      "no-control-regex": "off",
      "require-yield": "error",
      // le catture vuote sono una scelta di questo progetto: "pazienza"
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-extra-boolean-cast": "error",
      "no-useless-backreference": "error",
    },
  },
];
