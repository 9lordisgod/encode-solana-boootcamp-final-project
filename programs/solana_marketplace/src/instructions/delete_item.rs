use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

#[derive(Accounts)]
pub struct DeleteItem<'info> {
    #[account(
        mut,
        constraint = item.authority == authority.key() @ SolanaMarketplaceError::UnauthorizedAccess,
        close = authority,
    )]
    pub item: Account<'info, Item>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

/// Remove an item from the inventory (only authority)
///
/// Accounts:
/// 0. `[writable]` item: [Item] 
/// 1. `[writable, signer]` authority: [AccountInfo] Authority of the item
pub fn handler(
    ctx: Context<DeleteItem>,
) -> Result<()> {
    let item_id = ctx.accounts.item.id;
    msg!("Deleted item with ID: {}", item_id);
    
    // The account will be automatically closed and rent refunded to authority
    // due to the close = authority constraint
    
    Ok(())
}