export const CONTRACTS = {
  JOB_MARKETPLACE: process.env.NEXT_PUBLIC_JOB_MARKETPLACE_ADDRESS || "0x060cfd7c5a94acbaa988968326bae89869ad74a7d8c94e6200f70f11ac7263db",
  PSEUDONYM_REGISTRY: process.env.NEXT_PUBLIC_PSEUDONYM_REGISTRY_ADDRESS || "0x04e2192d597f7c51434237bdfb04e79c2bcd9ae479d668b7aa96a01a5bb462e4",
  ESCROW: process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "0x056a0f319ede0a78a7d5c1bfff16f63b20eac6108916c638909db5cb76d582e6",
  ZK_VERIFIER: process.env.NEXT_PUBLIC_ZK_VERIFIER_ADDRESS || "0x01375604d2259c71c2712427454c2c4a208142dc6f0e7ba966c6965133cd6558",
}

export const NETWORK = process.env.NEXT_PUBLIC_STARKNET_NETWORK || "sepolia"
export const SEPOLIA_CHAIN_ID = "0x534e5f5345504f4c4941" // SN_SEPOLIA

export const BLOCK_EXPLORER_URL = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://sepolia.starkscan.co"

export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getExplorerUrl(address: string, type: "address" | "tx" = "address"): string {
  return `${BLOCK_EXPLORER_URL}/${type}/${address}`
}

// Network validation helper
export async function validateNetwork(account: any): Promise<boolean> {
  try {
    if (!account) return false
    
    const chainId = await account.getChainId()
    if (chainId !== SEPOLIA_CHAIN_ID) {
      alert(`Wrong network detected! Please switch to Starknet Sepolia testnet in your wallet.\n\nCurrent: ${chainId}\nExpected: ${SEPOLIA_CHAIN_ID}`)
      return false
    }
    return true
  } catch (error) {
    console.error("Failed to validate network:", error)
    alert("Could not verify network. Please ensure you're connected to Starknet Sepolia testnet.")
    return false
  }
}
