// SPDX-License-Identifier: MIT

import { System, Storage, Base58, authority } from "@koinos/sdk-as";
import { Token as Base } from "@koinos/sdk-as";
import { Token, token } from "@koinosbox/contracts";
import { empty } from "./proto/empty";
import { ExternalContract as Extc } from "./ExternalContract";
import { multiplyAndDivide } from "@koinosbox/contracts/assembly/vapor/utils";

const VAULTS_SPACE_ID = 4;

// KUSD Gold contract address on Harbinger: 166BxNmWGuZHYAVHCeh6D8i7XF5qX21kGT

// TESTNET CONTRACT
const koinContract = new Base(Base58.decode("1PWNYq8aF6rcKd4of59FEeSEKmYifCyoJc")); // Random token contract I uploaded. You can freely mint tokens

// KoinDX pool contract
const koinUsdt = new Extc(Base58.decode("1JNfiwk1QT4Ao4bu1YrTD7rEiQoTPXKnZ6")); // Koin/VHP contract to test

// KAP USD oracle (MEXC price)
const KAPusd = new Extc(Base58.decode("13PXvxWLMyi4dAd6uS1SehNNFryvFyygnD")); // test contract with price object

/* 
// MAINNET CONTRACTS
const koinContract = new Base(Base58.decode("15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL"));

// KoinDX contracts
const koinUsdt = new Etc(Base58.decode("1M9VoAHN3MdvwHnUotgk8GBVjCnXYepWbk"));

// KAP USD oracle
const KAPusd = new Extc(Base58.decode("1D53GFQkL5TkQ9okuf6r3Gta3oeTMVgGJW"));
 */

export class KusdGold extends Token {
  _name: string = "kusd.gold";
  _symbol: string = "KUSDG";
  _decimals: u32 = 8;

  contractId: Uint8Array = System. getContractId();

  // balances of collateral and KUSDG debt
  vaults: Storage.Map<Uint8Array, empty.vaultbalances> = new Storage.Map(
    this.contractId,
    VAULTS_SPACE_ID,
    empty.vaultbalances.decode,
    empty.vaultbalances.encode,
    () => new empty.vaultbalances()
  );

  /**
 * Get a list of all vaults
 * @external
 * @readonly
 */  
  get_vaults(args: empty.list_args): empty.addresses {
    const direction = args.direction == empty.direction.ascending ? Storage.Direction.Ascending : Storage.Direction.Descending;
    const accounts = this.vaults.getManyKeys(args.start ? args.start! : new Uint8Array(0), args.limit, direction);
    return new empty.addresses(accounts);
  }

  /**
 * Get balances of a vault
 * @external
 * @readonly
 */
  get_vault(args: empty.get_vault_args): empty.vaultbalances {
    return this.vaults.get(args.owner!)!;
  }

  /**
 * Deposit KOIN as collateral
 * @external
 */
  deposit(args: empty.deposit_args): void {
    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");
    const cSigner = args.account!;
    let vaultBalance: empty.vaultbalances = this.vaults.get(cSigner)!;
    let toDeposit: u64;
    let fee_amount: u64 = 0;

    // Sending a Fee is optional
    // Fee has 3 decimal places, minimum fee is 0.001 (0.1 %) if true
    if (args.fee > 0) {
      fee_amount = multiplyAndDivide(args.amount, args.fee, 1000);
      toDeposit = args.amount - fee_amount;
    } else {
      toDeposit = args.amount;
    }
  
    // Allowances first need to be approved in frontend.
    koinContract.transfer(cSigner, this.contractId, toDeposit);
    vaultBalance.koin += toDeposit;
    fee_amount > 0 && koinContract.transfer(cSigner, args.fee_address!, fee_amount);

    this.vaults.put(cSigner, vaultBalance);
  }

  /**
 * Withdraw collateral from a vault
 * @external
 */
  withdraw(args: empty.withdraw_args): void {
    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");
    const cSigner = args.account!;
    let vaultBalance = this.vaults.get(cSigner)!;
    const toWithdraw: u64 = args.amount;
    let afterWithdrawal: u64 = 0;

    vaultBalance.koin -= toWithdraw;
    afterWithdrawal = this.kusdg_usd(vaultBalance).value;
    if (multiplyAndDivide(vaultBalance.kusdgold, 110, 100) < afterWithdrawal) {
      koinContract.transfer(this.contractId, cSigner, toWithdraw);
      this.vaults.put(cSigner, vaultBalance);
    } else {
      throw new Error("Exceeding withdrawal amount, collateral value would fall below 110% threshold");
    }
  }

  /**
 * Mint KUSDG
 * @external
 */
  mint_kusdg(args: empty.mint_args): void {
    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");
    const cSigner = args.account!;
    let vaultBalance = this.vaults.get(cSigner)!;

    if (multiplyAndDivide(args.amount + vaultBalance.kusdgold, 110, 100) < this.kusdg_usd(vaultBalance).value) {
      vaultBalance.kusdgold += args.amount;
      this.vaults.put(cSigner, vaultBalance);
      this._mint(new token.mint_args(cSigner, args.amount));
    } else {
      throw new Error("Exceeds allowed amount to mint, collateral value would fall below 110% threshold");
    }
  }

  /**
   * Get KAP price oracle for KOIN
   */
  get_KAP_price(): empty.price_object {
    return KAPusd.get_price(new empty.get_price_args(Base58.decode("1Mzp89UMsSh6Fiy4ZEVvTKsmxUYpoJ3emH"))); // KOIN contract address comes here
  }

  /**
   * Calculate the total USD value of KOIN
   */
  kusdg_usd(args: empty.vaultbalances): empty.uint64 {
    // compare the KOIN price of KOINDX and the KAP USD oracle, use the highest price.
    const KAP_price: u64 = this.get_KAP_price().price;
    const KOINDX_price: u64 = multiplyAndDivide(koinUsdt.ratio().token_b, koinUsdt.ratio().token_a, 100000000);
    let koin_price: u64;
    (KAP_price > KOINDX_price) ? koin_price = KAP_price : koin_price = KOINDX_price;
    let totalCollateralValue: u64 = 0;

    if (args.koin) {
      totalCollateralValue += multiplyAndDivide(args.koin, koin_price, 100000000);
    }
    return new empty.uint64(totalCollateralValue);
  }

  /**
 * Repay KUSDG
 * @external
 */
  repay_kusdg(args: empty.repay_args): void {
    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");
    const cSigner = args.account!;
    let vaultBalance = this.vaults.get(cSigner)!;

    if (args.amount <= vaultBalance.kusdgold) { // minimum toevoegen
      vaultBalance.kusdgold -= args.amount;
      this.vaults.put(cSigner, vaultBalance);
      this._burn(new token.burn_args(cSigner, args.amount));
    } else {
      throw new Error("Amount exceeds the maximum which can be repaid.");
    }
  }

  /**
 * Liquidate a vault
 * @external
 */
  liquidate(args: empty.liquidate_args): void {
    if (!this.vaults.get(args.account!)) {
      throw new Error("To liquidate you must have an open vault");
    }
    const vb = this.vaults.get(args.vault!)!;
    let vaultBalance: empty.vaultbalances = this.vaults.get(args.account!)!;

    // a minimum collateralization ratio of 110% is require
    if (multiplyAndDivide(vb.kusdgold, 110, 100) > this.kusdg_usd(vb).value) {
      vaultBalance.koin += vb.koin;
      vaultBalance.kusdgold += vb.kusdgold;
      this.vaults.put(args.account!, vaultBalance);
      this.vaults.remove(args.vault!);
    } else {
      throw new Error("Vault not below liquidation threshold");
    }
  }
}
