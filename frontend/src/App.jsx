import { ethers } from "ethers";
import { createContext, useEffect, useReducer, useState } from "react";
import "./App.css";
import Header from "./components/Headers";
import Payment from "./components/Payment";
import WalletInfo from "./components/WalletInfo";
import Warn from "./components/Warn";
import Web3Modal, { CHAIN_DATA_LIST } from "web3modal";
import Connect from "./components/Connect";
import { initState, reducer } from "./reducers/index";
import { chains } from "./utils/constants";

export const NetworkContext = createContext();

function App() {
  const [isMetamaskConnected, setIsMetamaskConnected] = useState();
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState();
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
  });

  const fetchNetworkDetails = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const { chainId, name } = await provider.getNetwork();
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      if (chainId === chains.skale) {
        dispatch({ type: "SET_NETWORK", payload: "skale" });
      } else {
        dispatch({ type: "SET_NETWORK", payload: name });
      }
      dispatch({ type: "SET_CHAIN_ID", payload: chainId });
      setAddress(address);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAccountConnected = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const accounts = await provider.listAccounts();
    if (!accounts.length) {
      setIsMetamaskConnected(false);
      return;
    }
    setIsMetamaskConnected(true);
  };

  const connect = async () => {
    try {
      const web3modal = new Web3Modal();
      const result = await web3modal.connect();
      if (result) {
        setIsMetamaskConnected(true);
        fetchNetworkDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      setIsMetamaskInstalled(true);
      checkAccountConnected();
      fetchNetworkDetails(ethereum);
    } else {
      setIsMetamaskInstalled(false);
    }
  }, []);
  return (
    <div className="mx-48 px-48 pt-28">
      <NetworkContext.Provider
        value={{
          chainId: state.chainId,
          network: state.network,
        }}
      >
        <Header address={address} />
        {isMetamaskInstalled ? (
          !isMetamaskConnected && <Connect connect={connect} />
        ) : (
          <Warn />
        )}
        {!isLoading && address && (
          <>
            <WalletInfo address={address} />
            <Payment address={address} />
          </>
        )}
      </NetworkContext.Provider>
      <div className="text-xs" 
            style={{
              position: "fixed",
              bottom: "10px",
              right: "10px",
            }}>
              <a target="_blank" style={{ textDecoration: "underline" }} href="https://github.com/ra-p-h/dispersenft">Github</a>{" - "}
              <a target="_blank" style={{ textDecoration: "underline" }} href="https://etherscan.io/address/0x10e073b64351bc4d84ea329aae6c37ae0a9cf052#code">Contract</a>
       </div>
    </div>
  );
}

export default App;
