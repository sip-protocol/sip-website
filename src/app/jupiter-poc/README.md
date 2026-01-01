# Jupiter DEX Integration POC

Interactive proof-of-concept demonstrating private swaps using Jupiter aggregator with SIP Protocol privacy primitives.

## Live Demo

Visit: `https://sip-protocol.org/jupiter-poc`

## Features

- **Jupiter Quote Integration** - Real-time quotes from Jupiter V6 API
- **Phantom Wallet Connection** - Native Solana wallet support
- **Privacy Toggle** - Enable/disable privacy layer
- **Stealth Addresses** - Output tokens go to unlinkable addresses
- **Multi-token Support** - SOL, USDC, USDT, BONK

## How It Works

### Standard Jupiter Swap (No Privacy)

```
You (wallet) → Swap 1 SOL → Jupiter → 150 USDC → You (same wallet)
                                                    ↓
                              On-chain: Everyone sees your wallet received USDC
```

### SIP + Jupiter Swap (Private)

```
You (wallet) → Swap 1 SOL → Jupiter → 150 USDC → Stealth Address
                                                    ↓
                              On-chain: Random address received USDC
                              Only you can spend (you have the private key)
```

## Integration Code

### 1. Get Jupiter Quote

```typescript
const params = new URLSearchParams({
  inputMint: 'So11111111111111111111111111111111111111112', // SOL
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  amount: '1000000000', // 1 SOL in lamports
  slippageBps: '50', // 0.5%
})

const quote = await fetch(`https://quote-api.jup.ag/v6/quote?${params}`)
  .then(r => r.json())
```

### 2. Generate Privacy Layer

```typescript
import {
  generateEd25519StealthMetaAddress,
  generateEd25519StealthAddress,
} from '@sip-protocol/sdk'

// Generate stealth meta-address (do once, reuse)
const { metaAddress, viewingPrivateKey } =
  generateEd25519StealthMetaAddress('solana')

// Generate one-time stealth address (do per swap)
const { stealthAddress } = generateEd25519StealthAddress(metaAddress)

// stealthAddress.address is where output tokens will go
```

### 3. Execute Private Swap

```typescript
const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    quoteResponse: quote,
    userPublicKey: walletAddress,
    // KEY: Set output destination to stealth address
    destinationTokenAccount: stealthAddress.address,
  }),
})

const { swapTransaction } = await swapResponse.json()
// Sign and send transaction with wallet
```

### 4. Claim Output (Later)

```typescript
import { scanEd25519StealthAddresses } from '@sip-protocol/sdk'

// Use viewing key to find your stealth addresses
const myAddresses = scanEd25519StealthAddresses({
  viewingPrivateKey,
  spendingPublicKey: metaAddress.spendingKey,
  ephemeralPublicKeys: publishedEphemeralKeys,
})

// Each address can be spent using derived private key
```

## Privacy Comparison

| Aspect | Standard Swap | SIP + Jupiter |
|--------|--------------|---------------|
| Input visibility | Public | Public |
| Output destination | Your wallet | Stealth address |
| Linkability | All swaps linked | Each swap unlinkable |
| Portfolio exposure | Visible | Hidden per address |
| Same liquidity | ✓ | ✓ |
| Same routing | ✓ | ✓ |

## Supported Tokens

| Token | Mint Address |
|-------|--------------|
| SOL | `So11111111111111111111111111111111111111112` |
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` |
| BONK | `DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263` |

## Technical Notes

- **Quote API**: Jupiter V6 Quote API (production)
- **Swap API**: Jupiter V6 Swap API (requires transaction signing)
- **Stealth Curve**: Ed25519 (native to Solana)
- **Privacy Level**: Output privacy (input still visible)

## Limitations

This POC demonstrates the concept. Full implementation requires:

1. **Token Account Creation** - Stealth address needs token account for SPL tokens
2. **Transaction Signing** - Real swaps require wallet signature
3. **Ephemeral Key Publication** - Store ephemeral keys for later claiming
4. **Viewing Key Management** - Secure storage of viewing keys

## Related Resources

- [Jupiter Documentation](https://station.jup.ag/docs)
- [SIP Protocol Docs](https://docs.sip-protocol.org)
- [Stealth Addresses Guide](https://docs.sip-protocol.org/concepts/stealth-addresses)
- [GitHub Repository](https://github.com/sip-protocol/sip-protocol)
