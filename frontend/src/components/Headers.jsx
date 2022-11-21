import { useContext } from "react";
import { NetworkContext } from "../App";
import logo from '../assets/UDAO.jpg';

const Header = ({ address }) => {
  const networkContext = useContext(NetworkContext);
  return (
    <div>
      <div className="flex space-between">
        <img
          src={logo}
          style={{
            width: "100px",
            height: "100px",
            marginLeft: "-50px",
          }}
          alt="Ethereum SVG"
        />
        <h2 className="mt-8 text-4xl font-light" style={{
            marginLeft: "20px",
          }}>NFT Disperse</h2>
        {(
          <span className="text-l pt-2 font-light">
            by Unidentified DAO
          </span>
        )}
        {address && (
          <span className="text-l pt-2 font-light">
            {networkContext.network ? "" : "bad network🤔"}
          </span>
        )}
      </div>
      <div></div>{/* 
      <p className="pt-8 text-l font-light">
        distribute nfts to multiple addresses
      </p> */}
    </div>
  );
};

export default Header;
