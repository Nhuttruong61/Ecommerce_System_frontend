import React from "react";
import {
  Lable,
  WrapperInfo,
  WrapperContainer,
  WrapperValue,
  WrapperCountOrder,
  WrapperItemOrder,
  WrapperItemOrderInfo,
} from "./style";

import { useSelector } from "react-redux";

import Loading from "../../component/LoadingComponet/LoadingComponet";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const { state } = location;
  // console.log("location", location);
  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <Loading isLoading={false}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3>Đơn hàng đã đặt thành công</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức giao hàng</Lable>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderContant.delivery[state && state.delivery]}
                    </span>
                    Giao hàng tiết kiệm
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Phương thức thanh toán</Lable>
                  <WrapperValue>
                    {orderContant.payment[state && state.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders &&
                  state.orders.map((order) => {
                    return (
                      <WrapperItemOrder>
                        <div
                          style={{
                            width: "390px",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <img
                            src={order.image}
                            style={{
                              width: "77px",
                              height: "79px",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              width: 260,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                          
                          <span style={{ fontSize: "13px", margin: "0px 12px"}}>
                          {order.name}
                          </span>
                          </div>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span>
                            <span
                              style={{ fontSize: "13px", color: "#242424" }}
                            >
                              Giá tiền: {" "}
                              {convertPrice(order.price)}
                            </span>
                          </span>
                          <span>
                            <span
                              style={{ fontSize: "13px", color: "#242424", padding: "0px 4px" }}
                            >
                            Số lượng: {" "}
                              {order.amount}
                            </span>
                          </span>
                        </div>
                      </WrapperItemOrder>
                    );
                  })}
              </WrapperItemOrderInfo>
              <div>
              <span
              style={{ fontSize: "16px", color: "red", padding: "0px 4px" }}
            >
            Tổng tiền: {" "}
              {convertPrice(state && state.totalPriceMemo)}
            </span>
              </div>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  );
};
export default OrderSuccess;
