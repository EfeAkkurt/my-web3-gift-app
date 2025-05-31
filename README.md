🎁 GiftingStar - Stellar Soroban Gift DApp

This project is a gift scheduling dApp built using Stellar and Soroban. It allows you to automatically send gifts to your loved ones on special occasions.

⸻

🚀 Features
	•	🌐 Modern interface built with Next.js
	•	📜 Smart contracts written in Rust / Soroban
	•	🔑 Cargo integration
	•	🎯 Gift scheduling for special occasions
	•	📅 Support for anniversaries, Valentine’s Day, birthdays, and more
	•	💰 Send XLM token gifts
	•	🎨 Stylish and user-friendly UI (built with Tailwind CSS)
	•	🔒 Blockchain-level security
	•	⏰ Automatic gift delivery

⸻

📂 Project Structure
/
├── contract/             # Rust/Soroban smart contract code
│   ├── src/
│   │   └── lib.rs        # Main contract logic
│   └── Cargo.toml        # Rust dependencies
├── app/                  # Next.js frontend app
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Layout component
│   └── globals.css       # Global styles
├── tailwind.config.js    # Tailwind configuration
├── package.json          # Node.js dependencies
└── README.md             # This documentation
git clone https://github.com/EfeAkkurt/.git

🛠️ Setup

1️⃣ Clone the repository:
cd gifting-star-dapp
git clone https://github.com/yourusername/my-web3-gift-app.git
cd gifting-star-dapp
2️⃣ Install dependencies:
npm install
3️⃣ Install Rust and Soroban CLI:
# Rust installation
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli

4️⃣ # Build the smart contract:
npm run build:contract

5️⃣ # Start the development server:
npm run dev

⚙️ # Usage

Frontend Usage

Connect Wallet: Click the “Connect Freighter Wallet” button on the homepage.
Schedule Gift:
	•	Click “New Gift Schedule”
	•	Enter recipient address
	•	Define the XLM amount to send
	•	Select a special day (Anniversary, Valentine’s Day, etc.)
	•	Choose a send date
	•	Optionally add a message
Gift Management: View and manage your scheduled gifts.

⸻

Smart Contract Functions
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

Contract Tests
npm run test:contract

TypeScript Type Checking
npm run type-check

🚀 Deployment

Testnet Deployment
# Deploy contract to testnet
npm run deploy:testnet

# Deploy frontend (example: Vercel)
npm run build

Mainnet Deployment
# Update the contract ID
soroban contract deploy --wasm contract/target/wasm32-unknown-unknown/release/gifting_contract.wasm --source-account default --network mainnet

# Update frontend environment variables accordingly

🔧 Development

Code Formatting
npm run format
npm run format:check
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

⸻

🛡️ Security
	•	✅ Freighter wallet integration
	•	✅ Secure Soroban smart contracts
	•	✅ Address validation
	•	✅ Amount validation
	•	✅ Date validation
	•	✅ Authorization checks
