import { Col, Image, Rate, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import {
  WrapperStyleImageSmall,
  WrapperStyleColImage,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperAddressProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
} from "./style";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import * as ProductService from "../../services/ProductService";
import Loading from "../LoadingComponet/LoadingComponet";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slides/orderSlide";
import { convertPrice, initFacebookSDK } from "../../utils";
import * as message from "../../component/Mesage/Message";
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const dispatch = useDispatch();
  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async (context) => {
    const id = context && context.queryKey && context && context.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };
  useEffect(() => {
    initFacebookSDK();
  }, []);

  useEffect(() => {
    const orderRedux =
      order &&
      order.orderItems &&
      order.orderItems.find(
        (item) => item.product === productDetails && productDetails._id
      );
    if (
      ((orderRedux && orderRedux.amount + numProduct) <= orderRedux &&
        orderRedux.countInstock) ||
      (!orderRedux && productDetails && productDetails.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    }
    if (productDetails && productDetails.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct]);

  useEffect(() => {
    if (order.isSucessOrder) {
      message.success("Đã thêm vào giỏ hàng");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSucessOrder]);

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };
  const { isLoading, data: productDetails } = useQuery(
    ["product-details", idProduct],
    fetchGetDetailsProduct,
    { enabled: !!idProduct }
  );
  const handleAddOrderProduct = () => {
    if (!user || !user.id) {
      navigate("/sign-in", { state: location && location.pathname });
    } else {
      const orderRedux =
        order &&
        order.orderItems &&
        order.orderItems.find(
          (item) => item.product === productDetails && productDetails._id
        );
      if (
        ((orderRedux && orderRedux.amount + numProduct) <= orderRedux &&
          orderRedux.countInstock) ||
        (!orderRedux && productDetails && productDetails.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails && productDetails.name,
              amount: numProduct,
              image: productDetails && productDetails.image,
              price: productDetails && productDetails.price,
              product: productDetails && productDetails._id,
              discount: productDetails && productDetails.discount,
              countInstock: productDetails && productDetails.countInStock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <Image
            src={productDetails && productDetails.image}
            alt="image product"
            preview={false}
          />
          <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
            <WrapperStyleColImage span={4} sty>
              <WrapperStyleImageSmall
                src={productDetails && productDetails.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={productDetails && productDetails.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={productDetails && productDetails.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={productDetails && productDetails.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={productDetails && productDetails.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={productDetails && productDetails.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>
            {productDetails && productDetails.name}
          </WrapperStyleNameProduct>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails && productDetails.rating}
              value={productDetails && productDetails.rating}
            />

            <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails && productDetails.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className="address">{user && user.address}</span> -
            <span className="change-address">Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <LikeButtonComponent
            dataHref={
              process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href
            }
          />
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>Số lượng</div>
            <WrapperQualityProduct>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleChangeCount("decrease", numProduct === 1)}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
              <WrapperInputNumber
                onChange={onChange}
                defaultValue={1}
                max={productDetails && productDetails.countInStock}
                min={1}
                value={numProduct}
                size="small"
              />
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleChangeCount(
                    "increase",
                    numProduct === productDetails && productDetails.countInStock
                  )
                }
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: "flex", aliggItems: "center", gap: "12px" }}>
            <div>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: "rgb(255, 57, 69)",
                  height: "48px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                }}
                onClick={handleAddOrderProduct}
                textbutton={"Chọn mua"}
                styleTextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </div>

            <ButtonComponent
              size={40}
              styleButton={{
                background: "#fff",
                height: "48px",
                width: "220px",
                border: "1px solid rgb(13, 92, 182)",
                borderRadius: "4px",
              }}
              textbutton={"Mua trả sau"}
              styleTextButton={{ color: "rgb(13, 92, 182)", fontSize: "15px" }}
            ></ButtonComponent>
          </div>
        </Col>
        <CommentComponent
          dataHref={
            process.env.REACT_APP_IS_LOCAL
              ? "https://developers.facebook.com/docs/plugins/comments#configurator"
              : window.location.href
          }
          width="1270"
        />
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
