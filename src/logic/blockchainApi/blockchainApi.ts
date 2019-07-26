import { Atomic, Asset } from '../asset'
import { Address, Tx, Utxo } from '../types'

export interface BlockchainApi {
  getFee<T extends Asset>(t: T): Atomic<T>
  broadcast<T extends Asset>(t:T , tx: Tx<T>): boolean
  getUtxos<T extends Asset>(t: T, address: Address<T>): Utxo<T>[]
  getTxs<T extends Asset> (t: T, address: Address<T>): Tx<T>[]
}


