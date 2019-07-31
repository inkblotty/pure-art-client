import { OfAsset, Atomic, Asset } from './asset'
import { Transaction } from 'bitcoinjs-lib'

export interface Tx<T extends Asset> extends OfAsset<T> { tx: Transaction }
export interface Address<T extends Asset> extends OfAsset<T> { address: string }
export interface Utxo<T extends Asset> extends OfAsset<T> {
  prevTxId: string,
  prevTxOutputIndex: number,
  value: Atomic<T>
}
export type DerivationPath = number[]
export function toPath(dp : DerivationPath) : string {
  return `m/${dp.join('/')}`
}

console.log(toPath([0,1,2,3]))
