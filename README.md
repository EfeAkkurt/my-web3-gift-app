# 🎁 GiftingStar - Stellar Soroban Gift DApp

![GiftingStar Banner](./giftingstar_banner.png)

GiftingStar is a Web3 decentralized application (dApp) that allows you to schedule and send XLM gifts to your loved ones automatically on special occasions like birthdays, anniversaries, Valentine’s Day, and more. Built with **Stellar**, **Soroban**, and **Next.js**, this DApp brings together smart contracts and blockchain security with a sleek modern interface.

---

## 📚 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#️-usage)
- [Smart Contract Functions](#-smart-contract-functions)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Development](#-development)
- [Supported Special Days](#-supported-special-days)
- [Security](#-security)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🚀 Features

- 🌐 Modern interface built with Next.js
- 📜 Smart contracts written in Rust using Soroban
- 🔑 Cargo and Soroban CLI integration
- 🎯 Gift scheduling for specific occasions
- 📅 Support for birthdays, Valentine’s Day, anniversaries, and more
- 💰 Send XLM token gifts
- 🎨 Built with Tailwind CSS for sleek UI
- 🔒 Blockchain-level security and validations
- ⏰ Automatic gift delivery

---

## 📂 Project Structure
my-web3-gift-app/
├── contract/             # Rust/Soroban smart contract
│   ├── src/
│   │   └── lib.rs        # Main contract logic
│   └── Cargo.toml        # Rust dependencies
├── app/                  # Next.js frontend
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── tailwind.config.js
├── package.json
└── README.md

---

## 🛠️ Installation

1️⃣ **Clone the repository**:
```bash
git clone https://github.com/EfeAkkurt/my-web3-gift-app.git
cd my-web3-gift-app

2️⃣ Install frontend dependencies:
npm install

3️⃣ Install Rust and Soroban CLI:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
cargo install --locked soroban-cli

4️⃣ Build the smart contract:
npm run build:contract

5️⃣ Start the development server:
npm run dev

⚙️ Usage

Frontend Interaction
	1.	Connect Wallet: Click “Connect Freighter Wallet”
	2.	Schedule a Gift:
	•	Choose “New Gift Schedule”
	•	Enter recipient’s wallet address
	•	Select XLM amount
	•	Pick a special occasion and delivery date
	•	(Optional) Add a message
	3.	Manage Gifts: View, send, or cancel scheduled gifts

⸻

📜 Smart Contract Functions
// Schedule a gift
schedule_gift(sender, recipient, amount, special_day, date, description)

// Send a gift
send_gift(gift_id, sender)

// Cancel a scheduled gift
cancel_gift(gift_id, sender)

// Get all gifts of a user
get_user_gifts(user_address)

// Get gift details
get_gift(gift_id)

🧪 Testing

Run contract tests:
npm run test:contract

Check TypeScript types:
npm run type-check

🚀 Deployment

Testnet
npm run deploy:testnet
npm run build  # For frontend (e.g., Vercel)

Mainnet
soroban contract deploy --wasm contract/target/wasm32-unknown-unknown/release/gifting_contract.wasm --source-account default --network mainnet

🔧 Development
Format code:
npm run format
npm run format:check

Lint:
npm run lint

📱 Supported Special Days
	•	💒 Wedding Anniversary
	•	💝 Valentine’s Day
	•	🎂 Birthday
	•	🎊 New Year
	•	👩‍👧‍👦 Mother’s Day
	•	👨‍👧‍👦 Father’s Day
	•	🎓 Graduation
	•	⭐ Custom Occasion

 🛡️ Security
	•	✅ Freighter wallet integration
	•	✅ Smart contract level authorization
	•	✅ Address, amount, and date validation
	•	✅ Secure gift scheduling and delivery logic

⸻

👨‍💻 Contributors
	•	@EfeAkkurt – Creator and Lead Developer

⸻

📄 License

This project is licensed under the MIT License.

⸻

💡 A heartfelt way to automate generosity — powered by blockchain.
---

Let me know if you'd like the README exported as a file or need additional assets like icons or documentation pages. |oai:code-citation|
