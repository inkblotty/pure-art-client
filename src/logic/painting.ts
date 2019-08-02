import BigNumber from 'bignumber.js'
import { Address} from './types'
import { Asset } from './asset'
import { ExpTx, ImpTx, OneToOneTx, StarTx, Tx } from './transaction'

export type Plane = { xSize: BigNumber, ySize: BigNumber }
export type Coordinate = { x: BigNumber, y: BigNumber }
export type Edge = [Coordinate, Coordinate]


const zero : BigNumber = new BigNumber(0)
const one : BigNumber = new BigNumber(1)

function coordinateInPlane(c: Coordinate, p: Plane): boolean {
  const xInRange = zero.isLessThanOrEqualTo(c.x) && c.x.isLessThanOrEqualTo(p.xSize.minus(one))
  const yInRange = zero.isLessThanOrEqualTo(c.y) && c.y.isLessThanOrEqualTo(p.ySize.minus(one))
  return xInRange && yInRange
}

export class BlockchainPainting<A extends Asset> {
  constructor(
    private readonly painting: Painting,
    private readonly fountAddress: Address<A>,
    private readonly internalPaintTxs: StarTx<A>[],
    private readonly createTx: ExpTx<A> | OneToOneTx<A>,
    private readonly ownTx: ImpTx<A> | OneToOneTx<A>
  ){}
}

export class Painting {
  readonly plane: Plane
  readonly edges: Edge[]
  constructor(plane: Plane, edges: Edge[]){
    if (!edges.every( e => e.every( c => coordinateInPlane(c, plane) ))){
      throw new Error('Not all edges fit on this plane ' + plane)
    }
    this.plane = plane
    this.edges = edges
  }

  coordinates(): Coordinate[] {
    return this.edges.reduce( (acc, edge) => acc.concat(edge), [] as Coordinate[])
  }

  toRender(){

  }
}
