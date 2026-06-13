// Empty browser stub for the SDK's Node-only dependencies (see next.config.js
// `turbopack.resolveAlias`).
//
// @sip-protocol/sdk pulls @triton-one/yellowstone-grpc (server-side Zcash RPC, via @grpc/grpc-js)
// and an optional file-based cache (fs/promises) into its main entry. Both are Node-only and never
// run in the browser, but client components import the SDK, so their graphs get bundled for the
// browser too. Turbopack (unlike webpack's `resolve.fallback`) errors on the Node builtins they
// reach for, so we alias the whole grpc package and `fs/promises` to this empty module for the
// browser context only. The server keeps the real modules (serverExternalPackages + native builtins).
module.exports = {}
