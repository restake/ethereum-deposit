import { DOMAIN_BLS_TO_EXECUTION_CHANGE, DOMAIN_DEPOSIT, ETH2GWEI, MAX_DEPOSIT_AMOUNT, MIN_DEPOSIT_AMOUNT } from "../constants.ts"
import { expect } from 'chai';

it("domain deposit hex is 03000000", () => {
    expect(Buffer.from(DOMAIN_DEPOSIT).toString('hex')).to.equal("03000000");
});

it("domain bls to execution change hex is 0a000000", () => {
    expect(Buffer.from(DOMAIN_BLS_TO_EXECUTION_CHANGE).toString('hex')).to.equal("0a000000");
});

it("1 eth is equal to 1000000000 gwei", () => {
    expect(ETH2GWEI).to.equal(1000000000);
});

it("minimum deposit amount is equal to 1000000000 gwei", () => {
    expect(MIN_DEPOSIT_AMOUNT).to.equal(1000000000);
});

it("maximum deposit amount is equal to 32000000000 gwei", () => {
    expect(MAX_DEPOSIT_AMOUNT).to.equal(32000000000);
});
