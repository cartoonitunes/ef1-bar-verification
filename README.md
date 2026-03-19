# EF1 ABI Test (bar(uint256)) — Bytecode Verification

**Contract:** [`0x441e72c65163612caf1b1c9ffaf67596defee0f9`](https://ethereumhistory.com/contract/0x441e72c65163612caf1b1c9ffaf67596defee0f9)  
**Deployed:** September 20, 2015 (block 261,486)  
**Deployer:** `0x5eD8Cee6b63b1c6AFce3AD7c92f4fD7E1B8fAd9F` (Ethereum Foundation Wallet 1)  
**Compiler:** soljson-v0.1.4+commit.5f6c3cdf (optimizer OFF)  
**Runtime size:** 108 bytes  
**Result:** ✅ Exact runtime bytecode match

Part of the [Awesome Ethereum Proofs](https://github.com/cartoonitunes/awesome-ethereum-proofs) project.

---

## Background

This contract was deployed by the Ethereum Foundation's first wallet (`0x5eD8Cee6b63b1c6AFce3AD7c92f4fD7E1B8fAd9F`) on September 20, 2015 — the same block as two companion `foo()` contracts. Together they represent ABI encoding and function dispatch tests written by Ethereum Foundation developers in the earliest days of Ethereum mainnet.

The contract exposes a single function `bar(uint256 x)` which returns `x + 2`.

## Source Code

```solidity
contract C {
    function bar(uint256 x) returns (uint256 result) {
        result = x + 2;
    }
}
```

This is a minimal Solidity 0.1.x contract — no visibility modifiers, no `view`/`pure`, no explicit return statement. The named return variable `result` is assigned directly. This style is characteristic of very early Solidity (pre-0.2.x).

## Compilation

Compiled using soljson v0.1.4 with the optimizer disabled:

```js
const solc = require('solc');
// solc version: 0.1.4+commit.5f6c3cdf

const source = `contract C {
    function bar(uint256 x) returns (uint256 result) {
        result = x + 2;
    }
}`;

const output = solc.compile(source, 0); // 0 = optimizer OFF
const runtime = output.contracts['C'].runtimeBytecode;
// → matches on-chain runtime bytecode exactly
```

## Verification

Run `node verify.js` to reproduce the compilation and verify the match:

```
$ node verify.js
On-chain runtime:  606060405260e060020a600035046338cc48310...
Compiled runtime:  606060405260e060020a600035046338cc48310...
✅ MATCH (108 bytes)
```

## On-Chain Data

- **Contract address:** `0x441e72c65163612caf1b1c9ffaf67596defee0f9`
- **Block:** 261,486
- **Transaction:** See [Etherscan](https://etherscan.io/address/0x441e72c65163612caf1b1c9ffaf67596defee0f9)
- **EthereumHistory:** [View entry](https://ethereumhistory.com/contract/0x441e72c65163612caf1b1c9ffaf67596defee0f9)

## Why soljson v0.1.4?

The bytecode shows classic v0.1.x dispatch patterns: the `PUSH1 0x60; PUSH1 0x40; MSTORE` memory init sequence and the `PUSH29 0xe060020a600035...` calldata dispatch pattern are characteristic of early soljson emscripten builds. The optimizer-off output matches exactly — optimizer-on produces a different (shorter) bytecode.

## Related

- [EF1 ABI Test (foo())](https://github.com/cartoonitunes/ef1-foo-verification) — companion contract at `0xe30608b5`, same block
- [EF1 ABI Test (foo() v2)](https://github.com/cartoonitunes/ef1-foo2-verification) — companion contract at `0xdf8eb001`, same deployer, same block
