import { Writer, Reader } from "as-proto";

export namespace empty {
  export class str {
    static encode(message: str, writer: Writer): void {
      const unique_name_value = message.value;
      if (unique_name_value !== null) {
        writer.uint32(10);
        writer.string(unique_name_value);
      }
    }

    static decode(reader: Reader, length: i32): str {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new str();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: string | null;

    constructor(value: string | null = null) {
      this.value = value;
    }
  }

  @unmanaged
  export class uint64 {
    static encode(message: uint64, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.uint64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): uint64 {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new uint64();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: u64;

    constructor(value: u64 = 0) {
      this.value = value;
    }
  }

  @unmanaged
  export class kusd_koin_vaultbalances {
    static encode(message: kusd_koin_vaultbalances, writer: Writer): void {
      if (message.koin != 0) {
        writer.uint32(8);
        writer.uint64(message.koin);
      }

      if (message.kusd_koin != 0) {
        writer.uint32(16);
        writer.uint64(message.kusd_koin);
      }
    }

    static decode(reader: Reader, length: i32): kusd_koin_vaultbalances {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new kusd_koin_vaultbalances();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.koin = reader.uint64();
            break;

          case 2:
            message.kusd_koin = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    koin: u64;
    kusd_koin: u64;

    constructor(koin: u64 = 0, kusd_koin: u64 = 0) {
      this.koin = koin;
      this.kusd_koin = kusd_koin;
    }
  }

  export class kusd_koin_protocol_balances {
    static encode(message: kusd_koin_protocol_balances, writer: Writer): void {
      const unique_name_kvb = message.kvb;
      for (let i = 0; i < unique_name_kvb.length; ++i) {
        writer.uint32(10);
        writer.fork();
        kusd_koin_vaultbalances.encode(unique_name_kvb[i], writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): kusd_koin_protocol_balances {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new kusd_koin_protocol_balances();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.kvb.push(
              kusd_koin_vaultbalances.decode(reader, reader.uint32())
            );
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    kvb: Array<kusd_koin_vaultbalances>;

    constructor(kvb: Array<kusd_koin_vaultbalances> = []) {
      this.kvb = kvb;
    }
  }

  export class get_vault_args {
    static encode(message: get_vault_args, writer: Writer): void {
      const unique_name_owner = message.owner;
      if (unique_name_owner !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_owner);
      }
    }

    static decode(reader: Reader, length: i32): get_vault_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_vault_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: Uint8Array | null;

    constructor(owner: Uint8Array | null = null) {
      this.owner = owner;
    }
  }

  export class list_args {
    static encode(message: list_args, writer: Writer): void {
      const unique_name_start = message.start;
      if (unique_name_start !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_start);
      }

      if (message.limit != 0) {
        writer.uint32(16);
        writer.int32(message.limit);
      }

      if (message.direction != 0) {
        writer.uint32(24);
        writer.int32(message.direction);
      }
    }

    static decode(reader: Reader, length: i32): list_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new list_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.start = reader.bytes();
            break;

          case 2:
            message.limit = reader.int32();
            break;

          case 3:
            message.direction = reader.int32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    start: Uint8Array | null;
    limit: i32;
    direction: direction;

    constructor(
      start: Uint8Array | null = null,
      limit: i32 = 0,
      direction: direction = 0
    ) {
      this.start = start;
      this.limit = limit;
      this.direction = direction;
    }
  }

  export class addresses {
    static encode(message: addresses, writer: Writer): void {
      const unique_name_accounts = message.accounts;
      if (unique_name_accounts.length !== 0) {
        for (let i = 0; i < unique_name_accounts.length; ++i) {
          writer.uint32(10);
          writer.bytes(unique_name_accounts[i]);
        }
      }
    }

    static decode(reader: Reader, length: i32): addresses {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new addresses();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.accounts.push(reader.bytes());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    accounts: Array<Uint8Array>;

    constructor(accounts: Array<Uint8Array> = []) {
      this.accounts = accounts;
    }
  }

  export class deposit_args {
    static encode(message: deposit_args, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }

      if (message.amount != 0) {
        writer.uint32(16);
        writer.uint64(message.amount);
      }
    }

    static decode(reader: Reader, length: i32): deposit_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new deposit_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          case 2:
            message.amount = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;
    amount: u64;

    constructor(account: Uint8Array | null = null, amount: u64 = 0) {
      this.account = account;
      this.amount = amount;
    }
  }

  export class withdraw_args {
    static encode(message: withdraw_args, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }

      if (message.amount != 0) {
        writer.uint32(16);
        writer.uint64(message.amount);
      }
    }

    static decode(reader: Reader, length: i32): withdraw_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new withdraw_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          case 2:
            message.amount = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;
    amount: u64;

    constructor(account: Uint8Array | null = null, amount: u64 = 0) {
      this.account = account;
      this.amount = amount;
    }
  }

  export class mint_args {
    static encode(message: mint_args, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }

      if (message.amount != 0) {
        writer.uint32(16);
        writer.uint64(message.amount);
      }
    }

    static decode(reader: Reader, length: i32): mint_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new mint_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          case 2:
            message.amount = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;
    amount: u64;

    constructor(account: Uint8Array | null = null, amount: u64 = 0) {
      this.account = account;
      this.amount = amount;
    }
  }

  export class repay_args {
    static encode(message: repay_args, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }

      if (message.amount != 0) {
        writer.uint32(16);
        writer.uint64(message.amount);
      }
    }

    static decode(reader: Reader, length: i32): repay_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new repay_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          case 2:
            message.amount = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;
    amount: u64;

    constructor(account: Uint8Array | null = null, amount: u64 = 0) {
      this.account = account;
      this.amount = amount;
    }
  }

  export class liquidate_args {
    static encode(message: liquidate_args, writer: Writer): void {
      const unique_name_account = message.account;
      if (unique_name_account !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_account);
      }

      const unique_name_vault = message.vault;
      if (unique_name_vault !== null) {
        writer.uint32(18);
        writer.bytes(unique_name_vault);
      }
    }

    static decode(reader: Reader, length: i32): liquidate_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new liquidate_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.account = reader.bytes();
            break;

          case 2:
            message.vault = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    account: Uint8Array | null;
    vault: Uint8Array | null;

    constructor(
      account: Uint8Array | null = null,
      vault: Uint8Array | null = null
    ) {
      this.account = account;
      this.vault = vault;
    }
  }

  @unmanaged
  export class ratio_args {
    static encode(message: ratio_args, writer: Writer): void {}

    static decode(reader: Reader, length: i32): ratio_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new ratio_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class ratio_result {
    static encode(message: ratio_result, writer: Writer): void {
      const unique_name_k_last = message.k_last;
      if (unique_name_k_last !== null) {
        writer.uint32(10);
        writer.string(unique_name_k_last);
      }

      if (message.token_a != 0) {
        writer.uint32(16);
        writer.uint64(message.token_a);
      }

      if (message.token_b != 0) {
        writer.uint32(24);
        writer.uint64(message.token_b);
      }

      if (message.block_time != 0) {
        writer.uint32(32);
        writer.uint64(message.block_time);
      }
    }

    static decode(reader: Reader, length: i32): ratio_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new ratio_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.k_last = reader.string();
            break;

          case 2:
            message.token_a = reader.uint64();
            break;

          case 3:
            message.token_b = reader.uint64();
            break;

          case 4:
            message.block_time = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    k_last: string | null;
    token_a: u64;
    token_b: u64;
    block_time: u64;

    constructor(
      k_last: string | null = null,
      token_a: u64 = 0,
      token_b: u64 = 0,
      block_time: u64 = 0
    ) {
      this.k_last = k_last;
      this.token_a = token_a;
      this.token_b = token_b;
      this.block_time = block_time;
    }
  }

  export class get_price_args {
    static encode(message: get_price_args, writer: Writer): void {
      const unique_name_token_address = message.token_address;
      if (unique_name_token_address !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_token_address);
      }
    }

    static decode(reader: Reader, length: i32): get_price_args {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_price_args();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.token_address = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    token_address: Uint8Array | null;

    constructor(token_address: Uint8Array | null = null) {
      this.token_address = token_address;
    }
  }

  @unmanaged
  export class price_object {
    static encode(message: price_object, writer: Writer): void {
      if (message.price != 0) {
        writer.uint32(8);
        writer.uint64(message.price);
      }

      if (message.timestamp != 0) {
        writer.uint32(16);
        writer.uint64(message.timestamp);
      }
    }

    static decode(reader: Reader, length: i32): price_object {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new price_object();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.price = reader.uint64();
            break;

          case 2:
            message.timestamp = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    price: u64;
    timestamp: u64;

    constructor(price: u64 = 0, timestamp: u64 = 0) {
      this.price = price;
      this.timestamp = timestamp;
    }
  }

  export enum direction {
    ascending = 0,
    descending = 1,
  }
}
