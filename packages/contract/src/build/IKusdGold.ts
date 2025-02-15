import { System, Protobuf, StringBytes } from "@koinos/sdk-as";
import { empty } from "./proto/empty";


import { IToken as Token } from "@koinosbox/contracts";


export class KusdGold extends Token {

  /**
 * Get a list of all vault addresses
 * @external
 * @readonly
 */
  kg_get_vaults(args: empty.list_args): empty.addresses {
    const argsBuffer = Protobuf.encode(args, empty.list_args.encode);
    const callRes = System.call(this._contractId, 0xf598cebe, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_get_vaults': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.addresses();
    return Protobuf.decode<empty.addresses>(callRes.res.object, empty.addresses.decode);
  }

  /**
 * Get a list of all vault balances
 * @external
 * @readonly
 */
  kg_get_balances(args: empty.list_args): empty.kg_protocol_balances {
    const argsBuffer = Protobuf.encode(args, empty.list_args.encode);
    const callRes = System.call(this._contractId, 0xfc6f58c3, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_get_balances': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.kg_protocol_balances();
    return Protobuf.decode<empty.kg_protocol_balances>(callRes.res.object, empty.kg_protocol_balances.decode);
  }

  /**
 * Get balances of a vault
 * @external
 * @readonly
 */
  kg_get_vault(args: empty.kg_get_vault_args): empty.kg_vaultbalances {
    const argsBuffer = Protobuf.encode(args, empty.kg_get_vault_args.encode);
    const callRes = System.call(this._contractId, 0xe9ffe0e5, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_get_vault': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.kg_vaultbalances();
    return Protobuf.decode<empty.kg_vaultbalances>(callRes.res.object, empty.kg_vaultbalances.decode);
  }

  /**
 * Deposit KOIN as collateral
 * @external
 */
  kg_deposit(args: empty.kg_deposit_args): void {
    const argsBuffer = Protobuf.encode(args, empty.kg_deposit_args.encode);
    const callRes = System.call(this._contractId, 0x3e34fa85, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_deposit': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
 * Withdraw collateral from a vault
 * @external
 */
  kg_withdraw(args: empty.kg_withdraw_args): void {
    const argsBuffer = Protobuf.encode(args, empty.kg_withdraw_args.encode);
    const callRes = System.call(this._contractId, 0x38277a29, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_withdraw': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
 * Mint KUSDG
 * @external
 */
  kg_mint(args: empty.mint_args): void {
    const argsBuffer = Protobuf.encode(args, empty.mint_args.encode);
    const callRes = System.call(this._contractId, 0x182ef922, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_mint': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
   * Calculate the total USD value of KOIN
   * @external
   * @readonly
   */
  kg_usd(args: empty.kg_vaultbalances): empty.uint64 {
    const argsBuffer = Protobuf.encode(args, empty.kg_vaultbalances.encode);
    const callRes = System.call(this._contractId, 0x03cfb712, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_usd': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.uint64();
    return Protobuf.decode<empty.uint64>(callRes.res.object, empty.uint64.decode);
  }

  /**
 * Repay KUSDG
 * @external
 */
  kg_repay(args: empty.repay_args): void {
    const argsBuffer = Protobuf.encode(args, empty.repay_args.encode);
    const callRes = System.call(this._contractId, 0x6a2e1b56, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_repay': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
 * Liquidate a vault
 * @external
 */
  kg_liquidate(args: empty.liquidate_args): void {
    const argsBuffer = Protobuf.encode(args, empty.liquidate_args.encode);
    const callRes = System.call(this._contractId, 0xdca281ec, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.kg_liquidate': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }
}
