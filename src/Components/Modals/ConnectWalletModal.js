import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import '../../Assests/Styles/connectWallet.modal.css';

const ConnectWalletModal = ({ isOpen, toggle, connectWallet }) => {
  const wallets = [
    {
      name: 'MetaMask',
      icon: 'fa fa-fox', // Placeholder icon
      color: '#F6851B',
      description: 'Connect to your MetaMask Wallet'
    },
    {
      name: 'Coinbase Wallet',
      icon: 'fa fa-dot-circle-o',
      color: '#0052FF',
      description: 'Connect using Coinbase Wallet'
    },
    {
      name: 'Backpack',
      icon: 'fa fa-briefcase',
      color: '#E33E3F',
      description: 'Connect using Backpack Wallet'
    }
  ];

  const handleConnect = (walletName) => {
    connectWallet(walletName);
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="connect-wallet-modal">
      <ModalHeader toggle={toggle}>Choose a Wallet</ModalHeader>
      <ModalBody>
        <div className="d-flex flex-column gap-3">
          {wallets.map((wallet, index) => (
            <Button
              key={index}
              block
              outline
              className="wallet-option-button d-flex align-items-center justify-content-between p-3 mb-2"
              onClick={() => handleConnect(wallet.name)}
              style={{ borderColor: wallet.color, borderWidth: '2px' }}
            >
              <div className="d-flex align-items-center">
                <i className={`${wallet.icon} fa-2x me-3`} style={{ color: wallet.color }}></i>
                <div className="text-start">
                  <div className="fw-bold" style={{ color: wallet.color }}>{wallet.name}</div>
                  <small className="text-muted">{wallet.description}</small>
                </div>
              </div>
              <i className="fa fa-chevron-right text-muted"></i>
            </Button>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="text-center w-100 text-muted small">
          By connecting a wallet, you agree to our Terms of Service.
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ConnectWalletModal;
