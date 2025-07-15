use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

#[derive(Accounts)]
#[instruction(
    id: u64,
    name: String,
    quantity: u64,
    price: u64,
)]
pub struct CreateItem<'info> {
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + 8 + 4 + 50 + 8 + 8 + 32, // discriminator + id + name length + max name size + quantity + price + authority
    )]
    pub item: Account<'info, Item>,

    pub system_program: Program<'info, System>,
}

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
pub fn handler(
    ctx: Context<CreateItem>,
    id: u64,
    name: String,
    quantity: u64,
    price: u64,
) -> Result<()> {
    // Validate inputs
    if price == 0 {
        return err!(SolanaMarketplaceError::InvalidPrice);
    }

    if quantity == 0 {
        return err!(SolanaMarketplaceError::InvalidQuantity);
    }

    // Initialize the item account
    let item = &mut ctx.accounts.item;
    item.id = id;
    item.name = name;
    item.quantity = quantity;
    item.price = price;
    item.authority = ctx.accounts.authority.key();

    msg!("Created new item with ID: {}", id);
    
    Ok(())
}