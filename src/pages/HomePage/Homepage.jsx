import React from "react";
import TypeProduct from "../../component/TypeProduct/TypeProduct";
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from "./style";
import SliderComponet from "../../component/SliderComponet/SliderComponet";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.jpg";
import slider3 from "../../assets/images/slider3.jpg";
import CardComponet from "../../component/CardComponet/CardComponet";

const HomePage = () => {
  const arr = ['Nam', 'Nu']
  return (
    <>
      <div style={{ padding: '0 120px' }}>
        <WrapperTypeProduct>
          {arr.map((item) => {
            return (
              <TypeProduct name={item} key={item} />
            )
          })}
        </WrapperTypeProduct>
      </div>
      <div id="container" style={{ backgroundColor: '#efefef', padding: '0 120px', height: '1000px', width: '100%' }}>
        <SliderComponet arrImages={[slider1, slider2, slider3]} />
        <WrapperProducts>
         <CardComponet/>
         <CardComponet/>
         <CardComponet/>
         <CardComponet/>
         <CardComponet/>
         <CardComponet/>
         <CardComponet/>
        </WrapperProducts>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <WrapperButtonMore  textbutton="Xem Thêm" type="outline" styleButton={{
            border: '1px solid rgb(253, 92, 50)', color: 'black',
            width: '240px', height: '38px', borderRadius: '4px'
          }}
            styleTextButton={{ fontWeight: 500 }} />
        </div>
      </div>
    </>
  )
}


export default HomePage;
