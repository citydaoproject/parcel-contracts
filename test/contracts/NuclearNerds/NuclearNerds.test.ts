import { expect } from "chai";
import { Signer } from "ethers";
import { ethers, waffle } from "hardhat";
import { DefaultDeserializer } from "v8";


describe("NuclearNerds", () => {

    /* Local Variables */

    let admin;
    let owner;
    let other;

    let nuclear_nerds; 
    let nuclear_nerds_contract;

    before('setup signers and Deploy', async () => {
        /* Setup */
        [ owner, admin, other] = await ethers.getSigners();


        /* Deploy*/

        nuclear_nerds_contract = await ethers.getContractFactory("NuclearNerds");
    
        /* TODO: Might add Fixtures to do deployment */
        const args = ["", "0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000"] // Initialize args
        nuclear_nerds = await nuclear_nerds_contract.deploy(...args);


    });

    describe("allowlistMint", async () => {
        it('should mint if the merkle proof is correct for the account minting', async () => {


            
        });
        it('should mint if the caller is in the merkle tree', async () => {});
        it('should mint if the tokenId is in the merkle tree for the caller and has not been minted yet', async () => {});
        it("Caller must be in whitelist", async () => {

        });

        it('should fail if token is already minted', async () => {});
        it('should fail if token is not assigned to caller in merkle proof', async () => {});
        it('should fail if contract is paused', async () => {

            await nuclear_nerds.setPause();

            const args = [1, 1, ["0x0000000000000000000000000000000000000000000000000000000000000000"]];
            await expect( nuclear_nerds.whitelistMint(...args)).to.be.revertedWith(
                'Pausable: paused'
            );
            
        });
        
        it('should send a Transfer event', async () => {});

        it('should cost less than 400k gas', async () => {});
    });


    describe("updateAllowlist", async () => {
        it("should set Merkle Root", async () => {
            const merkle_root = "0x0000000000000000000000000000000000000000000000000000000000000000";// 32 bytes or 64 hex long https://stackoverflow.com/questions/50320528/how-can-a-32-bytes-address-represent-more-than-32-characters

            await nuclear_nerds.setWhitelistMerkleRoot(merkle_root);

            expect( await nuclear_nerds.whitelistMerkleRoot()).to.eq(merkle_root);
        });

        it("should fail if not called by parcel owner", async () => {
            const merkle_root = "0x0000000000000000000000000000000000000000000000000000000000000000";


            await expect( nuclear_nerds.connect(other).setWhitelistMerkleRoot(merkle_root)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );

        });
        it("should send an AllowListChanged event", async () => {
            const merkle_root = "0x0000000000000000000000000000000000000000000000000000000000000000";// 32 bytes or 64 hex long https://stackoverflow.com/questions/50320528/how-can-a-32-bytes-address-represent-more-than-32-characters

            await expect( nuclear_nerds.setWhitelistMerkleRoot(merkle_root))
                .to.emit(nuclear_nerds, "MerkleRootChanged")
                .withArgs(merkle_root);


        });
    });

    describe('Pause/Unpause', async () => {

        /* TOFIX: Shared state with pause function ORDER matters -- Maybe change it */
        it("should set pause when unpaused", async () => {

            await nuclear_nerds.setUnpause();

            expect(await nuclear_nerds.paused()).to.eq(false);


        });
         
        /* TOFIX: Shared state with pause function  ORDER Matters -- Maybe change it */
        it("should set pause when unpaused", async () => {
            
            await nuclear_nerds.setPause();
            
            expect(await nuclear_nerds.paused()).to.eq(true);
            
            
            
        });

        // it('should fail if the mint period is in the past', async () => {

        // });
        
        it('should fail if not called by parcel owner', async () => {
            await expect( nuclear_nerds.connect(other).setPause()).to.be.revertedWith(
                'Ownable: caller is not the owner'
            );

        });
        it("should send a paused event", async () => {

        });
    });






});
