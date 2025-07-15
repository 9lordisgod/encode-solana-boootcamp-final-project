// This file is auto-generated from the CIDL source.
// Editing this file directly is not recommended as it may be overwritten.
//
// Docs: https://docs.codigo.ai/c%C3%B3digo-interface-description-language/specification#errors

use anchor_lang::prelude::*;

#[error_code]
pub enum SolanaMarketplaceError {
	#[msg("Only the authority can perform this action")]
	UnauthorizedAccess,
	#[msg("Not enough quantity available for purchase")]
	InsufficientQuantity,
	#[msg("Price must be greater than zero")]
	InvalidPrice,
	#[msg("Quantity must be greater than zero")]
	InvalidQuantity,
}
