import { createContext, useCallback, useContext, useEffect, useReducer, useState } from "react";
import { contractReducer } from "../Reducers/ContractReducer";

import MainContract from '../../Smart-Contract/ABI/Main.json';
import StakeholderContract from '../../Smart-Contract/ABI/Stakeholder.json';
import FarmerContract from '../../Smart-Contract/ABI/Farmer.json';
import ManufacturerContract from '../../Smart-Contract/ABI/Manufacturer.json';
import ProductContract from '../../Smart-Contract/ABI/Product.json';
import { 
  contractStateMain, 
  contractStateProduct,
  contractStateFarmer, 
  contractStateManufacturer,
  contractStateStakeholder, 
  contractStateStats 
} from '../Actions/ContractActionCreator';
import { authStateStakeholder } from '../Actions/AuthActionCreator';
import { AuthContext } from "./AuthContext";
import Toast from "../../Components/Toast";

export const ContractContext = createContext();
export const ContractContextProvider = ({children}) => {
  const [contractState, contractDispatch] = useReducer(contractReducer, {
    isLoading: false,
    errMess: null,
    mainContract: null,
    farmerContract: null,
    manufacturerContract: null,
    stakeholderContract: null,
    productContract: null,
    stats: {
      productsCount: 0,
      transactionsCount: 0,
      reviewsCount: 0
    }
  })
  const [networkId, setNetworkId] = useState(null);
  const { authState, authDispatch } = useContext(AuthContext);

  const loadStakeholder = useCallback(async () => {
    if(contractState.stakeholderContract){
      let stakeholderDetails = await contractState.stakeholderContract.methods.get(authState.address).call({from: authState.address});
      stakeholderDetails = {
        id: stakeholderDetails.id,
        name: stakeholderDetails.name,
        location: stakeholderDetails.location,
        role: stakeholderDetails.role === "" ? "new" : stakeholderDetails.role,
        isRegistered: stakeholderDetails.role === "" ? false : true,
        isVerified: stakeholderDetails.isVerified
      }
      const role = await contractState.mainContract.methods.getRole(authState.address).call();
      if(role === "admin"){
        stakeholderDetails.role = role;
      }
      authDispatch(authStateStakeholder(stakeholderDetails));
    }
  }, [contractState.stakeholderContract, contractState.mainContract, authState.address, authDispatch])

  useEffect(() => {
    (async () => {
      if(authState.isWeb3Enabled){
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);

        if (!MainContract.networks[networkId] || !ProductContract.networks[networkId] || 
            !FarmerContract.networks[networkId] || !ManufacturerContract.networks[networkId]) {
          Toast("error", "Smart contracts not deployed on the current network!");
          return;
        }

        const main = new web3.eth.Contract(MainContract.abi, MainContract.networks[networkId].address);
        contractDispatch(contractStateMain(main));
        const product  = new web3.eth.Contract(ProductContract.abi, ProductContract.networks[networkId].address);
        contractDispatch(contractStateProduct(product));
        const farmer = new web3.eth.Contract(FarmerContract.abi, FarmerContract.networks[networkId].address);
        contractDispatch(contractStateFarmer(farmer));
        const manufacturer = new web3.eth.Contract(ManufacturerContract.abi, ManufacturerContract.networks[networkId].address);
        contractDispatch(contractStateManufacturer(manufacturer));
        const stats = {};
        stats["productsCount"] = await product.methods.getProductsCount().call();
        stats["transactionsCount"] = await product.methods.getTransactionsCount().call();
        stats["reviewsCount"] = await product.methods.getReviewsCount().call();
        contractDispatch(contractStateStats(stats));
      }
    })();
  }, [authState.isWeb3Enabled])

  useEffect(() => {
    (async () => {
      if(authState.isAuthenticated && contractState.mainContract){
        const web3 = window.web3;
        const role = await contractState.mainContract.methods.getRole(authState.address).call();
        if( role === "farmer"){
          if (!FarmerContract.networks[networkId]) {
             Toast("error", "Farmer contract not found on this network.");
             return;
          }
          const farmer = new web3.eth.Contract(FarmerContract.abi, FarmerContract.networks[networkId].address);
          contractDispatch(contractStateStakeholder(farmer));
        }
        else if(role === 'manufacturer'){
          if (!ManufacturerContract.networks[networkId]) {
            Toast("error", "Manufacturer contract not found on this network.");
            return;
          }
          const manufacturer = new web3.eth.Contract(ManufacturerContract.abi, ManufacturerContract.networks[networkId].address);
          contractDispatch(contractStateStakeholder(manufacturer));
        }
        else {
          if (!StakeholderContract.networks[networkId]) {
            Toast("error", "Stakeholder contract not found on this network.");
            return;
          }
          const stakeholder = new web3.eth.Contract(StakeholderContract.abi, StakeholderContract.networks[networkId].address);
          contractDispatch(contractStateStakeholder(stakeholder));
        }
      }
    })();
  }, [authState.isAuthenticated, authState.address, contractState.mainContract, networkId])

  useEffect(() => {
    (async () => {
      await loadStakeholder();
    })();
  }, [contractState.stakeholderContract, loadStakeholder])


  const updateStats = async () => {
    const stats = {};
    stats["productsCount"] = await contractState.productContract.methods.getProductsCount().call();
    stats["transactionsCount"] = await contractState.productContract.methods.getTransactionsCount().call();
    stats["reviewsCount"] = await contractState.productContract.methods.getReviewsCount().call();
    contractDispatch(contractStateStats(stats));
  }

  return (
    <ContractContext.Provider value={{contractState, contractDispatch, updateStats, loadStakeholder}}>
      {children}
    </ContractContext.Provider>
  )

}
