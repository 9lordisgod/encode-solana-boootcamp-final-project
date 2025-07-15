pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use std::str::FromStr;

pub use constants::*;
pub use error::*;
pub use instructions::*;
pub use state::*;

declare_id!("3sPVHWRvyqEoPHYMsEK34fexKXLeqiPtbDXGFyeTFF6L");

#[program]
pub mod solana_marketplace {
    use super::*;

    /// Create a new inventory item (only market owner can create)
    ///
    /// Accounts:
    /// 0. `[signer]` authority: [AccountInfo] 
    /// 1. `[writable, signer]` item: [Item] 
    /// 2. `[]` system_program: [AccountInfo] Auto-generated, for account initialization
    ///
    /// Data:
    /// - id: [u64] Unique identifier for the item
    /// - name: [String] Name of the item
    /// - quantity: [u64] Initial stock quantity
    /// - price: [u64] Price in lamports
    pub fn create_item(ctx: Context<CreateItem>, id: u64, name: String, quantity: u64, price: u64) -> Result<()> {
        create_item::handler(ctx, id, name, quantity, price)
    }

    /// Update the stock quantity of an existing item
    ///
    /// Accounts:
    /// 0. `[writable]` item: [Item] 
    /// 1. `[signer]` authority: [AccountInfo] Authority of the item
    ///
    /// Data:
    /// - quantity: [u64] New stock quantity
    pub fn update_quantity(ctx: Context<UpdateQuantity>, quantity: u64) -> Result<()> {
        update_quantity::handler(ctx, quantity)
    }

    /// Purchase an item, transfer SOL from buyer to authority, and reduce quantity
    ///
    /// Accounts:
    /// 0. `[writable]` item: [Item] 
    /// 1. `[writable, signer]` buyer: [AccountInfo] Buyer who is purchasing the item
    /// 2. `[writable]` item_authority: [AccountInfo] Authority who receives payment
    /// 3. `[]` system_program: [AccountInfo] System program for transfer
    ///
    /// Data:
    /// - quantity: [u64] Quantity to purchase
    pub fn purchase_item(ctx: Context<PurchaseItem>, quantity: u64) -> Result<()> {
        purchase_item::handler(ctx, quantity)
    }

    /// Remove an item from the inventory (only authority)
    ///
    /// Accounts:
    /// 0. `[writable]` item: [Item] 
    /// 1. `[writable, signer]` authority: [AccountInfo] Authority of the item
    pub fn delete_item(ctx: Context<DeleteItem>) -> Result<()> {
        delete_item::handler(ctx)
    }
}