import { KusdGold } from "./KusdGold";
import { System, Protobuf } from "@koinos/sdk-as";
import { empty } from "./proto/empty";
import { token } from "@koinosbox/contracts";

const contract = new KusdGold();
contract.callArgs = System.getArguments();
let returnBuffer = new Uint8Array(1024);

switch (contract.callArgs!.entry_point) {
  /* class KusdGold */
    
  // get_koin_protocol_balances
  case 0x01fd5406: {
    const args = Protobuf.decode<empty.list_args>(contract.callArgs!.args, empty.list_args.decode);
    const result = contract.get_koin_protocol_balances(args);
    returnBuffer = Protobuf.encode(result, empty.kusd_koin_protocol_balances.encode);
    break;
  }

  // get_koin_vaults
  case 0x27a07557: {
    const args = Protobuf.decode<empty.list_args>(contract.callArgs!.args, empty.list_args.decode);
    const result = contract.get_koin_vaults(args);
    returnBuffer = Protobuf.encode(result, empty.addresses.encode);
    break;
  }

  // get_koin_vault
  case 0x6be080fe: {
    const args = Protobuf.decode<empty.get_vault_args>(contract.callArgs!.args, empty.get_vault_args.decode);
    const result = contract.get_koin_vault(args);
    returnBuffer = Protobuf.encode(result, empty.kusd_koin_vaultbalances.encode);
    break;
  }

  // deposit
  case 0xc3b9fb78: {
    const args = Protobuf.decode<empty.deposit_args>(contract.callArgs!.args, empty.deposit_args.decode);
    contract.deposit(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // withdraw
  case 0xc26f22db: {
    const args = Protobuf.decode<empty.withdraw_args>(contract.callArgs!.args, empty.withdraw_args.decode);
    contract.withdraw(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // kusd_mint
  case 0xfe3c15d6: {
    const args = Protobuf.decode<empty.mint_args>(contract.callArgs!.args, empty.mint_args.decode);
    contract.kusd_mint(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // usd_price
  case 0x24072170: {
    const args = Protobuf.decode<empty.kusd_koin_vaultbalances>(contract.callArgs!.args, empty.kusd_koin_vaultbalances.decode);
    const result = contract.usd_price(args);
    returnBuffer = Protobuf.encode(result, empty.uint64.encode);
    break;
  }

  // repay
  case 0x66f49a3a: {
    const args = Protobuf.decode<empty.repay_args>(contract.callArgs!.args, empty.repay_args.decode);
    contract.repay(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // liquidate
  case 0xbcd6cc74: {
    const args = Protobuf.decode<empty.liquidate_args>(contract.callArgs!.args, empty.liquidate_args.decode);
    contract.liquidate(args);
    returnBuffer = new Uint8Array(0);
    break;
  }

  // get_KAP_price
  case 0x0424217b: {
    const result = contract.get_KAP_price();
    returnBuffer = Protobuf.encode(result, empty.price_object.encode);
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
