import BigNumber from 'bignumber.js'
const coininfo = require('coininfo')
export type Asset = 'BTC' | 'BTC-T' | 'DOGE' | 'LTC'
export type USD = 'USD'
export interface OfAsset<A extends Asset | USD> { asset: A }
export interface AssetDetails<T extends Asset> extends OfAsset<T> {
  decimals: 8,
  pubKeyHash: number,
  scriptHash: number,
  bip44: number,
  bitcoinjsNetwork: any
}
const Bitcoin: AssetDetails<'BTC'> = {
  decimals: 8,
  asset: 'BTC',
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  bip44: 0,
  bitcoinjsNetwork: coininfo.bitcoin.main.toBitcoinJS()
}
const BitcoinTestnet : AssetDetails<'BTC-T'> = {
  decimals: 8,
  asset: 'BTC-T',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  bip44: 0,
  bitcoinjsNetwork: coininfo.bitcoin.test.toBitcoinJS()
}
const Dogecoin : AssetDetails<'DOGE'> = {
  decimals: 8,
  asset: 'DOGE',
  pubKeyHash: 0x1E,
  scriptHash: 0x16,
  bip44: 30, //TODO: what is this really?
  bitcoinjsNetwork: coininfo.dogecoin.main.toBitcoinJS()
}
const Litecoin : AssetDetails<'LTC'> = {
  decimals: 8,
  asset: 'LTC',
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  bip44: 5, //TODO: what is this really?
  bitcoinjsNetwork: coininfo.litecoin.main.toBitcoinJS()
}
export function mkAssetDetails<A extends Asset>(a: A): AssetDetails<A> {
  return getAssetDetails(a) as AssetDetails<A>
}
export function getAssetDetails(a: Asset): AssetDetails<Asset>{
  switch(a){
    case 'BTC': return Bitcoin
    case 'LTC': return Litecoin
    case 'DOGE': return Dogecoin
    case 'BTC-T': return BitcoinTestnet
  }
}
type Unit = 'Canonic' | 'Atomic'
export interface CryptoVal<A extends Asset | USD, U extends Unit> extends OfAsset<A> { val: BigNumber, unit: U }

export function cPlus<A extends Asset | USD, U extends Unit, S extends CryptoVal<A, U>>( u: U, c1: S, c2: S): S {
  return Object.assign(c1, {val: c1.val.plus(c2.val), unit: u})
}

export interface Atomic<A extends Asset > extends CryptoVal<A, 'Atomic'> {val: BigNumber, unit: 'Atomic'}
export function mkAtomic<A extends Asset> (a: A, val: BigNumber): Atomic<A> {
  return { asset: a, unit: 'Atomic', val }
}
export interface Canonic<A extends (Asset | USD) > extends CryptoVal<A, 'Canonic'> {val: BigNumber, unit: 'Canonic' }
export function mkCanonic<A extends (Asset | USD) >(a: A, val: BigNumber): Canonic<A> {
  return { asset: a, unit: 'Canonic', val }
}
export function atomize<A extends Asset >(a : AssetDetails<A>, c : Canonic<A>): Atomic<A> {
  const decimals = a.decimals
  return mkAtomic(a.asset, c.val.times(decimals))
}
export function canonicalize<A extends Asset >(a : AssetDetails<A>, c : Atomic<A>): Canonic<A> {
  const decimals = a.decimals
  return mkCanonic(a.asset, c.val.dividedBy(decimals))
}
