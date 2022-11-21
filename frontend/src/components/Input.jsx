import { useState } from "react";

const Input = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  return (
    <>
      <input
        type="text"
        placeholder="Enter ERC721 token address"
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <button>Load Token</button>
    </>
  );
};

export default Input;
