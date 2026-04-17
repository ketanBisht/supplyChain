# Authenticity in Food Supply Chain Using Blockchain

A decentralized supply chain application designed to trace food products from farm to table. This project uses Ethereum smart contracts and a React-based frontend to ensure transparency, prevent fraud, and reduce supply chain costs.

## 🚀 Quick Start Guide

This guide will help you set up and run the project on your local machine using the **Sepolia Testnet**.

### Prerequisites

You will need the following tools installed:
- [Node.js](https://nodejs.org/) (Version 16 or higher recommended)
- [Truffle](https://www.trufflesuite.com/truffle): `npm install -g truffle`
- [MetaMask](https://metamask.io/) or [Backpack](https://backpack.app/) Wallet extension in your browser.

---

### 🛠 Phase 1: Environment Setup

1.  **Get an Alchemy API Key**:
    - Go to [Alchemy.com](https://www.alchemy.com/) and create a free account.
    - Create a new App on the **Ethereum Sepolia** network and copy the **API Key**.
2.  **Get your Wallet Mnemonic**:
    - In your wallet (MetaMask or Backpack), go to **Settings** -> **Security** -> **Reveal Secret Recovery Phrase**.
3.  **Configure `.env`**:
    - In the root folder of the project, create or open the `.env` file and fill it in:
      ```text
      ALCHEMY_API_KEY=your_alchemy_api_key_here
      MNEMONIC=your_12_word_seed_phrase_here
      ```

---

### 📦 Phase 2: Smart Contract Deployment

1.  **Install Dependencies**:
    ```bash
    cd src/smart-contract
    npm install
    ```
2.  **Get Sepolia ETH**:
    - You need some free test ETH to deploy. Use a faucet like [sepoliafaucet.com](https://www.sepoliafaucet.com/).
3.  **Deploy to Sepolia**:
    ```bash
    truffle migrate --network sepolia
    ```
    *This will compile your contracts and upload them to the testnet.*

---

### 💻 Phase 3: Launch the Frontend

1.  **Return to the root folder**:
    ```bash
    cd ../..
    ```
2.  **Install Frontend Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Application**:
    ```bash
    npm start
    ```
    *The app will open automatically at `http://localhost:3000`.*

---

### 📖 How to Use the DApp

1.  **Switch to Sepolia**: In your wallet extension, change the network to **Sepolia Test Network**.
2.  **Login**: Click "Login" on the Navbar and choose your wallet.
3.  **Admin Functions**: The account you used to deploy the contracts is automatically the **Admin**. You can verify new stakeholders from the "Verify" tab.
4.  **Traceability**: Each product is registered by a Farmer, processed by a Manufacturer, and tracked across the chain.

---

## 🔒 Security Note
**NEVER** share your `.env` file or commit it to GitHub. It contains your private Mnemonic which controls your funds. The `.gitignore` file should always include `.env`.

---

## 🏗 System Architecture
The application follows a 3-layer architecture:
- **Application Layer**: React.js Frontend.
- **Blockchain Layer**: Solidity Smart Contracts.
- **Infrastructure Layer**: Alchemy RPC & Sepolia Testnet.

---

## 📄 License
This project is licensed under the MIT License.