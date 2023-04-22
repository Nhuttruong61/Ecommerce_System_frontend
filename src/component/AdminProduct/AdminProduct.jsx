import React, { useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Modal } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import { PlusOutlined } from "@ant-design/icons";
import InputComponet from "../InputComponet/InputComponent";

function AdminProduct() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    image: "",
    type: "",
    countInStock: "",
    price: "",
    rating: "",
    description: "",
  });
  const handleOk = () => {
    onFinish()
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = () => {
    console.log("onFinish", stateProduct);
  };
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
    console.log("e.target.name", e.target.value);
  };
  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
      <div style={{ marginTop: "10px" }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent />
      </div>
      <Modal
        title="Tạo sản phẩm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
       
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name=" name"
            rules={[
              {
                required: true,
                message: "Please input your  name!",
              },
            ]}
          >
            <InputComponet
              value={stateProduct.name}
              onChange={handleOnchange}
              name="name"
            />
          </Form.Item>
          <Form.Item
            label=" Type"
            name=" type"
            rules={[
              {
                required: true,
                message: "Please input your  type!",
              },
            ]}
          >
            <InputComponet
              value={stateProduct.type}
              onChange={handleOnchange}
              name="type"
            />
          </Form.Item>
          <Form.Item
            label="Count InStock"
            name=" countInStock"
            rules={[
              {
                required: true,
                message: "Please input your  count InStock!",
              },
            ]}
          >
            <InputComponet
              value={stateProduct.countInStock}
              onChange={handleOnchange}
              name="countInStock"
            />
          </Form.Item>{" "}
          <Form.Item
            label=" Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input your price!",
              },
            ]}
          >
            <InputComponet
              value={stateProduct.price}
              onChange={handleOnchange}
              name="price"
            />
          </Form.Item>{" "}
          <Form.Item
            label="Rating"
            name=" rating"
            rules={[
              {
                required: true,
                message: "Please input your rating!",
              },
            ]}
          >
            <InputComponet
              value={stateProduct.rating}
              onChange={handleOnchange}
              name="rating"
            />
          </Form.Item>
          <Form.Item
            label="  Description"
            name=" description"
            rules={[
              {
                required: true,
                message: "Please input your  description!",
              },
            ]}
          >
            <InputComponet
              value={stateProduct.description}
              onChange={handleOnchange}
              name="description"
            />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminProduct;
