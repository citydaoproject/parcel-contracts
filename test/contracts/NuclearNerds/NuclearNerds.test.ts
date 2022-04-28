import { expect, assert} from "chai";
import { Signer } from "ethers";
import { ethers, waffle, network} from "hardhat";
import { MerkleTree } from 'merkletreejs';
import merkle_leaves from '/home/slyracoon23/Documents/CityDao/parcel-0/parcel-contracts/test/contracts/NuclearNerds/merkle-leaves.json';
import keccak256 from 'keccak256';
import { isSetIterator } from "util/types";
import { DefaultDeserializer } from "v8";
import { constants } from "os";
import { hexStripZeros } from "ethers/lib/utils";

// https://docs.ethers.io/v5/api/utils/hashing/#utils-solidityKeccak256
function hashToken(tokenId, account) {
    return Buffer.from(ethers.utils.solidityKeccak256(['uint256', 'address'], [tokenId, account]).slice(2), 'hex')
  }


describe("NuclearNerds", () => {

    /* Local Variables */

    let admin;
    let owner;
    let other;

    let nuclear_nerds; 
    let nuclear_nerds_contract;

    let merkle_tree;
    let merkle_proof; 

    let time_period;
    let timestamp;



    before('setup signers and Deploy', async () => {
        /* Setup */
        [ owner, admin, other] = await ethers.getSigners();


        /* Compute Merkle Tree */

        merkle_tree = new MerkleTree(Object.entries(merkle_leaves).map(leaf =>hashToken(...leaf)), keccak256,{ sortPairs: true });



        /* Deploy*/

        // nuclear_nerds_contract = await ethers.getContractFactory("NuclearNerds");
    
        // /* TODO: Might add Fixtures to do deployment */
        // const args = ["", "0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000", (10*24*60*60).toString()] // Initialize args -- 10 Days
        // nuclear_nerds = await nuclear_nerds_contract.deploy(...args);


    });

    describe("allowlistMint", async () => {
        beforeEach( async function () {
            /* Deploy*/

           nuclear_nerds_contract = await ethers.getContractFactory("NuclearNerds");
       
           /* TODO: Might add Fixtures to do deployment */
           const args = ["", "0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000", (10*24*60*60).toString()] // Initialize args -- 10 Days
           nuclear_nerds = await nuclear_nerds_contract.deploy(...args);

           // Set merkleroot

           const MerkleRoot = merkle_tree.getHexRoot();

           await nuclear_nerds.setWhitelistMerkleRoot(MerkleRoot);


           
       });
      //  https://github.com/OpenZeppelin/workshops/blob/master/06-nft-merkle-drop/test/4-ERC721MerkleDrop.test.js
      // https://github.com/OpenZeppelin/workshops/blob/master/06-nft-merkle-drop/contracts/ERC721MerkleDrop.sol
        it('should mint if the merkle proof, account and token is correct', async () => {

            const tokenId = 0;

            const owner_proof = merkle_tree.getHexProof(hashToken(tokenId,owner.address));

            await expect( nuclear_nerds.whitelistMint(owner.address, tokenId,owner_proof))
                .to.emit(nuclear_nerds, 'Transfer')
                .withArgs(ethers.constants.AddressZero, owner.address, tokenId);

            
        });


        it('should fail if token is already minted', async () => {


            const tokenId = 0;

            const owner_proof = merkle_tree.getHexProof(hashToken(tokenId,owner.address));

            await nuclear_nerds.whitelistMint(owner.address, tokenId,owner_proof);

            await expect( nuclear_nerds.whitelistMint(owner.address, tokenId,owner_proof)).to.be.revertedWith(
                "ERC721: token already minted"
            );

        });
        it('should fail if token is not assigned to caller in merkle proof', async () => {

            const tokenId = 0;

            const owner_proof = merkle_tree.getHexProof(hashToken(tokenId,owner.address));


            await expect( nuclear_nerds.whitelistMint(other.address, tokenId,owner_proof)).to.be.revertedWith(
                "Invalid Merkle Tree proof supplied."
            );


        });
        // TOFIX
        it('should fail if contract is paused', async () => {

           // assert.fail();
        });
        
        it('should send a Transfer event', async () => {

        });
        // https://ethereum.stackexchange.com/questions/110859/how-do-i-retrieve-the-exact-gas-costs-spent-for-a-transaction-with-ethers-js
        it('should cost less than 400k gas', async () => {

            const tokenId = 0;

            const owner_proof = merkle_tree.getHexProof(hashToken(tokenId,owner.address));

            const tx = await nuclear_nerds.whitelistMint(owner.address, tokenId,owner_proof);

            const receipt = await tx.wait();

            expect(parseInt(receipt.gasUsed)).to.be.lessThan(100000); // ~ $12 at 40 GWEI and ETH: $3000

        });
    });


    describe("updateAllowlist", async () => {
        beforeEach( async function () {
             /* Deploy*/

            nuclear_nerds_contract = await ethers.getContractFactory("NuclearNerds");
        
            /* TODO: Might add Fixtures to do deployment */
            const args = ["", "0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000", (10*24*60*60).toString()] // Initialize args -- 10 Days
            nuclear_nerds = await nuclear_nerds_contract.deploy(...args);
        });

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

    describe('updateMintPeriod', async () => {
        beforeEach( async function () {
            /* Deploy*/

           

           nuclear_nerds_contract = await ethers.getContractFactory("NuclearNerds");
       
           /* TODO: Might add Fixtures to do deployment */
           time_period = 10*24*60*60;
           const args = ["", ethers.constants.AddressZero.toString(),ethers.constants.AddressZero.toString(), time_period.toString() ] // Initialize args -- 10 Days
           nuclear_nerds = await nuclear_nerds_contract.deploy(...args);
        
           const deployed_block = await ethers.provider.getBlock(nuclear_nerds.deployTransaction.blockNumber);
            
           timestamp = deployed_block.timestamp;
       });

        it("Should check mint period", async () => {


            expect( await nuclear_nerds.MINT_END_PERIOD()).to.be.eq(timestamp + time_period );
            
        });

        it("should set mint period", async () => {

            const time_period_extention = 100;

            await nuclear_nerds.setMintEndPeriod(timestamp + time_period + time_period_extention);

            expect( await nuclear_nerds.MINT_END_PERIOD()).to.be.eq(timestamp + time_period + time_period_extention );


        });
        /* https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/master/src/time.js */
        // https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat
        it('should fail if the mint period is in the past', async () => {

            
            const proof = ["0x0000000000000000000000000000000000000000000000000000000000000000"];
            const tokenId = 0;

            // Fast Forward Time
            await network.provider.send("evm_increaseTime", [time_period]);
            await network.provider.send("evm_mine");

            const latest_block = await ethers.provider.getBlock( await ethers.provider.getBlockNumber());

            const new_timestamp = latest_block.timestamp;

            await expect( nuclear_nerds.whitelistMint(owner.address, tokenId, proof)).to.be.revertedWith(
                "Mint Period has overlapsed"
            );

        });
        it('should fail if not set mint period is not called by owner', async () => {
            const time_period_extention = 100;

            await expect( nuclear_nerds.connect(other).setMintEndPeriod(timestamp + time_period + time_period_extention)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );



        });
        it("should send a MintPeriodChanged event", async () => {

            const time_period_extention = 100;


            await expect( nuclear_nerds.setMintEndPeriod(timestamp + time_period + time_period_extention))
            .to.emit(nuclear_nerds, "MintEndPeriodChanged")
            .withArgs(timestamp + time_period + time_period_extention);

        });
    });







});
