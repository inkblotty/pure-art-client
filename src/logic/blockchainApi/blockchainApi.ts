import { Atomic, Asset, Canonic, USD } from '../asset'
import { Address, Tx, Utxo } from '../types'

export interface BlockchainApi {
  getFee<T extends Asset>(t: T): Promise<Atomic<T>>
  getPrice<T extends Asset>(t: T): Promise<Canonic<USD>>
  broadcast<T extends Asset>(t:T , tx: Tx<T>): Promise<boolean>
  getUnspentOutputs<T extends Asset>(t: T, address: Address<T>): Promise<Utxo<T>[]>
  getTransactions<T extends Asset> (t: T, address: Address<T>): Promise<Tx<T>[]>
}
