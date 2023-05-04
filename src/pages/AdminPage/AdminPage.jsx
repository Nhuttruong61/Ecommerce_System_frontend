import React, { useState } from "react";
import { Menu } from "antd";
import { getItem } from "../../utils";
import { UserOutlined, AppstoreOutlined,ShoppingCartOutlined} from "@ant-design/icons";
import HeaderComponent from "../../component/HeaderComponet/HeaderComponet";
import AdminUser from "../../component/AdminUser/AdminUser";
import AdminProduct from "../../component/AdminProduct/AdminProduct";
import AdminOrder from "../../component/AdminOrder/AdminOrder";

const AdminPage = () => {
  const items = [
    getItem("Người dùng","user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
    getItem("Đơn hàng", "order", <ShoppingCartOutlined />),

  ];

  const [keySelected, setKeySelected] = useState("");

  const renderPage = (key)=>{
    switch (key) {
      case "user":
        return(
          <AdminUser/>
        )
        case "product":
          return(
            <AdminProduct/>
          )
          case "order":
          return(
            <AdminOrder/>
          )
        default: 
        return <></>
    }
  }

  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };
  // console.log("keySelected", keySelected);

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow : "1px 1px 2px #ccc",
            height: "100vh"
            
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: "15px" }}>
        {renderPage(keySelected)}
         
        </div>
      </div>
    </>
  );
};

export default AdminPage;
