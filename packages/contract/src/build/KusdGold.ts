// SPDX-License-Identifier: MIT

import { System, Storage, Base58, authority } from "@koinos/sdk-as";
import { Token, IToken, token } from "@koinosbox/contracts";
import { empty } from "./proto/empty";
import { ExternalContract as Extc } from "./ExternalContract";
import { multiplyAndDivide } from "@koinosbox/contracts/assembly/vapor/utils";

const VAULTS_SPACE_ID = 8;

// kusd contract address: 166BxNmWGuZHYAVHCeh6D8i7XF5qX21kGT

// testnet koin
const koinContract = new IToken(Base58.decode("1EdLyQ67LW6HVU1dWoceP4firtyz77e37Y"));

// tesnet KoinDX pool contract placeholder
const koinUsdt = new Extc(Base58.decode("1JNfiwk1QT4Ao4bu1YrTD7rEiQoTPXKnZ6"));

// testnet KAP USD oracle (MEXC price) placeholder
const KAPusd = new Extc(Base58.decode("13PXvxWLMyi4dAd6uS1SehNNFryvFyygnD"));

/* 
// MAINNET CONTRACTS
const koinContract = new IToken(Base58.decode("15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL"));

// KoinDX contract
const koinUsdt = new Etc(Base58.decode("1M9VoAHN3MdvwHnUotgk8GBVjCnXYepWbk"));

// KAP USD oracle (MEXC price)
const KAPusd = new Extc(Base58.decode("1D53GFQkL5TkQ9okuf6r3Gta3oeTMVgGJW"));
 */

export class KusdGold extends Token {
  _name: string = "kusd.koin";
  _symbol: string = "KUSD";
  _decimals: u32 = 8;

  contractId: Uint8Array = System. getContractId();

  // balances of collateral and kusd.koin debt
  kusd_koin_vaults: Storage.Map<Uint8Array, empty.kusd_koin_vaultbalances> = new Storage.Map(
    this.contractId,
    VAULTS_SPACE_ID,
    empty.kusd_koin_vaultbalances.decode,
    empty.kusd_koin_vaultbalances.encode,
    () => new empty.kusd_koin_vaultbalances()
  );

  /**
 * Get a list of all vault balances
 * @external
 * @readonly
 */
  get_koin_protocol_balances(args: empty.list_args): empty.kusd_koin_protocol_balances {
    const direction = args.direction == empty.direction.ascending ? Storage.Direction.Ascending : Storage.Direction.Descending;
    const protocolBalances = this.kusd_koin_vaults.getManyValues(args.start ? args.start! : new Uint8Array(0), args.limit, direction);
    return new empty.kusd_koin_protocol_balances(protocolBalances);
  }

  /**
 * Get a list of all vault addresses
 * @external
 * @readonly
 */  
  get_koin_vaults(args: empty.list_args): empty.addresses {
    const direction = args.direction == empty.direction.ascending ? Storage.Direction.Ascending : Storage.Direction.Descending;
    const accounts = this.kusd_koin_vaults.getManyKeys(args.start ? args.start! : new Uint8Array(0), args.limit, direction);
    return new empty.addresses(accounts);
  }

  /**
 * Get balances of a vault
 * @external
 * @readonly
 */
  get_koin_vault(args: empty.get_vault_args): empty.kusd_koin_vaultbalances {
    return this.kusd_koin_vaults.get(args.owner!)!;
  }

  /**
 * Deposit KOIN as collateral
 * @external
 */
  deposit(args: empty.deposit_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");
    
    const cSigner = args.account!;
    const fee_amount: u64 = multiplyAndDivide(args.amount, 5, 1000); // Fee is 0.5%
    const toDeposit: u64 = args.amount - fee_amount;
    const fee_address = Base58.decode("1Mzp89UMsSh6Fiy4ZEVvTKsmxUYpoJ3emH");
    let vaultBalance: empty.kusd_koin_vaultbalances = this.kusd_koin_vaults.get(cSigner)!;

    koinContract.transfer(new token.transfer_args(cSigner, this.contractId, toDeposit));
    vaultBalance.koin += toDeposit;
    koinContract.transfer(new token.transfer_args(cSigner, fee_address, fee_amount));
    this.kusd_koin_vaults.put(cSigner, vaultBalance);
  }

  /**
 * Withdraw KOIN from a vault
 * @external
 */
  withdraw(args: empty.withdraw_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");

    const cSigner = args.account!;
    let vaultBalance = this.kusd_koin_vaults.get(cSigner)!;
    const toWithdraw: u64 = args.amount;
    let afterWithdrawal: u64 = 0;

    vaultBalance.koin -= toWithdraw;
    afterWithdrawal = this.usd_price(vaultBalance).value;
    if (multiplyAndDivide(vaultBalance.kusd_koin, 150, 100) <= afterWithdrawal) {
      koinContract.transfer(new token.transfer_args(this.contractId, cSigner, toWithdraw));
      this.kusd_koin_vaults.put(cSigner, vaultBalance);
    } else {
      System.fail("Exceeding withdrawal limit");
    }

    if(vaultBalance.koin == 0) {
      this.kusd_koin_vaults.remove(cSigner);
    }
  }

  /**
 * Mint kusd.koin
 * @external
 */
  kusd_mint(args: empty.mint_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");

    const cSigner = args.account!;
    let vaultBalance = this.kusd_koin_vaults.get(cSigner)!;

    if (multiplyAndDivide(args.amount + vaultBalance.kusd_koin, 150, 100) <= this.usd_price(vaultBalance).value) {
      vaultBalance.kusd_koin += args.amount;
      this.kusd_koin_vaults.put(cSigner, vaultBalance);
      this._mint(new token.mint_args(cSigner, args.amount));
      
    } else {
      System.fail("Exceeds mint limit");
    }
  }

  /**
   * Calculate the usd value of the KOIN collateral
   * @external
   * @readonly
   */
  usd_price(args: empty.kusd_koin_vaultbalances): empty.uint64 {

    // On mainnet, compare the KOINDX price with the KAP USD oracle price and use the highest one
    // On testnet just use a placeholder price object

    const KAP_price: u64 = this.get_KAP_price().price; // price is 0.168 atm
    // const KOINDX_price: u64 = multiplyAndDivide(koinUsdt.ratio().token_b, 100000000, koinUsdt.ratio().token_a);
    // (KAP_price > KOINDX_price) ? koin_price = KAP_price : koin_price = KOINDX_price;

    let koin_price: u64 = KAP_price;

    return new empty.uint64(multiplyAndDivide(args.koin, koin_price, 100000000));
  }

  /**
 * Repay kusd.koin
 * @external
 */
  repay(args: empty.repay_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");

    const cSigner = args.account!;
    let vaultBalance = this.kusd_koin_vaults.get(cSigner)!;

    if (args.amount <= vaultBalance.kusd_koin) {
      vaultBalance.kusd_koin -= args.amount;
      this.kusd_koin_vaults.put(cSigner, vaultBalance);
      this._burn(new token.burn_args(cSigner, args.amount));
    } else {
      System.fail("Exceeds the maximum amount which can be repaid");
    }
  }

  /**
 * Liquidate a vault
 * @external
 */
  liquidate(args: empty.liquidate_args): void {

    if (!this.kusd_koin_vaults.get(args.account!)) {
      System.fail("To liquidate you must have an open vault");
    }
    if (args.account == args.vault) {
      System.fail("You can't liquidate your own vault");
    }

    const vb = this.kusd_koin_vaults.get(args.vault!)!;
    let vaultBalance: empty.kusd_koin_vaultbalances = this.kusd_koin_vaults.get(args.account!)!;

    // a minimum collateralization ratio of 150% is required
    if (multiplyAndDivide(vb.kusd_koin, 150, 100) > this.usd_price(vb).value) {
      vaultBalance.koin += vb.koin;
      vaultBalance.kusd_koin += vb.kusd_koin;
      this.kusd_koin_vaults.put(args.account!, vaultBalance);
      this.kusd_koin_vaults.remove(args.vault!);
    } else {
      System.fail("Vault not below liquidation threshold");
    }
  }

  /**
   * Get KAP price oracle for KOIN price
   * @external
   * @readonly
   */
  get_KAP_price(): empty.price_object {
    return KAPusd.get_kap_price(new empty.get_price_args(Base58.decode("1Mzp89UMsSh6Fiy4ZEVvTKsmxUYpoJ3emH"))); 
  }
}