
use anchor_lang::prelude::*;

#[account]
pub struct Item {
	pub id: u64,
	pub name: String,
	pub quantity: u64,
	pub price: u64,
	pub authority: Pubkey,
}
