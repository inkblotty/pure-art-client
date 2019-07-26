import BigNumber from 'bignumber.js'

export type Asset = 'BTC' | 'BTC-T' | 'DOGE' | 'LTC'
export interface OfAsset<A extends Asset> { asset: A }
export interface AssetDetails<T extends Asset> extends OfAsset<T> {
  decimals: 8,
  pubKeyHash: number,
  scriptHash: number,
}
const Bitcoin: AssetDetails<'BTC'> = {
  decimals: 8,
  asset: 'BTC',
  pubKeyHash: 0x00,
  scriptHash: 0x05
}
const BitcoinTestnet : AssetDetails<'BTC-T'> = {
  decimals: 8,
  asset: 'BTC-T',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4
}
const Dogecoin : AssetDetails<'DOGE'> = {
  decimals: 8,
  asset: 'DOGE',
  pubKeyHash: 0x1E,
  scriptHash: 0x16
}
const Litecoin : AssetDetails<'LTC'> = {
  decimals: 8,
  asset: 'LTC',
  pubKeyHash: 0x30,
  scriptHash: 0x32
}
export function getAssetDetails(a: Asset): AssetDetails<Asset>{
  switch(a){
    case 'BTC': return Bitcoin
    case 'LTC': return Litecoin
    case 'DOGE': return Dogecoin
    case 'BTC-T': return BitcoinTestnet
  }
}

export interface Atomic<A extends Asset> extends OfAsset<A> {val: BigNumber, unit: 'Atomic'}
export function mkAtomic<A extends Asset>(a: A, val: BigNumber): Atomic<A> {
  return { asset: a, unit: 'Atomic', val }
}
export interface Canonic<A extends Asset> extends OfAsset<A> {val: BigNumber, unit: 'Canonic' }
export function mkCanonic<A extends Asset>(a: A, val: BigNumber): Canonic<A> {
  return { asset: a, unit: 'Canonic', val }
}
export function atomize<A extends Asset>(a : AssetDetails<A>, c : Canonic<A>): Atomic<A> {
  const decimals = a.decimals
  return mkAtomic(a.asset, c.val.times(decimals))
}
export function canonicalize<A extends Asset>(a : AssetDetails<A>, c : Atomic<A>): Canonic<A> {
  const decimals = a.decimals
  return mkCanonic(a.asset, c.val.dividedBy(decimals))
}
