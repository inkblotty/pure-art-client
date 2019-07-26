import { BlockchainApi } from './blockchainApi'
import { Asset, Atomic, mkAtomic } from '../asset'
import { Address, Tx, Utxo } from '../types'
import BigNumber from 'bignumber.js'

export class Blockcypher implements BlockchainApi {
  private readonly baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  getFee<T extends Asset>(t: T): Atomic<T> {
    return mkAtomic(t, new BigNumber(1000))
  }
  broadcast<T extends Asset>(t:T , tx: Tx<T>): boolean {
    return true
  }
  getUtxos<T extends Asset>(t: T, address: Address<T>): Utxo<T>[] {
    return undefined
  }
  getTxs<T extends Asset> (t: T, address: Address<T>): Tx<T>[] {
    return undefined
  }
}
