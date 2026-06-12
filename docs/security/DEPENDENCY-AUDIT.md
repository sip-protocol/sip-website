# Dependency Security Audit

**Repo:** sip-protocol/sip-website
**Date:** 2026-06-12
**Scope:** 30 open Dependabot alerts in `pnpm-lock.yaml`
**Outcome:** 28 fixed via `pnpm.overrides` + 1 devDependency pin · 2 recommended for dismissal (`not_used`) with evidence below

---

## Method

1. Baseline: `pnpm install --frozen-lockfile` + `pnpm typecheck` + `pnpm test -- --run` (157/157) + `pnpm build` — all green before changes.
2. Per package: `pnpm why <pkg>` consumer map → same-major bumps applied via scoped `pnpm.overrides` (always capped to the affected major); cross-major cases triaged by reading the advisory's vulnerable function and checking every consumer's call sites in `node_modules`.
3. After changes: identical suite re-run from a clean `node_modules` with `--frozen-lockfile` — typecheck clean, 157/157 tests, production build exit 0.

## Fixed (28 alerts)

| Alert(s) | Package | Severity (worst) | Before | After | Mechanism |
|----------|---------|------------------|--------|-------|-----------|
| #51, #66–72, #89 | protobufjs | **critical** (#51, GHSA-xq3m-2v4x-88gg) | 7.4.0 / 7.5.4 / 7.5.5 | 7.6.3 | `protobufjs@7: >=7.5.8 <8` |
| #65 | @protobufjs/utf8 | medium | 1.1.0 | 1.1.1 | `@protobufjs/utf8@1: >=1.1.1 <2` |
| #101, #102 | @grpc/grpc-js | high | 1.14.3 | 1.14.4 | `@grpc/grpc-js@1: >=1.14.4 <2` — runtime path is real (`/api/zcash` lazy-imports `@triton-one/yellowstone-grpc`) |
| #44, #49, #75 | langsmith | high (#75, GHSA-3644-q5cj-c5c7) | 0.3.87 + 0.5.10 | 0.6.3 | `langsmith: >=0.6.0 <0.7.0` — see compat note below |
| #39, #40, #41 | vite | high | 7.3.1 | 7.3.5 | devDependency pin `vite: ^7.3.2` + `vite: >=7.3.2 <8` override (vite is an *optional peer* of vitest 4; pnpm does not re-resolve an auto-installed peer on an override change, so the project supplies the peer directly — the supported vitest 4 pattern) |
| #23 | bn.js (4.x) | medium | 4.12.2 | 4.12.3 | `bn.js@4: >=4.12.3 <5` |
| #22 | bn.js (5.x) | medium | 5.2.1 / 5.2.2 | 5.2.3 | `bn.js@5: >=5.2.3 <6` — per-major selectors, both majors preserved |
| #8 | base-x | high (GHSA-xq7p-g2vc-g82p, homograph) | 2.0.6 | *(eliminated)* | `bs58@4: >=4.0.1 <5` — sole consumer of base-x 2.x was `bs58@4.0.0` (pinned exactly by `@near-js/utils@0.2.2`); bs58 4.0.1 is upstream's own patch swapping base-x ^2 → ^3 (resolves patched 3.0.11, already in tree). `@near-js/utils` wraps `bs58.decode` in `new Uint8Array(...)` and base-x 3 `encode` accepts Array/Uint8Array/Buffer — verified drop-in |
| #7 | bigint-buffer | high (GHSA-3gc7-fjrx-p6mg, no upstream patch) | 1.1.5 | bigint-buffer-fixed 1.1.6 | alias override `bigint-buffer: npm:bigint-buffer-fixed@^1.1.6` (bounds-checked fork). Verified from the consumer context (`@solana/buffer-layout-utils`): resolves to the fork, `toBufferLE`/`toBigIntLE`/`toBufferBE`/`toBigIntBE` roundtrips OK, consumer lib loads |
| #54 | uuid (13.x) | medium | 13.0.0 | 13.0.2 | `uuid@13: >=13.0.1 <14` |
| — (part of #87) | uuid (11.x) | medium | 11.1.0 | 11.1.1 | `uuid@11: >=11.1.1 <12` (defense-in-depth; see #87 below) |
| #30 | minimatch | high | 3.1.2 | 3.1.5 | `minimatch@3: >=3.1.3 <4` |
| #33 | flatted | high | 3.3.3 | 3.4.2 | `flatted@3: >=3.4.2 <4` |
| #55 | ip-address | medium | 10.1.0 | 10.2.0 | `ip-address@10: >=10.1.1 <11` |
| #88 | postcss | medium | 8.4.31 (pinned by next@15) | 8.5.15 (deduped to direct devDep) | `postcss@8: >=8.5.10 <9` |
| #92 | ws | medium (8.x only) | 8.19.0 | 8.21.0 | `ws@8: >=8.20.1 <9` — ws 7.5.10 (jayson) intentionally preserved; the advisory range is `>=8.0.0 <8.20.1` and 7.x is not affected |

### langsmith 0.3.87/0.5.10 → 0.6.3 compat note

`langchain@1.2.32` declares `langsmith: >=0.5.0 <1.0.0` (0.6.x natively in range). `@langchain/core@0.3.80` declares `^0.3.67`, so the override forces it — verified safe:

- Every symbol `@langchain/core` imports from langsmith was checked against langsmith 0.6.3 in isolation: `Client`, `getDefaultProjectName`, `RunTree` (root), `RunTree`, `isRunTree`, `convertToDottedOrderFormat` (`langsmith/run_trees`), `getCurrentRunTree`, `isTraceableFunction` (`langsmith/singletons/traceable`), plus the `langsmith/schemas` subpath — **all present**.
- `@sip-protocol/sdk@0.9.0` eagerly requires `@langchain/core/*` at module load, so typecheck/tests/build exercise this graph — all green.
- LangSmith tracing is inert without `LANGSMITH_API_KEY` (not set anywhere in this deployment), and the #75 vulnerable functions (`pullPrompt`/`pullPromptCommit`) are never called.
- The `unmet peer @langchain/core@^1.1.16: found 0.3.80` install warning is **pre-existing on main** (`@langchain/langgraph-sdk@1.7.2` paired with core 0.3.80 in the old lockfile too); it only prints when a full resolution runs.

---

## Recommended dismissals (2 alerts) — `not_used`

### Alert #87 — uuid < 11.1.1 (GHSA-w5hq-g745-h8pq, medium)

**Vulnerable surface:** only the `v3()`, `v5()`, `v6()` API methods, and only when the caller passes an external output buffer (`buf`/`offset`). `v1()`/`v4()`/`v7()` already throw `RangeError` on bad bounds.

Remaining in-range copies after this PR and their complete call-site evidence:

| Copy | Consumer chain | uuid API used | Evidence |
|------|----------------|---------------|----------|
| uuid@8.3.2 | `jayson@4.2.0` ← @solana/web3.js (runtime) | `require('uuid').v4` — no buf | `jayson/lib/generateRequest.js` |
| uuid@8.3.2 | `rpc-websockets@9.3.2` ← @solana/web3.js (runtime) | `v1()` — not a vulnerable method | grep of `rpc-websockets/dist` |
| uuid@9.0.1 | `@ledgerhq/client-ids@0.10.0` ← @ledgerhq/hw-app-eth (**devDependency**) | `uuid_1.v4` — no buf | grep of package `lib*/` |
| uuid@10.0.0 | `@langchain/core@0.3.80` ← @sip-protocol/sdk (runtime) | `v4()` only | grep of `dist/**/*.js` |

No consumer calls `v3`/`v5`/`v6` at all, let alone with a caller-provided buffer. In-major patches do not exist for 8.x/9.x/10.x (first patched in that range is 11.1.1); forcing cross-major would gamble on ESM/CJS packaging changes for zero reachable risk. The 11.x copy in range was bumped to 11.1.1. Precedent: sip-protocol core dismissed the same advisory (`not_used`) after identical call-path analysis.

### Alert #12 — elliptic <= 6.6.1 (GHSA-848j-6mx2-7j84, low, **no patch exists**)

**Vulnerable surface:** the advisory covers elliptic's *risky ECDSA implementation* — the exploitable path is private-key **signing** with attacker-influenced inputs.

Consumers of elliptic@6.6.1 and why none reach a signing path in this app:

| Consumer | Chain | Analysis |
|----------|-------|----------|
| @phala/dcap-qvl@0.3.9 | ← @magicblock-labs/ephemeral-rollups-sdk ← @sip-protocol/sdk (runtime) | SGX/TDX quote **verification only** — never signs |
| secp256k1@5.0.1 | ← @near-js/crypto ← NEAR wallet-selector packages (runtime) | elliptic is the JS fallback inside the secp256k1 package; this site holds no user keys — wallet-selector delegates all signing to external wallets (NEAR default keys are ed25519 besides) |
| @ethersproject/signing-key@5.8.0 | ← @ledgerhq/hw-app-eth (**devDependency**) | Ledger signs on-device; dev-only dependency, not in the production bundle |
| browserify-sign, create-ecdh, tiny-secp256k1 | ← crypto-browserify / @trezor/utxo-lib ← @trezor/connect-web (**devDependency**) | Trezor signs on-device; dev-only |

`src/` imports neither elliptic nor any wrapper that signs with it — the SDK demo pages (`sdk-playground`, `technical-deep-dive`, `use-swap`) use `@sip-protocol/sdk`'s @noble/curves paths with throwaway demo keys. No patched release exists to upgrade to. Precedent: sip-protocol core dismissed this exact advisory (`not_used`) after the same signing-path analysis.

---

## Re-audit triggers

- `@sip-protocol/sdk` major/minor bump (changes the langchain/solana subtree — re-check uuid/elliptic consumer maps)
- Any new direct dependency that signs with secp256k1 in-app
- uuid 8.x/9.x/10.x consumers (`jayson`, `rpc-websockets`, `@ledgerhq/client-ids`, `@langchain/core`) changing their uuid API usage
- bigint-buffer-fixed falling behind upstream bigint-buffer (fork watch)
