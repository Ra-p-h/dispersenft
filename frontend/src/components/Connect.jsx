const Connect = ({ connect }) => {
  return (
    <div className="pt-16">
      <h3 className="text-2xl font-light">Connect to wallet</h3>
      <button
        onClick={connect}
        className="px-2 mt-6 p-2"
        style={{
          background: "#00328c",
          boxShadow: "6px 6px #f97043",
        }}
      >
        Connect wallet
      </button>
      <p className="mt-6">Please unlock metamask</p>
    </div>
  );
};

export default Connect;
