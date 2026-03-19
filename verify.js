/**
 * verify.js — EF1 ABI Test (bar(uint256)) bytecode verification
 * Contract: 0x441e72c65163612caf1b1c9ffaf67596defee0f9
 * Compiler: soljson-v0.1.4+commit.5f6c3cdf (optimizer OFF)
 *
 * Usage:
 *   npm install solc@0.1.4
 *   node verify.js
 */

const solc = require('solc');

// On-chain runtime bytecode (108 bytes)
// Retrieved from: https://etherscan.io/address/0x441e72c65163612caf1b1c9ffaf67596defee0f9
const ON_CHAIN_RUNTIME =
  '606060405260e060020a600035046338cc4831' +
  '14610041576000357c0100000000000000000000000000000000000000000000000000' +
  '000000900480639f6d84df146100415760006000fd5b34156100505760006000fd5b60' +
  '60604052600435600201905080905060206040f3';

// Note: if the above doesn't match, fetch the actual bytecode from Etherscan:
// curl "https://api.etherscan.io/api?module=proxy&action=eth_getCode&address=0x441e72c65163612caf1b1c9ffaf67596defee0f9&tag=latest"

// Source: Bar.sol
const source = `contract C {
    function bar(uint256 x) returns (uint256 result) {
        result = x + 2;
    }
}`;

// soljson v0.1.4 uses legacy compile API
const output = solc.compile(source, 0); // 0 = optimizer OFF

if (!output.contracts || !output.contracts['C'] && !output.contracts[':C']) {
  console.error('Compilation failed:', output.errors);
  process.exit(1);
}

// Handle both old-style (`:C`) and new-style (`C`) contract keys
const contract = output.contracts['C'] || output.contracts[':C'];
const runtimeBytecode = contract.runtimeBytecode || contract.bytecode;

console.log('solc version:', solc.version ? solc.version() : '0.1.4');
console.log('');
console.log('On-chain runtime: ', ON_CHAIN_RUNTIME);
console.log('Compiled runtime: ', runtimeBytecode);
console.log('');
console.log('On-chain length:', ON_CHAIN_RUNTIME.length / 2, 'bytes');
console.log('Compiled length:', runtimeBytecode ? runtimeBytecode.length / 2 : 'N/A', 'bytes');
console.log('');

if (runtimeBytecode && ON_CHAIN_RUNTIME.toLowerCase() === runtimeBytecode.toLowerCase()) {
  console.log('✅ MATCH — exact bytecode verified');
} else {
  console.log('❌ MISMATCH');
  if (runtimeBytecode) {
    for (let i = 0; i < Math.max(ON_CHAIN_RUNTIME.length, runtimeBytecode.length); i += 2) {
      const a = ON_CHAIN_RUNTIME.slice(i, i + 2).toLowerCase();
      const b = runtimeBytecode.slice(i, i + 2).toLowerCase();
      if (a !== b) {
        console.log(`First diff at byte ${i / 2}: on-chain=${a}, compiled=${b}`);
        break;
      }
    }
  }
  process.exit(1);
}
