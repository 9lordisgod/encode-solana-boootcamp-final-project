use {
	solana_marketplace::{
			entry,
			ID as PROGRAM_ID,
	},
	solana_sdk::{
		entrypoint::{ProcessInstruction, ProgramResult},
		pubkey::Pubkey,
	},
	anchor_lang::prelude::AccountInfo,
	solana_program_test::*,
};

// Type alias for the entry function pointer used to convert the entry function into a ProcessInstruction function pointer.
pub type ProgramEntry = for<'info> fn(
	program_id: &Pubkey,
	accounts: &'info [AccountInfo<'info>],
	instruction_data: &[u8],
) -> ProgramResult;

// Macro to convert the entry function into a ProcessInstruction function pointer.
#[macro_export]
macro_rules! convert_entry {
	($entry:expr) => {
		// Use unsafe block to perform memory transmutation.
		unsafe { core::mem::transmute::<ProgramEntry, ProcessInstruction>($entry) }
	};
}

pub fn get_program_test() -> ProgramTest {
	let program_test = ProgramTest::new(
		"solana_marketplace",
		PROGRAM_ID,
		processor!(convert_entry!(entry)),
	);
	program_test
}
	
pub mod solana_marketplace_ix_interface {

	use {
		solana_sdk::{
			hash::Hash,
			signature::{Keypair, Signer},
			instruction::Instruction,
			pubkey::Pubkey,
			transaction::Transaction,
		},
		solana_marketplace::{
			ID as PROGRAM_ID,
			accounts as solana_marketplace_accounts,
			instruction as solana_marketplace_instruction,
		},
		anchor_lang::{
			prelude::*,
			InstructionData,
		}
	};

	pub fn create_item_ix_setup(
		authority: &Keypair,
		item: &Keypair,
		system_program: Pubkey,
		id: u64,
		name: &String,
		quantity: u64,
		price: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = solana_marketplace_accounts::CreateItem {
			authority: authority.pubkey(),
			item: item.pubkey(),
			system_program: system_program,
		};

		let data = 	solana_marketplace_instruction::CreateItem {
				id,
				name: name.clone(),
				quantity,
				price,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&authority.pubkey()),
		);

		transaction.sign(&[
			&authority,
			&item,
		], recent_blockhash);

		return transaction;
	}

	pub fn update_quantity_ix_setup(
		item: Pubkey,
		authority: &Keypair,
		quantity: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = solana_marketplace_accounts::UpdateQuantity {
			item: item,
			authority: authority.pubkey(),
		};

		let data = 	solana_marketplace_instruction::UpdateQuantity {
				quantity,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&item.pubkey()),
		);

		transaction.sign(&[
			&authority,
		], recent_blockhash);

		return transaction;
	}

	pub fn purchase_item_ix_setup(
		item: Pubkey,
		buyer: &Keypair,
		quantity: u64,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = solana_marketplace_accounts::PurchaseItem {
			item: item,
			buyer: buyer.pubkey(),
		};

		let data = 	solana_marketplace_instruction::PurchaseItem {
				quantity,
		};		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&item.pubkey()),
		);

		transaction.sign(&[
			&buyer,
		], recent_blockhash);

		return transaction;
	}

	pub fn delete_item_ix_setup(
		item: &Keypair,
		authority: &Keypair,
		recent_blockhash: Hash,
	) -> Transaction {
		let accounts = solana_marketplace_accounts::DeleteItem {
			item: item.pubkey(),
			authority: authority.pubkey(),
		};

		let data = solana_marketplace_instruction::DeleteItem;
		let instruction = Instruction::new_with_bytes(PROGRAM_ID, &data.data(), accounts.to_account_metas(None));
		let mut transaction = Transaction::new_with_payer(
			&[instruction], 
			Some(&item.pubkey()),
		);

		transaction.sign(&[
			&item,
			&authority,
		], recent_blockhash);

		return transaction;
	}

}
