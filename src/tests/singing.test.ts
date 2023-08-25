import { DepositMessage, computeBlsToExecutionChangeDomain, computeDepositDomain, computeSigningRoot } from "../signing.ts";
import { getChainSetting } from "../settings.ts";
import { expect} from 'chai';

describe("Signing", () => {
    it("fork versions not equal to 4 bytes are not accepted (computeBlsToExecutionChangeDomain)", () => {
        expect(() => computeBlsToExecutionChangeDomain(
            new Uint8Array(3).fill(0), new Uint8Array(32).fill(0)
        )).to.throw("Fork version should be 4 bytes, got 3");
    });

    it("fork versions not equal to 4 bytes are not accepted (computeDepositDomain)", () => {
        expect(() => computeDepositDomain(
            new Uint8Array(3).fill(0)
        )).to.throw("Fork version should be 4 bytes, got 3");
    });

    it("domains not equal to 32 bytes are not accepted (computeSigningRoot)", () => {
        const forkVersion = new Uint8Array(4).fill(0);
        // We create a malformed domain by adding 4 bytes of 0 to the end of the domain.
        const malformedDomain = new Uint8Array([...computeDepositDomain(forkVersion), ...new Uint8Array(4).fill(0)]);
        const depositMessage = {
            pubkey: new Uint8Array(48).fill(0), // Mocked
            withdrawal_credentials: new Uint8Array(32).fill(0), // Mocked
            amount: 32 * 1e9
        };
        expect(() => computeSigningRoot(
            depositMessage, DepositMessage, malformedDomain
        )).to.throw("Domain should be 32 bytes, got 36");
    });

    it("bls to execution change domain is 32 bytes", () => {
        // Test with mainnet settings...
        const mainnetSetting = getChainSetting('mainnet');
        const blsToExecutionChangeDomain = computeBlsToExecutionChangeDomain(
            mainnetSetting.GENESIS_FORK_VERSION,
            mainnetSetting.GENESIS_VALIDATORS_ROOT
        );
        expect(blsToExecutionChangeDomain.length).to.equal(32);
    });
});
