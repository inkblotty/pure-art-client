import { Atomic, Asset, Canonic, USD } from '../asset'
import { Address, Utxo } from '../types'
import { Coordinate } from '../painting'
import { Tx } from '../transaction'

export interface BlockchainApi {
  getFee<T extends Asset>(t: T): Promise<Atomic<T>>
  getPrice<T extends Asset>(t: T): Promise<Canonic<USD>>
  broadcast<T extends Asset>(t:T , tx: Tx<T>): Promise<boolean>
  getUnspentOutputs<T extends Asset>(t: T, address: Address<T>): Promise<Utxo<T>[]>
  getTransactions<T extends Asset> (t: T, address: Address<T>): Promise<Tx<T>[]>
  getAddresses<T extends Asset>(t: T, xpub: Xpub, coordinates: Coordinate[]): Promise<Address<T>[]>
}
