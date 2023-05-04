import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponet/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButttonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textbutton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(247, 67, 46)",
    colorButton = "#ccc",
  } = props;

  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ backgroundColor: backgroundColorInput, borderRadius: 0 }}
        {...props}
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: backgroundColorButton,
          border: !bordered ,
          borderRadius: 0,
        
        }}
        icon={<SearchOutlined color={colorButton} style={{ color: "white" }} />}
        textbutton={textbutton}
        styleTextButton={{ color: colorButton }}
      />
    </div>
  );
};

export default ButttonInputSearch;
