export const BSC_MAINNET = {
  chainId: 56,
  chainIdHex: "0x38",
  chainName: "BNB Smart Chain Mainnet",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },
  rpcUrls: ["https://bsc-dataseed.bnbchain.org"],
  blockExplorerUrls: ["https://bscscan.com"]
};

export async function ensureBsc(provider, onRequest = () => {}) {
  onRequest("eth_chainId");
  const currentChainId = await provider.request({ method: "eth_chainId" });
  if (Number(currentChainId) === BSC_MAINNET.chainId) return currentChainId;

  try {
    onRequest("wallet_switchEthereumChain");
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_MAINNET.chainIdHex }]
    });
  } catch (error) {
    if (Number(error?.code) !== 4902) throw error;

    onRequest("wallet_addEthereumChain");
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: BSC_MAINNET.chainIdHex,
          chainName: BSC_MAINNET.chainName,
          nativeCurrency: BSC_MAINNET.nativeCurrency,
          rpcUrls: BSC_MAINNET.rpcUrls,
          blockExplorerUrls: BSC_MAINNET.blockExplorerUrls
        }
      ]
    });
  }

  onRequest("eth_chainId");
  return provider.request({ method: "eth_chainId" });
}

export function readableError(error) {
  return (
    error?.shortMessage ??
    error?.reason ??
    error?.message ??
    error?.data?.message ??
    String(error)
  );
}
