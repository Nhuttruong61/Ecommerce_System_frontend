import React from "react";
import TypeProduct from "../../component/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderComponet from "../../component/SliderComponet/SliderComponet";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.jpg";
import slider3 from "../../assets/images/slider3.jpg";
import CardComponet from "../../component/CardComponet/CardComponet";
import SliderComponent from "../../component/SliderComponet/SliderComponet";

const HomePage = () => {
  const arr = ["Nam", "Nu"];
  return (
    <>
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        className="body"
        style={{ width: "100%", backgroundColor: "#efefef" }}
      >
        <div
          id="container"
          style={{ height: "1000px", width: "1270px", margin: "0 auto" }}
        >
          <SliderComponent arrImages={[slider1, slider2, slider3]} />
          <WrapperProducts>
            <CardComponet />
            <CardComponet />
            <CardComponet />
            <CardComponet />
            <CardComponet />
            <CardComponet />
            <CardComponet />
            <CardComponet />
            <CardComponet />
            <CardComponet />
          </WrapperProducts>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <WrapperButtonMore
              textbutton="Xem thêm"
              type="outline"
              styleButton={{
                border: "1px solid rgb(11, 116, 229)",
                color: "rgb(11, 116, 229)",
                width: "240px",
                height: "38px",
                borderRadius: "4px",
              }}
              styleTextButton={{ fontWeight: 500 }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
