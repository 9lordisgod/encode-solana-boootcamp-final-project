pub mod common;

use std::str::FromStr;
use {
    common::{
		get_program_test,
		solana_marketplace_ix_interface,
	},
    solana_program_test::tokio,
    solana_sdk::{
        account::Account, pubkey::Pubkey, rent::Rent, signature::Keypair, signer::Signer, system_program,
    },
};


#[tokio::test]
async fn delete_item_ix_success() {
	let mut program_test = get_program_test();

	// PROGRAMS
	program_test.prefer_bpf(true);

	program_test.add_program(
		"account_compression",
		Pubkey::from_str("cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK").unwrap(),
		None,
	);

	program_test.add_program(
		"noop",
		Pubkey::from_str("noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV").unwrap(),
		None,
	);

	// KEYPAIR
	let item_keypair = Keypair::new();
	let authority_keypair = Keypair::new();

	// PUBKEY
	let item_pubkey = item_keypair.pubkey();
	let authority_pubkey = authority_keypair.pubkey();

	// ACCOUNT PROGRAM TEST SETUP
	program_test.add_account(
		item_pubkey,
		Account {
			lamports: 1_000_000_000_000,
			data: vec![],
			owner: solana_marketplace_ix_interface::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	program_test.add_account(
		authority_pubkey,
		Account {
			lamports: 0,
			data: vec![],
			owner: system_program::ID,
			executable: false,
			rent_epoch: 0,
		},
	);

	// INSTRUCTIONS
	let (mut banks_client, _, recent_blockhash) = program_test.start().await;

	let ix = solana_marketplace_ix_interface::delete_item_ix_setup(
		&item_keypair,
		&authority_keypair,
		recent_blockhash,
	);

	let result = banks_client.process_transaction(ix).await;

	// ASSERTIONS
	assert!(result.is_ok());

}
