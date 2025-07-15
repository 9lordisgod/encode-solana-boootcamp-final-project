use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

#[derive(Accounts)]
#[instruction(
    quantity: u64,
)]
pub struct UpdateQuantity<'info> {
    #[account(
        mut,
        constraint = item.authority == authority.key() @ SolanaMarketplaceError::UnauthorizedAccess
    )]
    pub item: Account<'info, Item>,

    pub authority: Signer<'info>,
}

/// Update the stock quantity of an existing item
///
/// Accounts:
/// 0. `[writable]` item: [Item] 
/// 1. `[signer]` authority: [AccountInfo] Authority of the item
///
/// Data:
/// - quantity: [u64] New stock quantity
pub fn handler(
    ctx: Context<UpdateQuantity>,
    quantity: u64,
) -> Result<()> {
    // Validate inputs
    if quantity == 0 {
        return err!(SolanaMarketplaceError::InvalidQuantity);
    }

    // Update the item quantity
    let item = &mut ctx.accounts.item;
    item.quantity = quantity;

    msg!("Updated quantity for item ID {}: new quantity = {}", item.id, quantity);
    
    Ok(())
}