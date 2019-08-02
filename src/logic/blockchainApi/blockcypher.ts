import { BlockchainApi } from './blockchainApi'
import { Asset, assets, Atomic, Canonic, mkAtomic, mkCanonic, USD } from '../asset'
import { Address, Utxo } from '../types'
import BigNumber from 'bignumber.js'
import { Tx } from '../transaction'

export class Blockcypher implements BlockchainApi {
  private readonly baseUrl: string
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getFee<T extends Asset>(t: T): Promise<Atomic<T>> {
    return mkAtomic(t, new BigNumber(1000))
  }
  async getPrice<T extends Asset>(t: T): Promise<Canonic<USD>> {
    return mkCanonic('USD', new BigNumber(10))
  }
  async broadcast<T extends Asset>(t:T , tx: Tx<T>): Promise<boolean> {
    return true
  }
  async getUnspentOutputs<T extends Asset>(t: T, address: Address<T>): Promise<Utxo<T>[]> {
    return []
  }
  async getTransactions<T extends Asset> (t: T, address: Address<T>): Promise<Tx<T>[]> {
    return []
  }
}

export const blockcypher = new Blockcypher("")
