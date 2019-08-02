import { Asset, OfAsset } from './asset'
import { address, payments, Transaction } from 'bitcoinjs-lib'
import { Address, Either, mapEither, Maybe } from './types'
const classify = require('bitcoinjs-lib/src/classify.js')

export interface Tx<T extends Asset> extends OfAsset<T> {
  tx: Transaction
}

function getFromAddresses<A extends Asset> (transaction: Tx<A>): Address<A>[] {
  return mapEither(transaction.tx.ins, input => getFromAddress(input.script), console.warn)
    .map(str => ({address: str, asset: transaction.asset}))
}

enum AddressError { UnsupportedAddressType }

export function getFromAddress (inputScript: Buffer): Either<AddressError, string> {
  switch (classify.input(inputScript)) {
    case "pubkeyhash": {
      return {right: payments.p2pkh({input: inputScript}).address}
    }
    default: {
      return {left: AddressError.UnsupportedAddressType}
    }
  }
}

function getToAddresses<A extends Asset> (transaction: Tx<A>): Address<A>[] {
  return transaction.tx.outs.map(getToAddresses.apply(transaction.asset))
}

function getToAddress<A extends Asset> (a: A, outputScript: Buffer): Address<A> {
  return {address: address.fromOutputScript(outputScript), asset: a}
}

enum StarType { Explosion, Implosion, OneToOne}

export interface StarTx<T extends Asset> extends Tx<T> {
  starType: StarType
}

export interface ExpTx<T extends Asset> extends StarTx<T> {
  starType: StarType.Explosion
}

export interface ImpTx<T extends Asset> extends StarTx<T> {
  starType: StarType.Implosion
}

export interface OneToOneTx<T extends Asset> extends StarTx<T> {
  starType: StarType.OneToOne
}

function asStarTx<T extends Asset> (transaction: Tx<T>): Maybe<StarTx<T>> {
  const sourceCount = getFromAddresses(transaction).length
  const targetCount = getToAddresses(transaction).length

  if (sourceCount === 1 && targetCount === 1) {
    return Object.assign(transaction, {starType: StarType.OneToOne})
  } else if (sourceCount === 1) {
    return Object.assign(transaction, {starType: StarType.Explosion})
  } else if (targetCount === 1) {
    return Object.assign(transaction, {starType: StarType.Implosion})
  } else {
    return 'Nothing'
  }
}
