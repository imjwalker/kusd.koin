import { System, Protobuf, StringBytes } from "@koinos/sdk-as";
import { token } from "./proto/token";



export class Token {
  _contractId: Uint8Array;

  /**
   * Create an instance of a Token contract
   * @example
   * ```ts
   *   const contract = new Token(Base58.decode("1DQzuCcTKacbs9GGScFTU1Hc8BsyARTPqe"));
   * ```
   */
  constructor(contractId: Uint8Array) {
    this._contractId = contractId;
  }

  /**
   * Get total supply
   * @external
   * @readonly
   */
  total_supply(): token.uint64 {
    const argsBuffer = new Uint8Array(0);
    const callRes = System.call(this._contractId, 0xb0da3934, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'Token.total_supply': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new token.uint64();
    return Protobuf.decode<token.uint64>(callRes.res.object, token.uint64.decode);
  }

  /**
   * Get balance of an account
   * @external
   * @readonly
   */
  balance_of(args: token.balance_of_args): token.uint64 {
    const argsBuffer = Protobuf.encode(args, token.balance_of_args.encode);
    const callRes = System.call(this._contractId, 0x5c721497, argsBuffer);
    if (callRes.code != 0) {
      const errorMessage = `failed to call 'Token.balance_of': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
      System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
    }
    if (!callRes.res.object) return new token.uint64();
    return Protobuf.decode<token.uint64>(callRes.res.object, token.uint64.decode);
  }
}
