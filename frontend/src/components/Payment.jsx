import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import ERC721 from "../artifacts/ERC721.json";
import Disperse from "../artifacts/Disperse.json";
import Confirm from "./Confirm";
import Recipients from "./Recipients";
import { NetworkContext } from "../App";
import { disperseAddresses, warnMessage } from "../utils/constants";
import { parseText } from "../utils/index";
import Ether from "./Ether";

const Payment = ({ address }) => {
  const { chainId } = useContext(NetworkContext);
  const [currentLink, setCurrentLink] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDetails, setTokenDetails] = useState({
    name: null,
    symbol: null,
    balance: null,
  });
  const [textValue, setTextValue] = useState("");
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [recipientsData, setRecipientsData] = useState([]);
  const [total, setTotal] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [warn, setWarn] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [approveStatus, setApproveStatus] = useState(null);

  const getEthBalance = async (ethereum) => {
    if (!ethBalance) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      let ethBalance = await provider.getBalance(address);
      ethBalance = ethers.utils.formatEther(ethBalance);
      setEthBalance(ethBalance);
    }
  };

  const loadToken = async () => {
    try {
      setIsTokenLoading(true);
      const { ethereum } = window;
      if (ethereum && tokenAddress !== "") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const erc721 = new ethers.Contract(tokenAddress, ERC721.abi, signer);
        const name = await erc721.name();
        const symbol = await erc721.symbol();
        const balance = await erc721.balanceOf(address);
        setTokenDetails({
          name,
          symbol,
          balance: ethers.utils.formatEther(balance),
        });
      }

      if (!disperseAddresses[chainId]) {
        setWarn(warnMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTokenLoading(false);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      getEthBalance(ethereum);
    }
  }, [currentLink]);

  const approve = async () => {
    setApproveStatus(null);
    try {
      const { ethereum } = window;
      if (
        ethereum &&
        tokenAddress !== "" &&
        total &&
        disperseAddresses[chainId]
      ) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const erc721 = new ethers.Contract(tokenAddress, ERC721.abi, signer);

        const disperseAddress = disperseAddresses[chainId];
        const txn = await erc721.setApprovalForAll(disperseAddress, true);
        setApproveStatus({
          status: "pending",
          hash: txn.hash,
        });

        await txn.wait();
        setApproveStatus({
          status: "success",
          hash: txn.hash,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const disperse = async () => {
    try {
      const { ethereum } = window;
      if (
        ethereum &&
        tokenAddress !== "" &&
        recipientsData.length > 0 &&
        disperseAddresses[chainId]
      ) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const disperseAddress = disperseAddresses[chainId];

        const disperse = new ethers.Contract(
          disperseAddress,
          Disperse.abi,
          signer
        );

        const recipients = recipientsData.map((recipient) => recipient.address);
        const values = recipientsData.map((recipient) => Number(ethers.utils.formatEther(recipient.value)));
        console.log(values)

        const txn = await disperse.disperseNft(
          tokenAddress,
          recipients,
          values
        );
        setTxStatus({
          status: "pending",
          hash: txn.hash,
        });

        await txn.wait();
        setTxStatus({
          status: "success",
          hash: txn.hash,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (textValue !== "") {
      const updatedRecipients = parseText(textValue);
      setRecipientsData(updatedRecipients);
    }
  }, [textValue]);

  useEffect(() => {
    if (recipientsData.length > 0) {
      let newTotal = recipientsData[0].value;
      for (let i = 1; i < recipientsData.length; i++) {
        newTotal = newTotal.add(recipientsData[i].value);
      }
      setTotal(newTotal);
    } else {
      setTotal(null);
    }
  }, [recipientsData]);

  useEffect(() => {
    if (tokenDetails.balance && total) {
      const tokenBalance = ethers.utils.parseEther(tokenDetails.balance);
      const remaining = tokenBalance.sub(total);
      setRemaining(ethers.utils.formatEther(remaining));
    } else {
      setRemaining(null);
    }
  }, [total]);

  return (
    <div className="pt-16">
      <h3 className="text-2xl font-light">
        
        <span
          onClick={() => setCurrentLink("nft")}
          style={{
            cursor: "pointer",
            border: "1px solid white",
            padding: "5px 10px"
          }}
          className={`border-b-2 ${
            currentLink !== "nft" ? "text-gray-500" : ""
          }`}
        >
          Send nft to multiple addresses
        </span>
      </h3>

      {currentLink === "ether" && <Ether address={address} />}
      {currentLink === "nft" && (
        <div className="mt-12 mb-24">
          <h3 className="text-2xl font-light">ERC721 token address</h3>
          <div className="flex mt-6">
            <input
              type="text"
              className="text-l py-2 px-1 border-b-2 border-black outline-none"
              placeholder="0x2b1F577230F4D72B3818895688b66abD9701B4dC"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              style={{
                width: "80%",
                background: "#00328c"
              }}
            />
            <button
              onClick={loadToken}
              className="ml-4 px-2"
              style={{
                background: "#00328c",
                boxShadow: "6px 6px #f97043",
              }}
            >
              load
            </button>
          </div>
          {isTokenLoading && (
            <p className="pt-4 text-l font-light italic">
              loading token info ...
            </p>
          )}
          {!isTokenLoading && tokenDetails.name && (
            <>
              <p className="pt-4 text-l font-light">
                you have {tokenDetails.balance*1000000000000000000}{" "}
                <span className="pt-1 text-xs">{tokenDetails.symbol}</span> (
                {tokenDetails.name})
              </p>
              {warn && <p className="italic text-red-400">{warn}</p>}
              {!warn && (
                <Recipients
                  tokenSymbol={tokenDetails.symbol}
                  textValue={textValue}
                  setTextValue={setTextValue}
                />
              )}
              {recipientsData.length > 0 && (
                <Confirm
                  recipientsData={recipientsData}
                  total={total}
                  tokenBalance={tokenDetails.balance}
                  remaining={remaining}
                  approve={approve}
                  disperse={disperse}
                  txStatus={txStatus}
                  approveStatus={approveStatus}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Payment;
