export const chains = {
  mainnet: 1,
  sepolia: 11155111,
};

export const disperseAddresses = {
  1: '0x10e073B64351bC4d84Ea329Aae6c37ae0A9cF052',
  11155111:
    import.meta.VITE_DISPERSE_SEPOLIA ||
    '0x24dD23A6DfA1246aFD3AF2a23750E51711EA0eaa',
};

export const scans = {
  1: 'https://etherscan.io/',
  11155111: 'https://sepolia.infura.io/v3/',
};

export const warnMessage = '*Supports eth and sepolia testnet*';
