import { getChainSetting, getDevnetChainSetting } from "../settings.ts";
import { expect } from 'chai';

describe("Settings", () => {
    it("mainnet chain settings are correct", () => {
        expect(getChainSetting('mainnet')).to.deep.equal({
            NETWORK_NAME: "mainnet",
            GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from('00000000', 'hex')),
            GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from('4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95', 'hex')),
        })
    });

    it("goerli chain settings are correct", () => {
        expect(getChainSetting('goerli')).to.deep.equal({
            NETWORK_NAME: "goerli",
            GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from('00001020', 'hex')),
            GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from('043db0d9a83813551ee2f33450d23797757d430911a9320530ad8a0eabc43efb', 'hex')),
        })
    });

    it("sepolia chain settings are correct", () => {
        expect(getChainSetting('sepolia')).to.deep.equal({
            NETWORK_NAME: "sepolia",
            GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from('90000069', 'hex')),
            GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from('d8ea171f3c94aea21ebc42a1ed61052acf3f9209c00e4efbaaddac09ed9b8078', 'hex')),
        })
    });

    it("zhejiang chain settings are correct", () => {
        expect(getChainSetting('zhejiang')).to.deep.equal({
            NETWORK_NAME: "zhejiang",
            GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from('00000069', 'hex')),
            GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from('53a92d8f2bb1d85f62d16a156e6ebcd1bcaba652d0900b2c2f387826f3481f6f', 'hex')),
        })
    });

    it("devnet chain settings are returned correctly", () => {
        const networkName = "devnet"
        const genesisForkVersion = "00000000"
        const genesisValidatorsRoot = "53a92d8f2bb1d85f62d16a156e6ebcd1bcaba652d0900b2c2f387826f3481fff"
        expect(getDevnetChainSetting(networkName, genesisForkVersion, genesisValidatorsRoot)).to.deep.equal({
            NETWORK_NAME: networkName,
            GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from(genesisForkVersion, 'hex')),
            GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from(genesisValidatorsRoot, 'hex')),
        })
    });
});
