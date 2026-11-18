# Afterimage Protocol architecture

Afterimage separates confidential data from public release evidence.

```text
Creator browser
  └─ QoreSeal: encrypt capsule to every recipient
       ├─ encrypted envelope → storage layer
       └─ keccak256(envelope) → AfterimageRegistry on QoreChain EVM

Guardian wallet
  └─ approves release → AfterimageRegistry
       └─ quorum event → recipients may fetch and decrypt their envelope locally
```

## Privacy boundary

`AfterimageRegistry` stores only an encrypted-envelope commitment, guardian EVM addresses, a quorum, timestamps and approval state. It never accepts plaintext, ML-KEM private keys, seed phrases, recipient cards or decryption material.

The encrypted envelope is created with QoreSeal and must be bound to `qorechain-diana` and the capsule purpose. Recipients validate the commitment before opening it locally.

## Contract flow

1. The creator encrypts the capsule to every guardian and recipient.
2. The creator computes `keccak256(envelope)` and calls `createCapsule` with it, guardian addresses and a threshold.
3. Each guardian calls `approveRelease` from its own EVM address.
4. The registry emits `CapsuleReleased` at the threshold.
5. A recipient retrieves the envelope from storage, verifies the commitment, and decrypts it on-device.

The contract is written for the QoreChain EVM testnet (chain ID 9800). A deployment, source verification and tests are required before it is used for a submitted live demo.
