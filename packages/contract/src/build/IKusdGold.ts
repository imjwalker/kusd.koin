import { System, Protobuf, StringBytes } from "@koinos/sdk-as";
import { empty } from "./proto/empty";


import { IToken as Token } from "@koinosbox/contracts";


export class KusdGold extends Token {

  /**
 * Get a list of all vault balances
 * @external
 * @readonly
 */
  get_koin_protocol_balances(args: empty.list_args): empty.kusd_koin_protocol_balances {
    const argsBuffer = Protobuf.encode(args, empty.list_args.encode);
    const callRes = System.call(this._contractId, 0x01fd5406, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.get_koin_protocol_balances': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.kusd_koin_protocol_balances();
    return Protobuf.decode<empty.kusd_koin_protocol_balances>(callRes.res.object, empty.kusd_koin_protocol_balances.decode);
  }

  /**
 * Get a list of all vault addresses
 * @external
 * @readonly
 */
  get_koin_vaults(args: empty.list_args): empty.addresses {
    const argsBuffer = Protobuf.encode(args, empty.list_args.encode);
    const callRes = System.call(this._contractId, 0x27a07557, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.get_koin_vaults': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.addresses();
    return Protobuf.decode<empty.addresses>(callRes.res.object, empty.addresses.decode);
  }

  /**
 * Get balances of a vault
 * @external
 * @readonly
 */
  get_koin_vault(args: empty.get_vault_args): empty.kusd_koin_vaultbalances {
    const argsBuffer = Protobuf.encode(args, empty.get_vault_args.encode);
    const callRes = System.call(this._contractId, 0x6be080fe, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.get_koin_vault': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.kusd_koin_vaultbalances();
    return Protobuf.decode<empty.kusd_koin_vaultbalances>(callRes.res.object, empty.kusd_koin_vaultbalances.decode);
  }

  /**
 * Deposit KOIN as collateral
 * @external
 */
  deposit(args: empty.deposit_args): void {
    const argsBuffer = Protobuf.encode(args, empty.deposit_args.encode);
    const callRes = System.call(this._contractId, 0xc3b9fb78, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.deposit': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
 * Withdraw KOIN from a vault
 * @external
 */
  withdraw(args: empty.withdraw_args): void {
    const argsBuffer = Protobuf.encode(args, empty.withdraw_args.encode);
    const callRes = System.call(this._contractId, 0xc26f22db, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.withdraw': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
 * Mint kusd.koin
 * @external
 */
  kusd_mint(args: empty.mint_args): void {
    const argsBuffer = Protobuf.encode(args, empty.mint_args.encode);
    const callRes = System.call(this._contractId, 0xfe3c15d6, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kusd_mint': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
   * Calculate the usd value of the KOIN collateral
   * @external
   * @readonly
   */
  usd_price(args: empty.kusd_koin_vaultbalances): empty.uint64 {
    const argsBuffer = Protobuf.encode(args, empty.kusd_koin_vaultbalances.encode);
    const callRes = System.call(this._contractId, 0x24072170, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.usd_price': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.uint64();
    return Protobuf.decode<empty.uint64>(callRes.res.object, empty.uint64.decode);
  }

  /**
 * Repay kusd.koin
 * @external
 */
  repay(args: empty.repay_args): void {
    const argsBuffer = Protobuf.encode(args, empty.repay_args.encode);
    const callRes = System.call(this._contractId, 0x66f49a3a, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.repay': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
 * Liquidate a vault
 * @external
 */
  liquidate(args: empty.liquidate_args): void {
    const argsBuffer = Protobuf.encode(args, empty.liquidate_args.encode);
    const callRes = System.call(this._contractId, 0xbcd6cc74, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.liquidate': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
   * Get KAP price oracle for KOIN price
   * @external
   * @readonly
   */
  get_KAP_price(): empty.price_object {
    const argsBuffer = new Uint8Array(0);
    const callRes = System.call(this._contractId, 0x0424217b, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.get_KAP_price': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.price_object();
    return Protobuf.decode<empty.price_object>(callRes.res.object, empty.price_object.decode);
  }
}
