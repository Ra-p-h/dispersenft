const Recipients = ({ tokenSymbol, textValue, setTextValue }) => {
  return (
    <div className="pt-16">
      <h3 className="text-2xl font-light">Recipients and tokenIds</h3>
      <p className="pt-3 text-l font-light">
        Enter one address and tokenId of {tokenSymbol} on each line. Supports any
        format.
      </p>
      <textarea
        spellCheck="false"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        className="block border-b-2 border-black outline-none px-2 py-2 mt-4 h-32"
        style={{
          width: "100%",
          background: "#00328c"
        }}
        placeholder="0x2b1F577230F4D72B3818895688b66abD9701B4dC=5
        0x2b1F577230F4D72B3818895688b66abD9701B4dC 5
        0x2b1F577230F4D72B3818895688b66abD9701B4dC,5"
      ></textarea>
    </div>
  );
};

export default Recipients;
