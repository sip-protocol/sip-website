# Phantom Wallet Integration POC

Interactive proof-of-concept demonstrating SIP Protocol stealth address generation with Phantom wallet on Solana.

## Live Demo

Visit: `https://sip-protocol.org/phantom-poc`

## Features

- **Phantom Wallet Connection** - Connect via `@sip-protocol/sdk` Solana adapter
- **Stealth Meta-Address Generation** - Create Ed25519 spending + viewing keypair
- **One-Time Stealth Address Derivation** - Generate unlinkable receiving addresses
- **Copy-to-Clipboard** - Easy sharing of addresses and keys
- **Educational UI** - Step-by-step flow with explanations

## How It Works

### 1. Connect Phantom

```typescript
import { createSolanaAdapter } from '@sip-protocol/sdk'

const adapter = createSolanaAdapter({
  wallet: 'phantom',
  cluster: 'devnet',
})
await adapter.connect()
console.log('Connected:', adapter.address)
```

### 2. Generate Stealth Meta-Address

The recipient generates their meta-address once and shares it publicly:

```typescript
import { generateEd25519StealthMetaAddress } from '@sip-protocol/sdk'

const { metaAddress, spendingPrivateKey, viewingPrivateKey } =
  generateEd25519StealthMetaAddress('solana')

// metaAddress contains:
// - spendingKey: public key for deriving addresses
// - viewingKey: public key for scanning payments
// - chain: 'solana'

// Share metaAddress with senders
// Keep private keys secure!
```

### 3. Generate One-Time Stealth Address

The sender derives a unique address for each payment:

```typescript
import { generateEd25519StealthAddress } from '@sip-protocol/sdk'

const { stealthAddress } = generateEd25519StealthAddress(recipientMetaAddress)

// stealthAddress contains:
// - address: the one-time receiving address
// - ephemeralPublicKey: publish this so recipient can find payment

// Send funds to stealthAddress.address
```

### 4. Recipient Scans for Payments

The recipient uses their viewing key to scan for incoming payments:

```typescript
import { scanEd25519StealthAddresses } from '@sip-protocol/sdk'

const payments = scanEd25519StealthAddresses({
  viewingPrivateKey,
  spendingPublicKey: metaAddress.spendingKey,
  ephemeralPublicKeys: publishedEphemeralKeys,
})

// payments[].stealthAddress contains addresses the recipient can spend from
```

## Privacy Guarantees

| Property | Without Stealth | With Stealth |
|----------|-----------------|--------------|
| Address Linkability | All payments visible | Each payment unique |
| Transaction Graph | Public | Unlinkable |
| Balance Visibility | Public | Hidden per address |
| Spending Authority | Single key | Derived per payment |

## Technical Details

- **Curve**: Ed25519 (native to Solana)
- **Algorithm**: DKSAP (Dual-Key Stealth Address Protocol) adapted for EdDSA
- **Standard**: Based on EIP-5564 concepts, adapted for non-EVM chains

## Video Walkthrough

To record a walkthrough:

1. Open `https://sip-protocol.org/phantom-poc`
2. Start screen recording (QuickTime, Loom, etc.)
3. Demonstrate the 3-step flow:
   - Connect Phantom (show wallet popup)
   - Generate meta-address (show keys)
   - Generate stealth address (show one-time address)
4. Highlight the privacy comparison at the end
5. Show the integration code section

## Related Resources

- [SDK Documentation](https://docs.sip-protocol.org)
- [Stealth Address Concepts](https://docs.sip-protocol.org/concepts/stealth-addresses)
- [GitHub Repository](https://github.com/sip-protocol/sip-protocol)
- [npm Package](https://www.npmjs.com/package/@sip-protocol/sdk)
