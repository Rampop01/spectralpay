export const CONTRACTS = {
  JOB_MARKETPLACE: process.env.NEXT_PUBLIC_JOB_MARKETPLACE_ADDRESS || "",
  PSEUDONYM_REGISTRY: process.env.NEXT_PUBLIC_PSEUDONYM_REGISTRY_ADDRESS || "",
  ESCROW: process.env.NEXT_PUBLIC_ESCROW_ADDRESS || "",
  ZK_VERIFIER: process.env.NEXT_PUBLIC_ZK_VERIFIER_ADDRESS || "",
}

export const NETWORK = process.env.NEXT_PUBLIC_STARKNET_NETWORK || "sepolia"

export const BLOCK_EXPLORER_URL = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://sepolia.starkscan.co"

export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getExplorerUrl(address: string, type: "address" | "tx" = "address"): string {
  return `${BLOCK_EXPLORER_URL}/${type}/${address}`
}
