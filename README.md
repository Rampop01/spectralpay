# SpectralPay - Privacy-First Salary Payments on Starknet

A decentralized platform for anonymous salary payments built on Starknet, enabling workers to earn without revealing their identity and employers to hire based purely on skills.

## Features

- **Anonymous Worker Profiles**: Create pseudonymous identities with verified skills using zero-knowledge proofs
- **Job Marketplace**: Post and browse jobs with complete privacy protection
- **Smart Escrow**: Automated payment release upon work verification
- **Reputation System**: Build credibility through quality work without exposing personal data
- **Starknet Integration**: Full wallet connection and contract interaction

## Smart Contracts

The platform uses four main smart contracts deployed on Starknet:

1. **JobMarketplace**: Handles job posting, applications, work submission, and approval
2. **PseudonymRegistry**: Manages worker pseudonyms, skills, and reputation
3. **Escrow**: Handles payment escrow, release, and disputes
4. **ZKVerifier**: Verifies zero-knowledge proofs for skills and identity

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Starknet wallet (ArgentX or Braavos)
- Starknet testnet tokens (for Sepolia)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Copy `.env.example` to `.env.local` and configure:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. Update the contract addresses in `.env.local` with your deployed contract addresses

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

See `.env.example` for required environment variables:

- `NEXT_PUBLIC_STARKNET_NETWORK`: Network to connect to (sepolia/mainnet)
- `NEXT_PUBLIC_JOB_MARKETPLACE_ADDRESS`: JobMarketplace contract address
- `NEXT_PUBLIC_PSEUDONYM_REGISTRY_ADDRESS`: PseudonymRegistry contract address
- `NEXT_PUBLIC_ESCROW_ADDRESS`: Escrow contract address
- `NEXT_PUBLIC_ZK_VERIFIER_ADDRESS`: ZKVerifier contract address

## Usage

### For Workers

1. **Connect Wallet**: Click "Connect Wallet" and approve the connection
2. **Register Pseudonym**: Create your anonymous worker profile
3. **Browse Jobs**: Find jobs that match your skills
4. **Apply**: Submit applications with ZK proofs of your skills
5. **Complete Work**: Deliver quality work and get paid automatically

### For Employers

1. **Connect Wallet**: Connect your Starknet wallet
2. **Post Job**: Create a job listing with requirements and budget
3. **Fund Escrow**: Deposit payment into smart contract escrow
4. **Review Applications**: Evaluate anonymous candidates based on skills
5. **Approve Work**: Verify deliverables and release payment

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Blockchain**: Starknet, starknet.js
- **Wallet**: get-starknet (ArgentX, Braavos)

## Contract Integration

The platform integrates with Starknet smart contracts using:

- Custom React hooks for contract interactions
- Wallet connection context provider
- ABI-based contract calls
- Transaction status tracking

## Security

- All worker identities are pseudonymous
- Zero-knowledge proofs verify skills without revealing personal data
- Smart contract escrow protects both parties
- No personal information stored on-chain

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Documentation: [Read the docs]
- Community: [Join our Discord]

---

Built with privacy and fairness in mind. Powered by Starknet.
