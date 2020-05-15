const {
  bufferToHex,
  ecrecover,
  fromRpcSig,
  keccak256,
  pubToAddress,
  rlp,
} = require('ethereumjs-util')

function checkSignature(nonce, signature) {
  const nonceHash = keccak256(rlp.encode(nonce))
  const {v, r, s} = fromRpcSig(signature)
  const pubKey = ecrecover(nonceHash, v, r, s)
  const addrBuf = pubToAddress(pubKey)
  const addr = bufferToHex(addrBuf)
  return addr
}

module.exports = {checkSignature}
