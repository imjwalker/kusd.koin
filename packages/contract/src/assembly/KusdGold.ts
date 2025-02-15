// SPDX-License-Identifier: MIT

import { System, Storage, Base58, authority } from "@koinos/sdk-as";
import { Token as Base } from "@koinos/sdk-as";
import { Token, token } from "@koinosbox/contracts";
import { empty } from "./proto/empty";
import { ExternalContract as Extc } from "./ExternalContract";
import { multiplyAndDivide } from "@koinosbox/contracts/assembly/vapor/utils";

const VAULTS_SPACE_ID = 4;

// KUSD Gold contract address on Harbinger: 166BxNmWGuZHYAVHCeh6D8i7XF5qX21kGT

// TESTNET CONTRACTS
// Random token contract (placeholder). Freely mint tokens (in range of uint64) 
const koinContract = new Base(Base58.decode("1PWNYq8aF6rcKd4of59FEeSEKmYifCyoJc"));

// KoinDX pool contract (placeholder)
const koinUsdt = new Extc(Base58.decode("1JNfiwk1QT4Ao4bu1YrTD7rEiQoTPXKnZ6"));

// KAP USD oracle (MEXC price) (placeholder)
const KAPusd = new Extc(Base58.decode("13PXvxWLMyi4dAd6uS1SehNNFryvFyygnD"));

/* 
// MAINNET CONTRACTS
const koinContract = new Base(Base58.decode("15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL"));

// KoinDX contract
const koinUsdt = new Etc(Base58.decode("1M9VoAHN3MdvwHnUotgk8GBVjCnXYepWbk"));

// KAP USD oracle (MEXC price)
const KAPusd = new Extc(Base58.decode("1D53GFQkL5TkQ9okuf6r3Gta3oeTMVgGJW"));
 */

export class KusdGold extends Token {
  _name: string = "kusd.gold";
  _symbol: string = "KUSDG";
  _decimals: u32 = 8;

  contractId: Uint8Array = System. getContractId();

  // balances of collateral and KUSDG debt
  kg_vaults: Storage.Map<Uint8Array, empty.kg_vaultbalances> = new Storage.Map(
    this.contractId,
    VAULTS_SPACE_ID,
    empty.kg_vaultbalances.decode,
    empty.kg_vaultbalances.encode,
    () => new empty.kg_vaultbalances()
  );

  /**
 * Get a list of all vault addresses
 * @external
 * @readonly
 */  
  kg_get_vaults(args: empty.list_args): empty.addresses {
    const direction = args.direction == empty.direction.ascending ? Storage.Direction.Ascending : Storage.Direction.Descending;
    const accounts = this.kg_vaults.getManyKeys(args.start ? args.start! : new Uint8Array(0), args.limit, direction);
    return new empty.addresses(accounts);
  }

  /**
 * Get a list of all vault balances
 * @external
 * @readonly
 */
  kg_get_balances(args: empty.list_args): empty.kg_protocol_balances {
    const direction = args.direction == empty.direction.ascending ? Storage.Direction.Ascending : Storage.Direction.Descending;
    const protocolBalances = this.kg_vaults.getManyValues(args.start ? args.start! : new Uint8Array(0), args.limit, direction);
    return new empty.kg_protocol_balances(protocolBalances);
  }

  /**
 * Get balances of a vault
 * @external
 * @readonly
 */
  kg_get_vault(args: empty.kg_get_vault_args): empty.kg_vaultbalances {
    return this.kg_vaults.get(args.owner!)!;
  }

  /**
 * Deposit KOIN as collateral
 * @external
 */
  kg_deposit(args: empty.kg_deposit_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");
    
    const cSigner = args.account!;
    let vaultBalance: empty.kg_vaultbalances = this.kg_vaults.get(cSigner)!;
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

    this.kg_vaults.put(cSigner, vaultBalance);
  }

  /**
 * Withdraw collateral from a vault
 * @external
 */
  kg_withdraw(args: empty.kg_withdraw_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");

    const cSigner = args.account!;
    let vaultBalance = this.kg_vaults.get(cSigner)!;
    const toWithdraw: u64 = args.amount;
    let afterWithdrawal: u64 = 0;

    vaultBalance.koin -= toWithdraw;
    afterWithdrawal = this.kg_usd(vaultBalance).value;
    if (multiplyAndDivide(vaultBalance.kusdgold, 110, 100) <= afterWithdrawal) { 
      koinContract.transfer(this.contractId, cSigner, toWithdraw);
      this.kg_vaults.put(cSigner, vaultBalance);
    } else {
      throw new Error("Exceeding withdrawal amount, collateral value would fall below 110% threshold");
    }

    if(vaultBalance.koin == 0 && vaultBalance.kusdgold == 0) {
      this.kg_vaults.remove(cSigner);
    }
  }

  /**
 * Mint KUSDG
 * @external
 */
  kg_mint(args: empty.mint_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");

    const cSigner = args.account!;
    let vaultBalance = this.kg_vaults.get(cSigner)!;

    if (multiplyAndDivide(args.amount + vaultBalance.kusdgold, 110, 100) <= this.kg_usd(vaultBalance).value) {
      vaultBalance.kusdgold += args.amount;
      this.kg_vaults.put(cSigner, vaultBalance);
      this._mint(new token.mint_args(cSigner, args.amount));
    } else {
      throw new Error("Exceeds allowed amount to mint, collateral value would fall below 110% threshold");
    }
  }

  /**
   * Calculate the total USD value of KOIN
   * @external
   * @readonly
   */
  kg_usd(args: empty.kg_vaultbalances): empty.uint64 {
    
    // on mainnet compare the KOIN price of KOINDX and the KAP USD oracle and use the highest one
    const KAP_price: u64 = this.get_KAP_price().price; // 0.1892
    const KOINDX_price: u64 = this.get_KAP_price().price;
    // On mainnet, get the KoinDX trading pool reserves instead: br
    // const KOINDX_price: u64 = multiplyAndDivide(koinUsdt.ratio().token_b, 100000000, koinUsdt.ratio().token_a);
    
    let koin_price: u64 = KAP_price;
    (KAP_price > KOINDX_price) ? koin_price = KAP_price : koin_price = KOINDX_price;

    return new empty.uint64(multiplyAndDivide(args.koin, koin_price, 100000000));
  }

  /**
 * Repay KUSDG
 * @external
 */
  kg_repay(args: empty.repay_args): void {

    const authorized = System.checkAuthority(authority.authorization_type.contract_call, args.account!);
    if (!authorized) System.fail("not authorized by the user");

    const cSigner = args.account!;
    let vaultBalance = this.kg_vaults.get(cSigner)!;

    if (args.amount <= vaultBalance.kusdgold) {
      vaultBalance.kusdgold -= args.amount;
      this.kg_vaults.put(cSigner, vaultBalance);
      this._burn(new token.burn_args(cSigner, args.amount));
    } else {
      throw new Error("Amount exceeds the maximum which can be repaid.");
    }
  }

  /**
 * Liquidate a vault
 * @external
 */
  kg_liquidate(args: empty.liquidate_args): void {

    if (!this.kg_vaults.get(args.account!)) {
      throw new Error("To liquidate you must have an open vault");
    }
    if (args.account == args.vault) {
      throw new Error("You can't liquidate your own vault");
    }

    const vb = this.kg_vaults.get(args.vault!)!;
    let vaultBalance: empty.kg_vaultbalances = this.kg_vaults.get(args.account!)!;

    // a minimum collateralization ratio of 110% is required
    if (multiplyAndDivide(vb.kusdgold, 110, 100) > this.kg_usd(vb).value) {
      vaultBalance.koin += vb.koin;
      vaultBalance.kusdgold += vb.kusdgold;
      this.kg_vaults.put(args.account!, vaultBalance);
      this.kg_vaults.remove(args.vault!);
    } else {
      throw new Error("Vault not below liquidation threshold");
    }
  }

  /**
   * Get KAP price oracle for KOIN price
   */
  get_KAP_price(): empty.price_object {
    // testnet price object
    return KAPusd.get_kap_price(new empty.get_price_args(Base58.decode("1Mzp89UMsSh6Fiy4ZEVvTKsmxUYpoJ3emH"))); 
  }
}
