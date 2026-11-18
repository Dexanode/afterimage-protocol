# Afterimage Protocol

> Your digital legacy, sealed for the right moment.

Afterimage Protocol is a post-quantum digital-legacy capsule for trusted people and autonomous agents. A capsule stores private instructions, context and access policies for named QoreChain recipients. Its content stays encrypted until its configured guardian quorum authorizes release.

## MVP flow

1. A creator composes a capsule for one or more QoreChain addresses.
2. The client encrypts one envelope per recipient using ML-KEM-1024 through QoreSeal.
3. Capsule metadata and the guardian release condition are anchored on QoreChain testnet.
4. Guardians approve using authenticated hybrid signatures.
5. When the quorum is reached, each recipient decrypts only their envelope in their browser.

No application server should receive capsule plaintext or recipient private keys.

## Current prototype

This repository contains the interactive product prototype for the first demo:

- active capsule overview;
- three address-bound guardians;
- 2-of-3 release quorum;
- release-state transition and immutable-style activity trail.
- a QoreX native-lane connection button for `qorechain-diana`; it requests the wallet account only after the user presses it.
- a capsule composer for the title, recipient instruction, fixed guardian set and release quorum. The composer currently creates an in-memory draft; encryption and registry creation follow in the QoreSeal/testnet flow.

The guardian approval button is explicitly a UI simulation. QoreSeal encryption, registered recipient cards, and QoreChain testnet transactions are the next implementation layer.

## On-chain release registry

[`contracts/AfterimageRegistry.sol`](contracts/AfterimageRegistry.sol) is the EVM release registry for the next phase. It records the commitment of an encrypted capsule, the guardian set, the approval quorum and the release event. It deliberately does not accept plaintext, private keys or recipient encryption cards. The intended system boundary is described in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Stack

- React and Vite
- Planned chain packages: `@qorechain/qoreseal`, `@qorechain/sdk`, and QoreX integration packages
- Target network: `qorechain-diana` testnet (EVM chain ID 9800)

## Run locally

```bash
npm install
npm run dev
```

Create a production bundle with:

```bash
npm run build
```
