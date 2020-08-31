import {
  bufferToHex,
  ecrecover,
  fromRpcSig,
  keccak256,
  pubToAddress,
} from 'ethereumjs-util'

export function checkSignature(nonce, signature) {
  const nonceHash = keccak256(keccak256(Buffer.from(nonce, 'utf-8')))
  const {v, r, s} = fromRpcSig(signature)
  const pubKey = ecrecover(nonceHash, v, r, s)
  const addrBuf = pubToAddress(pubKey)
  const addr = bufferToHex(addrBuf)
  return addr
}
