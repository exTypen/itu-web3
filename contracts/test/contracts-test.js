// Hardhat test cases for the itu-web3-master/contracts
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
    let Token, token, owner, addr1, addr2;

    beforeEach(async function () {
        Token = await ethers.getContractFactory("Token");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        token = await Token.deploy();
    });

    it("Should assign the total supply of tokens to the owner", async function () {
        const ownerBalance = await token.balanceOf(owner.address);
        expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should transfer tokens between accounts", async function () {
        // Transfer 50 tokens from owner to addr1
        await token.transfer(addr1.address, 50);
        const addr1Balance = await token.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(50);

        // Transfer 50 tokens from addr1 to addr2
        await token.connect(addr1).transfer(addr2.address, 50);
        const addr2Balance = await token.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(50);
    });
});

describe("Pool Contract", function () {
    let Pool, TokenA, TokenB, pool, tokenA, tokenB, owner;

    beforeEach(async function () {
        TokenA = await ethers.getContractFactory("Token");
        TokenB = await ethers.getContractFactory("Token");
        Pool = await ethers.getContractFactory("Pool");

        [owner] = await ethers.getSigners();

        tokenA = await TokenA.deploy();
        tokenB = await TokenB.deploy();
        pool = await Pool.deploy();

        await pool.initialize(tokenA.address, tokenB.address);
    });

    it("Should initialize with token addresses", async function () {
        expect(await pool.tokenA()).to.equal(tokenA.address);
        expect(await pool.tokenB()).to.equal(tokenB.address);
    });

    it("Should handle liquidity addition correctly", async function () {
        await tokenA.approve(pool.address, 1000);
        await tokenB.approve(pool.address, 2000);

        await pool.addLiquidity(1000, 2000);

        const reserves = await pool.getReserves();
        expect(reserves[0]).to.equal(1000);
        expect(reserves[1]).to.equal(2000);
    });
});

describe("USDT Contract", function () {
    let USDT, usdt, owner, addr1;

    beforeEach(async function () {
        USDT = await ethers.getContractFactory("USDT");
        [owner, addr1] = await ethers.getSigners();
        usdt = await USDT.deploy();
    });

    it("Should have 6 decimals", async function () {
        expect(await usdt.decimals()).to.equal(6);
    });

    it("Should allow the owner to mint tokens", async function () {
        await usdt.mint(addr1.address, 1000000);
        const addr1Balance = await usdt.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(1000000);
    });
});
