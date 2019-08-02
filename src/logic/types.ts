import { Asset, Atomic, OfAsset } from './asset'

export type Wif = string
export type Xpub = string

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

export type Either<E,A> = { left: E } | { right: A }
export function right<E,A>(e : Either<E,A>): A | undefined {
  return (e as any).right
}
export function left<E,A>(e : Either<E,A>): E | undefined {
  return (e as any).left
}

export function catEithers<E,A>( es: Either<E,A>[], logger: (e: E) => void ): A[] {
  es.filter(left).map(x => logger(left(x)))
  return es.filter(right).map(right);
}

export function mapEither<A, E, B>(as: A[], f: (a:A) => Either<E,B>, logger?: (e: E) => void): B[] {
  return catEithers(as.map(f), logger || (() => {}))
}


export type Maybe<A> = A | 'Nothing'
export function catMaybes<A>(mas : Maybe<A>[]): A[] {
  return mas.filter(v => v !== 'Nothing') as A[]
}
export function mapMaybe<A, B>(as : A[], f : (a: A) => Maybe<B>): B[] {
  return catMaybes(as.map(f))
}
export function fromMaybe<A>(def: A, m : Maybe<A>): A {
  if(m === 'Nothing'){
    return def
  } else {
    return m as A
  }
}
