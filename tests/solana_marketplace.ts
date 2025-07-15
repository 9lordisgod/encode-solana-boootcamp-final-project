import { AnchorProvider, BN, setProvider, web3 } from "@coral-xyz/anchor";
import * as solanaMarketplaceClient from "../app/program_client";
import chai from "chai";
import { assert, expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
chai.use(chaiAsPromised);

const programId = new web3.PublicKey("3sPVHWRvyqEoPHYMsEK34fexKXLeqiPtbDXGFyeTFF6L");

describe("solana_marketplace tests", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const systemWallet = (provider.wallet as NodeWallet).payer;
  const client = new solanaMarketplaceClient.Client(
    programId,
    provider
  );

  // Generate a new keypair for the item account
  const itemKeypair = web3.Keypair.generate();
  
  // Create a buyer wallet for testing purchases
  const buyerWallet = web3.Keypair.generate();
  
  // Test data
  const itemId = new BN(1);
  const itemName = "Test Item";
  const itemQuantity = new BN(10);
  const itemPrice = new BN(1000000); // 0.001 SOL in lamports
  
  before(async () => {
    // Airdrop SOL to the buyer wallet for testing
    const signature = await provider.connection.requestAirdrop(
      buyerWallet.publicKey,
      2 * web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  });

  it("Create a new item", async () => {
    await client.createItem(
      {
        authority: systemWallet,
        item: itemKeypair,
      },
      {
        id: itemId,
        name: itemName,
        quantity: itemQuantity,
        price: itemPrice,
      }
    );

    // Fetch the item account and verify its data
    const itemAccount = await client.fetchItem(itemKeypair.publicKey);
    
    expect(itemAccount.id.toString()).to.equal(itemId.toString());
    expect(itemAccount.name).to.equal(itemName);
    expect(itemAccount.quantity.toString()).to.equal(itemQuantity.toString());
    expect(itemAccount.price.toString()).to.equal(itemPrice.toString());
    expect(itemAccount.authority.toString()).to.equal(systemWallet.publicKey.toString());
  });

  it("Update item quantity", async () => {
    const newQuantity = new BN(20);
    
    await client.updateQuantity(
      {
        item: itemKeypair.publicKey,
        authority: systemWallet,
      },
      {
        quantity: newQuantity,
      }
    );

    // Fetch the item account and verify the updated quantity
    const itemAccount = await client.fetchItem(itemKeypair.publicKey);
    expect(itemAccount.quantity.toString()).to.equal(newQuantity.toString());
  });

  it("Purchase an item", async () => {
    const purchaseQuantity = new BN(2);
    const initialBuyerBalance = await provider.connection.getBalance(buyerWallet.publicKey);
    const initialAuthorityBalance = await provider.connection.getBalance(systemWallet.publicKey);
    
    // Create a provider for the buyer
    const buyerProvider = new AnchorProvider(
      provider.connection,
      new NodeWallet(buyerWallet),
      {}
    );
    const buyerClient = new solanaMarketplaceClient.Client(
      programId,
      buyerProvider
    );

    // Purchase the item
    await buyerClient.purchaseItem(
      {
        item: itemKeypair.publicKey,
        buyer: buyerWallet.publicKey,
        itemAuthority: systemWallet.publicKey,
      },
      {
        quantity: purchaseQuantity,
      }
    );

    // Fetch the item account and verify the updated quantity
    const itemAccount = await client.fetchItem(itemKeypair.publicKey);
    const expectedRemainingQuantity = new BN(20).sub(purchaseQuantity);
    expect(itemAccount.quantity.toString()).to.equal(expectedRemainingQuantity.toString());

    // Verify the SOL transfer
    const finalBuyerBalance = await provider.connection.getBalance(buyerWallet.publicKey);
    const finalAuthorityBalance = await provider.connection.getBalance(systemWallet.publicKey);
    
    // Calculate expected transfer amount (price * quantity)
    const expectedTransfer = itemPrice.mul(purchaseQuantity);
    
    // Account for transaction fees in the buyer's balance check
    expect(initialBuyerBalance - finalBuyerBalance).to.be.greaterThan(expectedTransfer.toNumber());
    expect(finalAuthorityBalance - initialAuthorityBalance).to.equal(expectedTransfer.toNumber());
  });

  it("Fails when trying to purchase more than available quantity", async () => {
    const excessiveQuantity = new BN(100);
    
    // Create a provider for the buyer
    const buyerProvider = new AnchorProvider(
      provider.connection,
      new NodeWallet(buyerWallet),
      {}
    );
    const buyerClient = new solanaMarketplaceClient.Client(
      programId,
      buyerProvider
    );

    // Attempt to purchase more than available
    await expect(
      buyerClient.purchaseItem(
        {
          item: itemKeypair.publicKey,
          buyer: buyerWallet.publicKey,
          itemAuthority: systemWallet.publicKey,
        },
        {
          quantity: excessiveQuantity,
        }
      )
    ).to.be.rejected;
  });

  it("Fails when unauthorized user tries to update quantity", async () => {
    const newQuantity = new BN(30);
    
    // Create a provider for the buyer (who is not the authority)
    const buyerProvider = new AnchorProvider(
      provider.connection,
      new NodeWallet(buyerWallet),
      {}
    );
    const buyerClient = new solanaMarketplaceClient.Client(
      programId,
      buyerProvider
    );

    // Attempt to update quantity as non-authority
    await expect(
      buyerClient.updateQuantity(
        {
          item: itemKeypair.publicKey,
          authority: buyerWallet.publicKey,
        },
        {
          quantity: newQuantity,
        }
      )
    ).to.be.rejected;
  });

  it("Delete an item", async () => {
    await client.deleteItem({
      item: itemKeypair.publicKey,
      authority: systemWallet,
    });

    // Verify the account no longer exists
    const accountInfo = await provider.connection.getAccountInfo(itemKeypair.publicKey);
    expect(accountInfo).to.be.null;
  });
});