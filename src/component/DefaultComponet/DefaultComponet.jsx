import React from "react";
import HeaderComponet from "../HeaderComponet/HeaderComponet";

function DefaultComponet({ children }) {
  return (
    <div>
      <HeaderComponet />
      {children}
    </div>
  );
}

export default DefaultComponet;
