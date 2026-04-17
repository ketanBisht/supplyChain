import { useReducer, createContext, useEffect } from "react";
import { authReducuer } from "../Reducers/AuthReducer";
import { authStateEnableWeb3, authStateLogin, authStateFailed, authStateDisableWeb3, authStateLogout } from '../Actions/AuthActionCreator';
import Web3 from "web3";
import Toast from "../../Components/Toast";

export const AuthContext = createContext();
export const AuthContextProvider = ({children}) => {
  const [authState, authDispatch] = useReducer(authReducuer, {
    isLoading: false,
    errMess: null,
    isWeb3Enabled: false,
    isAuthenticated: false,
    address: null,
    formattedAddress: null,
    stakeholder: {}
  })

  useEffect(() => {
    const initWeb3 = () => {
      if (window.ethereum || window.backpack) {
        // We initialize with the best available default, 
        // but connectWallet will target specific ones.
        const provider = window.backpack ? window.backpack.ethereum : window.ethereum;
        window.web3 = new Web3(provider);
        authDispatch(authStateEnableWeb3());
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        authDispatch(authStateEnableWeb3());
      } else {
        const errMess = "Non-Ethereum browser detected";
        authDispatch(authStateFailed(errMess));
        authDispatch(authStateDisableWeb3());
      }
    };
    initWeb3();
  }, []);

  const connectWallet = async (walletType) => {
    try {
      let provider = window.ethereum;

      if (walletType === 'Backpack' && window.backpack) {
        provider = window.backpack.ethereum;
      } else if (walletType === 'MetaMask' && window.ethereum) {
        // If there are multiple providers, find the one that is MetaMask
        if (window.ethereum.providers) {
          provider = window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum;
        }
      }

      if (!provider) {
        Toast("error", `${walletType} not detected!`);
        return;
      }

      window.web3 = new Web3(provider);

      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts && accounts.length > 0) {
        const selectedAccount = accounts[0];
        authDispatch(authStateLogin(selectedAccount));
        Toast("success", `Successfully connected to ${walletType}`);
      } else {
        Toast("error", "No accounts found. Please unlock your wallet.");
      }
    } catch( error ) {
      if (error.code === 4001) {
        Toast("error", "Connection request rejected.");
      } else {
        Toast("error", error.message);
      }
    }
  }

  const logout = () => {
    try{
      authDispatch(authStateLogout());
      Toast("success", "Successfully Logged out");
    } catch( error ){
      Toast("error", error.message);
    }
  }

  return (
    <AuthContext.Provider value={{authState, authDispatch, connectWallet, logout}}>
      {children}
    </AuthContext.Provider>
  )
}