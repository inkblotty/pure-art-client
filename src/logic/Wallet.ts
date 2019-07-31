import EventEmitter from "events"
import BigNumber from 'bignumber.js'
import { Address, DerivationPath, Utxo } from './types'
import { Asset, AssetDetails, Canonic, canonicalize, cPlus, getAssetDetails, mkAssetDetails, mkAtomic } from './asset'
import * as bip39 from 'bip39'
import * as crypto from "crypto"
import database from './database';
import { BlockchainApi } from './blockchainApi/blockchainApi'
const bitcoin = require('bitcoinjs-lib')

const DefaultEncryptionScheme = 'aes-256-cbc'
const DefaultDBFileName = 'wallets'
type Wif = string
type Xpub = string

interface WalletConstruction<A extends Asset> {
  name: string,
  fountAddress: Address<A>,
  wif: Wif,
  xpub: Xpub,
  asset: A,
  passwordHash: string,
}

export class Wallet2<A extends Asset> extends EventEmitter {
  static readonly  dbStore: any = database
  private readonly name: string
  private readonly fountAddress: Address<A>
  private readonly wif: Wif
  private readonly xpub: Xpub
  private readonly assetDetails: AssetDetails<A>
  private readonly passwordHash: string
  private utxos: Utxo<A>[]
  private readonly asset: A

  constructor(info: WalletConstruction<A>){
    super();
    this.name = info.name;
    this.asset = info.asset
    this.fountAddress = info.fountAddress;
    this.wif = info.wif;
    this.xpub = info.xpub;
    this.assetDetails = mkAssetDetails(info.asset)
    this.passwordHash = info.passwordHash // TODO: hash this. duh.
    this.utxos = []
  }

  getUtxos(): Utxo<A>[] { return this.utxos; }

  getBalance(): Canonic<A> {
    const atomicBalance = this.utxos.reduce((a, c) => cPlus('Atomic', a, c.value), mkAtomic(this.asset, new BigNumber(0)))
    return canonicalize(this.assetDetails, atomicBalance)
  }

  getName(): string { return this.name; }

  getFountAddress(): Address<A> { return this.fountAddress; }

  getWif(): Wif {
    return this.wif;
  }

  getXpub(): Xpub {
    return this.xpub;
  }

  static create<A extends Asset>(asset: A, name: string, mnemonic: string[], password: string): Wallet2<A> {
    const seed = bip39.mnemonicToSeed(mnemonic);
    const details = mkAssetDetails(asset)
    const master = bitcoin.HDNode.fromSeedBuffer(seed, details.bitcoinjsNetwork);
    const xpub = master.neutered().toBase58()
    const derived = master.derivePath(`44'/0'/${details.bip44}'`);
    const addressDerived = derived.getAddress();
    const fountAddress = { address: addressDerived, asset }
    const encryptedWif = Wallet2.encryptWif(derived.keyPair.toWIF(), password)

    return new Wallet2({
      name,
      fountAddress,
      wif: encryptedWif,
      asset,
      xpub,
      passwordHash: password // TODO: hash this boi
    });
  }

  static generate(): string[] {
    return bip39.generateMnemonic();
  }

  static encryptWif(wif: string, password: string): string {
    const cipher = crypto.createCipher(DefaultEncryptionScheme, password);
    return cipher.update(wif, 'utf8', 'hex') + cipher.final('hex');
  }

  static decryptWif(encryptedWif: string, password: string): string {
    const cipher = crypto.createDecipher(DefaultEncryptionScheme, password);
    return cipher.update(encryptedWif, 'hex', 'utf8') + cipher.final('utf8');
  }

  private static get store() {
    return Wallet2.dbStore;
  }

  static async all<A extends Asset>(a: A): Promise<Wallet2<A>[]> {
    return Wallet2.store.find({ asset: a }).then((docs) => {
      return docs.map(doc => new Wallet2(doc));
    });
  }

  async update<A>(bapi: BlockchainApi): Promise<void> {
    return bapi.getUnspentOutputs(this.asset, this.fountAddress).then((result) => {
      this.utxos = result;
      this.emit('updated');
    }, (e) => {
      this.emit('error on utxo acquisition: ' + e.toString())
    });
  }

  async save(): Promise<{}> {
    return Wallet2.store.insert(this.toObject());
  }

  async erase(): Promise<void> {
    Wallet2.store.remove({ xpub: this.xpub });
    this.emit('deleted');
  }

  toObject(): object {
    return {
      name: this.name,
      fountAddress: this.fountAddress,
      wif: this.wif,
      xpub: this.xpub,
      asset: this.asset,
      passwordHash: this.passwordHash
    }
  }
}

type Event = string
const WalletUpdated = 'updated'
const WalletDeleted = 'deleted'
