import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import { orderContant } from "../../contant";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../component/Mesage/Message";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponet/LoadingComponet";
function AdminOder() {
  const user = useSelector((state) => state && state.user);
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user && user.access_token);
    return res;
  };

  const queryOrder = useQuery(["orders"], getAllOrder);
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
    },
    ,
    {
      title: "Items Price",
      dataIndex: "itemsPrice",
    },
    {
      title: "Shipping Price",
      dataIndex: "shippingPrice",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
    },
    {
      title: "IsPaid",
      dataIndex: "isPaid",
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    // },
  ];
  let dataTable = [];
  if (orders && orders.data && orders.data.length > 0) {
    dataTable = orders.data.map((order) => {
      return {
        ...order,
        key: order._id,
        username:
          order && order.shippingAddress && order.shippingAddress.fullName,
        phone: order && order.shippingAddress && order.shippingAddress.phone,
        address:
          order && order.shippingAddress && order.shippingAddress.address,
        paymentMethod: orderContant.payment[order && order.paymentMethod],
        isPaid: order && order.isPaid ? "True" : "False",
      };
    });
  }
  console.log("Order", orders);
  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
        />
      </div>
    </div>
  );
}

export default AdminOder;
