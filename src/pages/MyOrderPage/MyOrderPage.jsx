import React, { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "react-query";
import { convertPrice } from "../../utils";
import {
  WrapperContainer,
  WrapperFooterItem,
  WrapperHeaderItem,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStatus,
} from "./style";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { message } from "antd";

const MyOrderPage = () => {
  const location = useLocation();
  console.log("state", location);
  const { state } = location;
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(
      state && state.id,
      state && state.token
    );
    return res.data;
  };
  const queryOrder = useQuery(
    { queryKey: ["orders"], queryFn: fetchMyOrder },
    {
      enabled: state && state.id && state && state.access_token,
    }
  );
  const { isLoading, data } = queryOrder;
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state && state.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems } = data;
    const res = OrderService.cancelOrder(id, token, orderItems);
    return res;
  });

  const handleCanceOrder = (order) => {
    mutation.mutate(
      {
        id: order._id,
        token: state && state.token,
        orderItems: order && order.orderItems,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel && dataCancel.status === "OK") {
      message.success();
    } else if(isSuccessCancel && dataCancel && dataCancel.status === 'ERR') {
      message.error(dataCancel && dataCancel.message)
    }else if (isErrorCancle) {
      message.error();
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return (
      data &&
      data.map((order) => {
        return (
          <WrapperHeaderItem key={order && order._id}>
            <img
              src={order && order.image}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                border: "1px solid rgb(238, 238, 238)",
                padding: "2px",
              }}
            />
            <div
              style={{
                width: 260,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginLeft: "10px",
              }}
            >
              {order && order.name}
            </div>
            <span
              style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
            >
              {convertPrice(order && order.price)}
            </span>
          </WrapperHeaderItem>
        );
      })
    );
  };
  console.log("data", data)
  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
          
          {data &&
            data.map((order) => {
                return (
                  <WrapperItemOrder key={order && order._id}>
                    <WrapperStatus>
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Trạng thái
                      </span>
                      <div>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          Giao hàng:{" "}
                        </span>
                        {`${
                          order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
                        }`}
                      </div>
                      <div>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          Thanh toán:
                        </span>
                        {`${
                          order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"
                        }`}
                      </div>
                    </WrapperStatus>
                    {renderProduct(order && order.orderItems)}
                    <WrapperFooterItem>
                      <div>
                        <span style={{ color: "rgb(255, 66, 78)" }}>
                          Tổng tiền:{" "}
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "rgb(56, 56, 61)",
                            fontWeight: 700,
                          }}
                        >
                          {convertPrice(order && order.totalPrice)}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <ButtonComponent
                          onClick={() => handleCanceOrder(order)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 116, 229)",
                            borderRadius: "4px",
                          }}
                          textbutton={"Hủy đơn hàng"}
                          styleTextButton={{
                            color: "rgb(11, 116, 229)",
                            fontSize: "14px",
                          }}
                        ></ButtonComponent>
                        <ButtonComponent
                          onClick={() => handleDetailsOrder(order && order._id)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 116, 229)",
                            borderRadius: "4px",
                          }}
                          textbutton={"Xem chi tiết"}
                          styleTextButton={{
                            color: "rgb(11, 116, 229)",
                            fontSize: "14px",
                          }}
                        ></ButtonComponent>
                      </div>
                    </WrapperFooterItem>
                  </WrapperItemOrder>
                );
              })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};
export default MyOrderPage;
