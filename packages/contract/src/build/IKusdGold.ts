import { System, Protobuf, StringBytes } from "@koinos/sdk-as";
import { empty } from "./proto/empty";


import { IToken as Token } from "@koinosbox/contracts";


export class KusdGold extends Token {

  /**
 * Get balances of a vault
 * @external
 * @readonly
 */
  get_vault(args: empty.get_vault_args): empty.vaultbalances {
    const argsBuffer = Protobuf.encode(args, empty.get_vault_args.encode);
    const callRes = System.call(this._contractId, 0xaccde3c7, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.get_vault': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new empty.vaultbalances();
    return Protobuf.decode<empty.vaultbalances>(callRes.res.object, empty.vaultbalances.decode);
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
 * Withdraw collateral from a vault
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
 * Mint KUSDG
 * @external
 */
  mint_kusdg(args: empty.mint_args): void {
    const argsBuffer = Protobuf.encode(args, empty.mint_args.encode);
    const callRes = System.call(this._contractId, 0xa4dbb3f6, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.mint_kusdg': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    return;
  }

  /**
 * Repay KUSDG
 * @external
 */
  repay_kusdg(args: empty.repay_args): void {
    const argsBuffer = Protobuf.encode(args, empty.repay_args.encode);
    const callRes = System.call(this._contractId, 0x85f4059a, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'KusdGold.repay_kusdg': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
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
}
