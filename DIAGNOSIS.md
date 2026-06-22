# DIAGNOSIS

This file documents failures reproduced locally (I cannot access GitHub Actions logs from this environment). Each entry lists the step name, the exact log output quoted, and a brief explanation of the root cause.

1. Step: Running `npx jest` without installed deps (interactive npx prompt)

Exact log line(s) quoted:

```
Need to install the following packages:
jest@30.4.2
Ok to proceed? (y)
```

Explanation:
npx attempted to fetch `jest` from the registry because it's not installed in `node_modules`. This produces an interactive prompt asking to confirm installation which will block non-interactive CI runs. Root cause: tests were run without installing dependencies first (no `node_modules`), and relying on `npx` to fetch packages can prompt and break automation.

2. Step: `npm ci` (clean install) failed locally due to lockfile mismatch

Exact log line(s) quoted:

```
npm error Missing: lodash@4.18.1 from lock file
```

Explanation:
`npm ci` enforces that `package-lock.json` and `package.json` are in sync. The lockfile referenced `lodash@4.18.1` while `package.json` listed a different version (`^4.17.21`). This mismatch caused `npm ci` to fail. Root cause: the lockfile was out of sync with `package.json` (or the lockfile contains entries that the current `package.json` no longer declares).

3. Step: Unit test assertion failure in `src/utils/formatCurrency.test.js`

Exact log line(s) quoted:

```
expect(received).toBe(expected) // Object.is equality

If it should pass with deep equality, replace "toBe" with "toStrictEqual"

Expected: {"amount": 10.01, "currency": "USD"}
Received: serializes to the same string

at Object.toBe (src/utils/formatCurrency.test.js:5:41)
```

Explanation:
The test used `toBe` to compare two objects, which checks identity (Object.is). Two distinct object literals will never be the same reference, so the assertion fails even though the objects have the same content. The correct matcher is `toEqual` (or `toStrictEqual`) for deep equality. Root cause: incorrect Jest matcher in the test.

Notes / Next steps performed here:

- Updated `src/payments/calculateDiscount.test.js` to assert the correct value for a 10% discount (was asserting 100, fixed to 90).
- Updated `src/utils/formatCurrency.test.js` to use `toEqual` instead of `toBe` for object comparison.
- Ran `npm install` locally to regenerate `package-lock.json` and then ran the full test suite successfully.
- Updated `.github/workflows/ci.yml` to use `npm ci` for reproducible installs, added `needs: install` for proper sequencing, and ensured the `test` job performs `checkout`/`setup-node` and its own `npm ci` because each job runs on a fresh runner.

If you want, I can now push these changes and (if you provide a repo token or run the push) open the GitHub Actions run to verify CI. From this environment I cannot open the remote Actions UI.
