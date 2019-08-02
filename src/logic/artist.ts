import { Asset } from './asset'
import { Wallet2 } from './Wallet'
import { BlockchainApi } from './blockchainApi/blockchainApi'
import { BlockchainPainting, Painting } from './painting'

export class Artist<A extends Asset> {
  constructor(private readonly wallet: Wallet2<A>, private readonly blockchainApi: BlockchainApi){}

  async print( p : Painting ): Promise<BlockchainPainting> {

  }
}
