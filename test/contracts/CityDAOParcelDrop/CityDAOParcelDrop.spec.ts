import { expect } from "chai";
import { ethers, network } from "hardhat";
import { MerkleTree } from 'merkletreejs';
import merkle_leaves from './merkle-leaves.json';
import keccak256 from 'keccak256';

// https://docs.ethers.io/v5/api/utils/hashing/#utils-solidityKeccak256
function hashToken(address, allowance) {
    return Buffer.from(ethers.utils.solidityKeccak256(['address', 'uint256'], [address, allowance]).slice(2), 'hex')
}

describe("CityDAOParcelDrop", () => {

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
        [owner, admin, other] = await ethers.getSigners();

        /* Compute Merkle Tree */
        merkle_tree = new MerkleTree(Object.entries(merkle_leaves).map(leaf => hashToken(...leaf)), keccak256, { sortPairs: true });

    });

    describe("allowlistMint", async () => {
        beforeEach(async function () {
            /* Deploy*/
            nuclear_nerds_contract = await ethers.getContractFactory("CityDAOParcelDrop");

            time_period = 10 * 24 * 60 * 60; // 10 DAYS
            const args = ["", time_period.toString()] // Initialize args -- 10 Days
            nuclear_nerds = await nuclear_nerds_contract.deploy(...args);

            // Set merkleroot
            const MerkleRoot = merkle_tree.getHexRoot();

            await nuclear_nerds.setWhitelistMerkleRoot(MerkleRoot);



        });
        // https://github.com/OpenZeppelin/workshops/blob/master/06-nft-merkle-drop/test/4-ERC721MerkleDrop.test.js
        // https://github.com/OpenZeppelin/workshops/blob/master/06-nft-merkle-drop/contracts/ERC721MerkleDrop.sol
        it('should mint if the merkle proof, account and token is correct', async () => {

            const allowance = 1;
            const count = 1;

            const owner_proof = merkle_tree.getHexProof(hashToken(owner.address, allowance));

            await expect(nuclear_nerds.whitelistMint(owner.address,count,  allowance, owner_proof))
                .to.emit(nuclear_nerds, 'Transfer')
                .withArgs(ethers.constants.AddressZero, owner.address, 0);


        });


        it('should mint if other caller is in merkle proof', async () => {

            const allowance = 3;
            const count = 1;
            
            
            const other_proof = merkle_tree.getHexProof(hashToken(other.address, allowance));


            await expect(nuclear_nerds.whitelistMint(other.address, count,  allowance, other_proof))
                .to.emit(nuclear_nerds, 'Transfer')
                .withArgs(ethers.constants.AddressZero, other.address, 0);


        });
        it('should fail if token is already minted', async () => {


            const allowance = 1;
            const count = 1;

            const owner_proof = merkle_tree.getHexProof(hashToken(owner.address, allowance));

            await nuclear_nerds.whitelistMint(owner.address,count,  allowance, owner_proof)

            await expect(nuclear_nerds.whitelistMint(owner.address,count,  allowance, owner_proof)).to.be.revertedWith(
                "Exceeds whitelist allowance"
            );

        });


        it('should fail if token is not assigned to caller in merkle proof', async () => {

            const allowance = 1;
            const count = 1;

            const owner_proof = merkle_tree.getHexProof(hashToken(owner.address, allowance));


            await expect(nuclear_nerds.whitelistMint(other.address,count,  allowance, owner_proof)).to.be.revertedWith(
                "Invalid Merkle Tree proof supplied."
            );


        });
        // https://ethereum.stackexchange.com/questions/110859/how-do-i-retrieve-the-exact-gas-costs-spent-for-a-transaction-with-ethers-js
        it('should cost less than 150k gas', async () => {

            const allowance = 1;
            const count = 1;

            const owner_proof = merkle_tree.getHexProof(hashToken(owner.address, allowance));

            const tx = await nuclear_nerds.whitelistMint(owner.address, count,  allowance, owner_proof);

            const receipt = await tx.wait();

            expect(parseInt(receipt.gasUsed)).to.be.lessThan(150000); // ~ $12 at 40 GWEI and ETH: $3000

        });
    });


    describe("updateAllowlist", async () => {
        beforeEach(async function () {
            /* Deploy*/
            nuclear_nerds_contract = await ethers.getContractFactory("CityDAOParcelDrop");

            time_period = 10 * 24 * 60 * 60; // 10 DAYS
            const args = ["", time_period.toString()] // Initialize args -- 10 Days
            nuclear_nerds = await nuclear_nerds_contract.deploy(...args);
        });

        it("should set Merkle Root", async () => {
            const merkle_root = "0x0000000000000000000000000000000000000000000000000000000000000000";// 32 bytes or 64 hex long https://stackoverflow.com/questions/50320528/how-can-a-32-bytes-address-represent-more-than-32-characters

            await nuclear_nerds.setWhitelistMerkleRoot(merkle_root);

            expect(await nuclear_nerds.whitelistMerkleRoot()).to.eq(merkle_root);
        });

        it("should fail if not called by parcel owner", async () => {
            const merkle_root = "0x0000000000000000000000000000000000000000000000000000000000000000";


            await expect(nuclear_nerds.connect(other).setWhitelistMerkleRoot(merkle_root)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );

        });
        it("should send an AllowListChanged event", async () => {
            const merkle_root = "0x0000000000000000000000000000000000000000000000000000000000000000";// 32 bytes or 64 hex long https://stackoverflow.com/questions/50320528/how-can-a-32-bytes-address-represent-more-than-32-characters

            await expect(nuclear_nerds.setWhitelistMerkleRoot(merkle_root))
                .to.emit(nuclear_nerds, "MerkleRootChanged")
                .withArgs(merkle_root);

        });
    });

    describe('updateMintPeriod', async () => {
        beforeEach(async function () {
            /* Deploy*/
            nuclear_nerds_contract = await ethers.getContractFactory("CityDAOParcelDrop");

            time_period = 10 * 24 * 60 * 60;
            const args = ["", time_period.toString()] // Initialize args -- 10 Days
            nuclear_nerds = await nuclear_nerds_contract.deploy(...args);

            const deployed_block = await ethers.provider.getBlock(nuclear_nerds.deployTransaction.blockNumber);

            timestamp = deployed_block.timestamp;
        });

        it("Should check mint period", async () => {

            expect(await nuclear_nerds.MINT_END_PERIOD()).to.be.eq(timestamp + time_period);

        });

        it("should set mint period", async () => {

            const time_period_extention = 100;

            await nuclear_nerds.setMintEndPeriod(timestamp + time_period + time_period_extention);

            expect(await nuclear_nerds.MINT_END_PERIOD()).to.be.eq(timestamp + time_period + time_period_extention);


        });
        /* https://github.com/OpenZeppelin/openzeppelin-test-helpers/blob/master/src/time.js */
        // https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat
        it('should fail if the mint period is in the past', async () => {


            const proof = ["0x0000000000000000000000000000000000000000000000000000000000000000"];
            const allowance = 1;
            const count = 1;
            
            // Fast Forward Time
            await network.provider.send("evm_increaseTime", [time_period]);
            await network.provider.send("evm_mine");

            const latest_block = await ethers.provider.getBlock(await ethers.provider.getBlockNumber());

            const new_timestamp = latest_block.timestamp;

            await expect(nuclear_nerds.whitelistMint(owner.address, count,  allowance, proof)).to.be.revertedWith(
                "Mint Period has overlapsed"
            );

        });
        it('should fail if not set mint period is not called by owner', async () => {
            const time_period_extention = 100;

            await expect(nuclear_nerds.connect(other).setMintEndPeriod(timestamp + time_period + time_period_extention)).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );

        });
        it("should send a MintPeriodChanged event", async () => {

            const time_period_extention = 100;

            await expect(nuclear_nerds.setMintEndPeriod(timestamp + time_period + time_period_extention))
                .to.emit(nuclear_nerds, "MintEndPeriodChanged")
                .withArgs(timestamp + time_period + time_period_extention);

        });
    });

    describe('baseURI', async () => {
        beforeEach(async function () {
             /* Deploy*/
             nuclear_nerds_contract = await ethers.getContractFactory("CityDAOParcelDrop");

             time_period = 10 * 24 * 60 * 60; // 10 DAYS
             const args = ["https://base.com/", time_period.toString()] // Initialize args -- 10 Days
             nuclear_nerds = await nuclear_nerds_contract.deploy(...args);
 
             // Set merkleroot
             const MerkleRoot = merkle_tree.getHexRoot();
 
             await nuclear_nerds.setWhitelistMerkleRoot(MerkleRoot);
        });

        it('should have correct tokenURI', async () => {

            const allowance = 1;
            const count = 1;

            const owner_proof = merkle_tree.getHexProof(hashToken(owner.address, allowance));

            await nuclear_nerds.whitelistMint(owner.address,count,  allowance, owner_proof);

            const tokenId = 0;            
            expect(await nuclear_nerds.tokenURI(tokenId)).to.be.eq("https://base.com/" + tokenId.toString());
            
        });

    });


});
