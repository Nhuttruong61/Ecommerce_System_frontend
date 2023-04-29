import React from "react";
import ProductDetailsComponent from "../../component/ProductDetailsComponet/ProductDetailsComponet";
import { useNavigate, useParams } from "react-router-dom";
const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{ padding: "0 120px", background: "#efefef", height: "1000px" }}
    >
      <h3>
        <span
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Trang chủ
        </span>{" "}
        - Chi tiết sản phẩm
      </h3>
      <ProductDetailsComponent idProduct={id} />
    </div>
  );
};

export default ProductDetailsPage;
