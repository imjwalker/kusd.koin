import { KusdGold } from "./KusdGold";
import { System, Protobuf } from "@koinos/sdk-as";
import { empty } from "./proto/empty";
import { token } from "@koinosbox/contracts";

const contract = new KusdGold();
contract.callArgs = System.getArguments();
let returnBuffer = new Uint8Array(1024);

switch (contract.callArgs!.entry_point) {
  /* class KusdGold */
    
  // kg_get_vaults
  case 0xf598cebe: {
    const args = Protobuf.decode<empty.list_args>(contract.callArgs!.args, empty.list_args.decode);
    const result = contract.kg_get_vaults(args);
    returnBuffer = Protobuf.encode(result, empty.addresses.encode);
    break;
  }

  // kg_get_balances
  case 0xfc6f58c3: {
    const args = Protobuf.decode<empty.list_args>(contract.callArgs!.args, empty.list_args.decode);
    const result = contract.kg_get_balances(args);
    returnBuffer = Protobuf.encode(result, empty.kg_protocol_balances.encode);
    break;
  }

  // kg_get_vault
  case 0xe9ffe0e5: {
    const args = Protobuf.decode<empty.kg_get_vault_args>(contract.callArgs!.args, empty.kg_get_vault_args.decode);
    const result = contract.kg_get_vault(args);
    returnBuffer = Protobuf.encode(result, empty.kg_vaultbalances.encode);
    break;
  }

  // kg_deposit
  case 0x3e34fa85: {
    const args = Protobuf.decode<empty.kg_deposit_args>(contract.callArgs!.args, empty.kg_deposit_args.decode);
    contract.kg_deposit(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // kg_withdraw
  case 0x38277a29: {
    const args = Protobuf.decode<empty.kg_withdraw_args>(contract.callArgs!.args, empty.kg_withdraw_args.decode);
    contract.kg_withdraw(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // kg_mint
  case 0x182ef922: {
    const args = Protobuf.decode<empty.mint_args>(contract.callArgs!.args, empty.mint_args.decode);
    contract.kg_mint(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // kg_usd
  case 0x03cfb712: {
    const args = Protobuf.decode<empty.kg_vaultbalances>(contract.callArgs!.args, empty.kg_vaultbalances.decode);
    const result = contract.kg_usd(args);
    returnBuffer = Protobuf.encode(result, empty.uint64.encode);
    break;
  }

  // kg_repay
  case 0x6a2e1b56: {
    const args = Protobuf.decode<empty.repay_args>(contract.callArgs!.args, empty.repay_args.decode);
    contract.kg_repay(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // kg_liquidate
  case 0xdca281ec: {
    const args = Protobuf.decode<empty.liquidate_args>(contract.callArgs!.args, empty.liquidate_args.decode);
    contract.kg_liquidate(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  /* class Token */
    
  // name
  case 0x82a3537f: {
    const result = contract.name();
    returnBuffer = Protobuf.encode(result, token.str.encode);
    break;
  }

  // symbol
  case 0xb76a7ca1: {
    const result = contract.symbol();
    returnBuffer = Protobuf.encode(result, token.str.encode);
    break;
  }

  // decimals
  case 0xee80fd2f: {
    const result = contract.decimals();
    returnBuffer = Protobuf.encode(result, token.uint32.encode);
    break;
  }

  // get_info
  case 0xbd7f6850: {
    const result = contract.get_info();
    returnBuffer = Protobuf.encode(result, token.info.encode);
    break;
  }

  // total_supply
  case 0xb0da3934: {
    const result = contract.total_supply();
    returnBuffer = Protobuf.encode(result, token.uint64.encode);
    break;
  }

  // balance_of
  case 0x5c721497: {
    const args = Protobuf.decode<token.balance_of_args>(contract.callArgs!.args, token.balance_of_args.decode);
    const result = contract.balance_of(args);
    returnBuffer = Protobuf.encode(result, token.uint64.encode);
    break;
  }

  // allowance
  case 0x32f09fa1: {
    const args = Protobuf.decode<token.allowance_args>(contract.callArgs!.args, token.allowance_args.decode);
    const result = contract.allowance(args);
    returnBuffer = Protobuf.encode(result, token.uint64.encode);
    break;
  }

  // get_allowances
  case 0x8fa16456: {
    const args = Protobuf.decode<token.get_allowances_args>(contract.callArgs!.args, token.get_allowances_args.decode);
    const result = contract.get_allowances(args);
    returnBuffer = Protobuf.encode(result, token.get_allowances_return.encode);
    break;
  }

  // approve
  case 0x74e21680: {
    const args = Protobuf.decode<token.approve_args>(contract.callArgs!.args, token.approve_args.decode);
    contract.approve(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // transfer
  case 0x27f576ca: {
    const args = Protobuf.decode<token.transfer_args>(contract.callArgs!.args, token.transfer_args.decode);
    contract.transfer(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // mint
  case 0xdc6f17bb: {
    const args = Protobuf.decode<token.mint_args>(contract.callArgs!.args, token.mint_args.decode);
    contract.mint(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  default: {
    System.exit(1);
    break;
  }
}

System.exit(0, returnBuffer);
