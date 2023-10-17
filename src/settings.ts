export type BaseChainSetting = {
  NETWORK_NAME: string;
  GENESIS_FORK_VERSION: Uint8Array;
  GENESIS_VALIDATORS_ROOT: Uint8Array;
};

const MAINNET = "mainnet";
const GOERLI = "goerli";
const PRATER = "prater";
const SEPOLIA = "sepolia";
const ZHEJIANG = "zhejiang";
const HOLESKY = "holesky";

const MainnetSetting: BaseChainSetting = {
    NETWORK_NAME: MAINNET,
    GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from("00000000", "hex")),
    GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from("4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95", "hex")),
};

const GoerliSetting: BaseChainSetting = {
    NETWORK_NAME: GOERLI,
    GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from("00001020", "hex")),
    GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from("043db0d9a83813551ee2f33450d23797757d430911a9320530ad8a0eabc43efb", "hex")),
};

const SepoliaSetting: BaseChainSetting = {
    NETWORK_NAME: SEPOLIA,
    GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from("90000069", "hex")),
    GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from("d8ea171f3c94aea21ebc42a1ed61052acf3f9209c00e4efbaaddac09ed9b8078", "hex")),
};

const ZhejiangSetting: BaseChainSetting = {
    NETWORK_NAME: ZHEJIANG,
    GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from("00000069", "hex")),
    GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from("53a92d8f2bb1d85f62d16a156e6ebcd1bcaba652d0900b2c2f387826f3481f6f", "hex")),
};

const HoleskySetting: BaseChainSetting = {
    NETWORK_NAME: HOLESKY,
    GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from("01017000", "hex")),
    GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from("9143aa7c615a7f7115e2b6aac319c03529df8242ae705fba9df39b79c59fa8b1", "hex")),
};

const ALL_CHAINS: Record<string, BaseChainSetting> = {
    [MAINNET]: MainnetSetting,
    [GOERLI]: GoerliSetting,
    [PRATER]: GoerliSetting,
    [SEPOLIA]: SepoliaSetting,
    [ZHEJIANG]: ZhejiangSetting,
    [HOLESKY]: HoleskySetting,
};

export function getChainSetting(chainName: string = MAINNET): BaseChainSetting {
    return ALL_CHAINS[chainName];
}

export function getDevnetChainSetting(
    networkName: string,
    genesisForkVersion: string,
    genesisValidatorRoot: string,
): BaseChainSetting {
    return {
        NETWORK_NAME: networkName,
        GENESIS_FORK_VERSION: Uint8Array.from(Buffer.from(genesisForkVersion, "hex")),
        GENESIS_VALIDATORS_ROOT: Uint8Array.from(Buffer.from(genesisValidatorRoot, "hex")),
    };
}
