import {
  AnchorProvider,
  BN,
  IdlAccounts,
  Program,
  web3,
} from "@coral-xyz/anchor";
import { MethodsBuilder } from "@coral-xyz/anchor/dist/cjs/program/namespace/methods";
import { SolanaMarketplace } from "../../target/types/solana_marketplace";
import idl from "../../target/idl/solana_marketplace.json";
import * as pda from "./pda";



let _program: Program<SolanaMarketplace>;


export const initializeClient = (
    programId: web3.PublicKey,
    anchorProvider = AnchorProvider.env(),
) => {
    _program = new Program<SolanaMarketplace>(
        idl as never,
        programId,
        anchorProvider,
    );


};

export type CreateItemArgs = {
  authority: web3.PublicKey;
  item: web3.PublicKey;
  id: bigint;
  name: string;
  quantity: bigint;
  price: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Create a new inventory item (only market owner can create)
 *
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable, signer]` item: {@link Item} 
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - id: {@link BigInt} Unique identifier for the item
 * - name: {@link string} Name of the item
 * - quantity: {@link BigInt} Initial stock quantity
 * - price: {@link BigInt} Price in lamports
 */
export const createItemBuilder = (
	args: CreateItemArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<SolanaMarketplace, never> => {


  return _program
    .methods
    .createItem(
      new BN(args.id.toString()),
      args.name,
      new BN(args.quantity.toString()),
      new BN(args.price.toString()),
    )
    .accountsStrict({
      authority: args.authority,
      item: args.item,
      systemProgram: new web3.PublicKey("11111111111111111111111111111111"),
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Create a new inventory item (only market owner can create)
 *
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable, signer]` item: {@link Item} 
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - id: {@link BigInt} Unique identifier for the item
 * - name: {@link string} Name of the item
 * - quantity: {@link BigInt} Initial stock quantity
 * - price: {@link BigInt} Price in lamports
 */
export const createItem = (
	args: CreateItemArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    createItemBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Create a new inventory item (only market owner can create)
 *
 * Accounts:
 * 0. `[signer]` authority: {@link PublicKey} 
 * 1. `[writable, signer]` item: {@link Item} 
 * 2. `[]` system_program: {@link PublicKey} Auto-generated, for account initialization
 *
 * Data:
 * - id: {@link BigInt} Unique identifier for the item
 * - name: {@link string} Name of the item
 * - quantity: {@link BigInt} Initial stock quantity
 * - price: {@link BigInt} Price in lamports
 */
export const createItemSendAndConfirm = async (
  args: Omit<CreateItemArgs, "authority" | "item"> & {
    signers: {
      authority: web3.Signer,
      item: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return createItemBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
      item: args.signers.item.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority, args.signers.item])
    .rpc();
}

export type UpdateQuantityArgs = {
  item: web3.PublicKey;
  authority: web3.PublicKey;
  quantity: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Update the stock quantity of an existing item
 *
 * Accounts:
 * 0. `[writable]` item: {@link Item} 
 * 1. `[signer]` authority: {@link PublicKey} Authority of the item
 *
 * Data:
 * - quantity: {@link BigInt} New stock quantity
 */
export const updateQuantityBuilder = (
	args: UpdateQuantityArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<SolanaMarketplace, never> => {


  return _program
    .methods
    .updateQuantity(
      new BN(args.quantity.toString()),
    )
    .accountsStrict({
      item: args.item,
      authority: args.authority,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Update the stock quantity of an existing item
 *
 * Accounts:
 * 0. `[writable]` item: {@link Item} 
 * 1. `[signer]` authority: {@link PublicKey} Authority of the item
 *
 * Data:
 * - quantity: {@link BigInt} New stock quantity
 */
export const updateQuantity = (
	args: UpdateQuantityArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    updateQuantityBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Update the stock quantity of an existing item
 *
 * Accounts:
 * 0. `[writable]` item: {@link Item} 
 * 1. `[signer]` authority: {@link PublicKey} Authority of the item
 *
 * Data:
 * - quantity: {@link BigInt} New stock quantity
 */
export const updateQuantitySendAndConfirm = async (
  args: Omit<UpdateQuantityArgs, "authority"> & {
    signers: {
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return updateQuantityBuilder({
      ...args,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.authority])
    .rpc();
}

export type PurchaseItemArgs = {
  item: web3.PublicKey;
  buyer: web3.PublicKey;
  quantity: bigint;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Purchase an item, transfer SOL from buyer to authority, and reduce quantity
 *
 * Accounts:
 * 0. `[writable]` item: {@link Item} 
 * 1. `[writable, signer]` buyer: {@link PublicKey} Buyer who is purchasing the item
 *
 * Data:
 * - quantity: {@link BigInt} Quantity to purchase
 */
export const purchaseItemBuilder = (
	args: PurchaseItemArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<SolanaMarketplace, never> => {


  return _program
    .methods
    .purchaseItem(
      new BN(args.quantity.toString()),
    )
    .accountsStrict({
      item: args.item,
      buyer: args.buyer,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Purchase an item, transfer SOL from buyer to authority, and reduce quantity
 *
 * Accounts:
 * 0. `[writable]` item: {@link Item} 
 * 1. `[writable, signer]` buyer: {@link PublicKey} Buyer who is purchasing the item
 *
 * Data:
 * - quantity: {@link BigInt} Quantity to purchase
 */
export const purchaseItem = (
	args: PurchaseItemArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    purchaseItemBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Purchase an item, transfer SOL from buyer to authority, and reduce quantity
 *
 * Accounts:
 * 0. `[writable]` item: {@link Item} 
 * 1. `[writable, signer]` buyer: {@link PublicKey} Buyer who is purchasing the item
 *
 * Data:
 * - quantity: {@link BigInt} Quantity to purchase
 */
export const purchaseItemSendAndConfirm = async (
  args: Omit<PurchaseItemArgs, "buyer"> & {
    signers: {
      buyer: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return purchaseItemBuilder({
      ...args,
      buyer: args.signers.buyer.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.buyer])
    .rpc();
}

export type DeleteItemArgs = {
  item: web3.PublicKey;
  authority: web3.PublicKey;
};

/**
 * ### Returns a {@link MethodsBuilder}
 * Remove an item from the inventory (only authority)
 *
 * Accounts:
 * 0. `[writable, signer]` item: {@link Item} 
 * 1. `[signer]` authority: {@link PublicKey} Authority of the item
 */
export const deleteItemBuilder = (
	args: DeleteItemArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): MethodsBuilder<SolanaMarketplace, never> => {


  return _program
    .methods
    .deleteItem(

    )
    .accountsStrict({
      item: args.item,
      authority: args.authority,
    })
    .remainingAccounts(remainingAccounts);
};

/**
 * ### Returns a {@link web3.TransactionInstruction}
 * Remove an item from the inventory (only authority)
 *
 * Accounts:
 * 0. `[writable, signer]` item: {@link Item} 
 * 1. `[signer]` authority: {@link PublicKey} Authority of the item
 */
export const deleteItem = (
	args: DeleteItemArgs,
	remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionInstruction> =>
    deleteItemBuilder(args, remainingAccounts).instruction();

/**
 * ### Returns a {@link web3.TransactionSignature}
 * Remove an item from the inventory (only authority)
 *
 * Accounts:
 * 0. `[writable, signer]` item: {@link Item} 
 * 1. `[signer]` authority: {@link PublicKey} Authority of the item
 */
export const deleteItemSendAndConfirm = async (
  args: Omit<DeleteItemArgs, "item" | "authority"> & {
    signers: {
      item: web3.Signer,
      authority: web3.Signer,
    },
  },
  remainingAccounts: Array<web3.AccountMeta> = [],
): Promise<web3.TransactionSignature> => {
  const preInstructions: Array<web3.TransactionInstruction> = [];


  return deleteItemBuilder({
      ...args,
      item: args.signers.item.publicKey,
      authority: args.signers.authority.publicKey,
    }, remainingAccounts)
    .preInstructions(preInstructions)
    .signers([args.signers.item, args.signers.authority])
    .rpc();
}

// Getters

export const getItem = (
    publicKey: web3.PublicKey,
    commitment?: web3.Commitment
): Promise<IdlAccounts<SolanaMarketplace>["item"]> => _program.account.item.fetch(publicKey, commitment);
