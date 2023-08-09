export const DOMAIN_DEPOSIT = new Uint8Array(Buffer.from('03000000', 'hex'));
export const DOMAIN_BLS_TO_EXECUTION_CHANGE = new Uint8Array(Buffer.from('0A000000', 'hex'));

export const ETH2WEI = 10 ** 18
export const MIN_DEPOSIT_AMOUNT = 2 ** 0 * ETH2WEI
export const MAX_DEPOSIT_AMOUNT = 2 ** 5 * ETH2WEI
