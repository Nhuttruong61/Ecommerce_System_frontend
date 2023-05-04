import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Select, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import { orderContant } from "../../contant";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../component/Mesage/Message";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";
import ModalComponent from "../ModalComponent/ModalComponent";
import Loading from "../LoadingComponet/LoadingComponet";
import { Option } from "antd/es/mentions";
function AdminOder() {
  const user = useSelector((state) => state && state.user);
  const [statusMap, setStatusMap] = useState({});

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder(user && user.access_token);
    return res;
  };

  const queryOrder = useQuery(["orders"], getAllOrder);
  const { isLoading: isLoadingOrders, data: orders } = queryOrder;
  const statusOptions = [
    { label: "Confirmed", value: "confirm" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Delivered", value: "delivered" },
  ];
  async function handleStatusChange(orderId, event) {
    const selectedValue = event.target.value;
    const selectedOption = statusOptions.find((option) => option.value === selectedValue);
    
    if (selectedOption) {
      setStatusMap(prevStatusMap => ({
        ...prevStatusMap,
        [orderId]: selectedOption.value // Update the status of the selected order only
      }));
      const res = await OrderService.UpdateStusDetailsOrder(orderId, selectedOption.value, user.access_token);
      message.success(res.message);
      queryOrder.refetch();
    }
  }
  useEffect(() => {
    if (orders && orders.data && orders.data.length > 0) {
      const newStatusMap = {};
      orders.data.forEach((order) => {
        newStatusMap[order._id] = order.status;
      });
      setStatusMap(newStatusMap);
    }
  }, [orders]);
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
    //   render: (status, record) => (
    //     <div>
    //       <select value={statusMap[record.key]} onChange={(e) => handleStatusChange(record.key, e)}>
    //         {statusOptions.map((option) => (
    //           <option key={option.value} value={option.value}>
    //             {option.label}
    //           </option>
    //         ))}
    //       </select>
    //     </div>
    //   ),
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
  const handleRowClick = (record) => {
    const orderId = record.key;
    console.log("order", orderId);
  };
  console.log("order", orders);

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          isLoading={isLoadingOrders}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                handleRowClick(record);
              },
            };
          }}
        />
      </div>
    </div>
  );
}

export default AdminOder;
