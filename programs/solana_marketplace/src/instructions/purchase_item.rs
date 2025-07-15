use crate::*;
use anchor_lang::prelude::*;
use std::str::FromStr;

#[derive(Accounts)]
#[instruction(
    quantity: u64,
)]
pub struct PurchaseItem<'info> {
    #[account(
        mut,
    )]
    pub item: Account<'info, Item>,

    #[account(
        mut,
    )]
    pub buyer: Signer<'info>,

    /// CHECK: This is the authority who receives payment
    #[account(
        mut,
        constraint = item_authority.key() == item.authority @ SolanaMarketplaceError::UnauthorizedAccess
    )]
    pub item_authority: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
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
pub fn handler(
    ctx: Context<PurchaseItem>,
    quantity: u64,
) -> Result<()> {
    // Validate inputs
    if quantity == 0 {
        return err!(SolanaMarketplaceError::InvalidQuantity);
    }

    let item = &mut ctx.accounts.item;
    
    // Check if there's enough quantity available
    if item.quantity < quantity {
        return err!(SolanaMarketplaceError::InsufficientQuantity);
    }

    // Calculate the total price
    let total_price = item.price.checked_mul(quantity)
        .ok_or(error!(SolanaMarketplaceError::InvalidPrice))?;

    // Transfer SOL from buyer to authority
    anchor_lang::system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.item_authority.to_account_info(),
            },
        ),
        total_price,
    )?;

    // Reduce the item quantity
    item.quantity = item.quantity.checked_sub(quantity)
        .ok_or(error!(SolanaMarketplaceError::InsufficientQuantity))?;

    msg!(
        "Purchased {} units of item ID {} for {} lamports",
        quantity,
        item.id,
        total_price
    );
    
    Ok(())
}