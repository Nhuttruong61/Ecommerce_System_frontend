import React, { useEffect, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Modal, Upload } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import { PlusOutlined } from "@ant-design/icons";
import InputComponet from "../InputComponet/InputComponent";
import { getBase64 } from "../../utils";
import { createProduct } from "../../services/ProductService";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import *as message from "../../component/Mesage/Message"
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

  const mutation = useMutationHooks((data) => {
    const { name, image, type, countInStock, price, rating, description } =
      data;
  const res =  ProductService.createProduct({
      name,
      image,
      type,
      countInStock,
      price,
      rating,
      description,
    });
    return res;
  });
  const [form] = Form.useForm();

  const { data, isLoading, isSuccess, isError } = mutation;
  // console.log(data);
  useEffect(()=>{
    if(isSuccess && data && data.status==="OK"){
      message.success()
      handleCancel();
    } else if(isError) {
      message.error()
    }
  },[isSuccess])

  const handleOk = () => {
    onFinish();
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      image: "",
      type: "",
      countInStock: "",
      price: "",
      rating: "",
      description: "",
    })
    form.resetFields()
  };

  const onFinish = () => {
    mutation.mutate(stateProduct);
    console.log("onFinish", stateProduct);
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
    // console.log("e.target.name", e.target.value);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
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
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Loading isLoading={isLoading}>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
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
              label="  Description"
              name=" description"
              rules={[
                {
                  required: true,
                  message: "Please input your  description!",
                },
              ]}
            >
              <Upload onChange={handleOnchangeAvatar}>
                <Button>Upload</Button>
              </Upload>
              {stateProduct && stateProduct.image && (
                <img
                  src={stateProduct && stateProduct.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="avatar"
                />
              )}
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
        </Loading>
      </Modal>
    </div>
  );
}

export default AdminProduct;
