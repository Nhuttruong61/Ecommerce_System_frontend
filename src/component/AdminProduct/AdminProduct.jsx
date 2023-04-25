import React, { useEffect, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Modal } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import { PlusOutlined } from "@ant-design/icons";
import InputComponet from "../InputComponet/InputComponent";
import { getBase64 } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import * as message from "../../component/Mesage/Message";
import { useQuery } from "react-query";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import DrawerComponent from "../DrawerComponet/DrawerComponet";
import { useSelector } from "react-redux";
function AdminProduct() {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const user = useSelector((state) => state && state.user);
  // console.log("user: ", user);
  const [stateProduct, setStateProduct] = useState({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    rating: "",
    description: "",
    image: "",
  });
  const [stateProductDetails, setStateProductDetails] = useState({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    rating: "",
    description: "",
    image: "",
  });
  const mutation = useMutationHooks((data) => {
    const { name, image, type, countInStock, price, rating, description } =
      data;
    const res = ProductService.createProduct({
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
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });
  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    // console.log('res', res);
    return res;
  };
  const fetchDetailsProducts = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res && res.data) {
      setStateProductDetails({
        name: res && res.data && res.data.name,
        type: res && res.data && res.data.type,
        countInStock: res && res.data && res.data.countInStock,
        price: res && res.data && res.data.price,
        rating: res && res.data && res.data.rating,
        description: res && res.data && res.data.description,
        image: res && res.data && res.data.image,
      });
      // console.log(res);
    }
    setIsLoadingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue({
      name: stateProductDetails.name,
      type: stateProductDetails.type,
      countInStock: stateProductDetails.countInStock,
      price: stateProductDetails.price,
      rating: stateProductDetails.rating,
      description: stateProductDetails.description,
    });
  }, [form, stateProductDetails]);

  useEffect(() => {
    if (rowSelected) {
      fetchDetailsProducts(rowSelected);
    }
  }, [rowSelected]);
  console.log("stateproductdetail", stateProductDetails);
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };
  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  // console.log("dataUpdated", dataUpdated);
  const { isLoading: isLoadingProducts, data: products } = useQuery(
    ["products"],
    getAllProducts
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess && data && data.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
    });
    form.resetFields();
  };
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated && dataUpdated.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated]);
  let dataTable = [];
  if (products && products.data && products.data.length > 0) {
    dataTable = products.data.map((product) => {
      return { ...product, key: product._id };
    });
  }

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Rating",
      dataIndex: "rating",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      type: "",
      countInStock: "",
      price: "",
      rating: "",
      description: "",
      image: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateProduct);
    // console.log("onFinish", stateProduct);
  };

  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
    // console.log("e.target.name", e.target.value);
  };
  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }
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
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };
  const onUpdateProduct = () => {
    mutationUpdate.mutate({
      id: rowSelected,
      token: user.access_token,
      ...stateProductDetails,
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
        <TableComponent
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              }, // click row
            };
          }}
        />
      </div>
      <Modal
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        okButtonProps={{ style: { display: "none" } }}
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
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
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
              label="Type"
              name="type"
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
              name="countInStock"
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
              label="Price"
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
              name="rating"
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
              label="Description"
              name="description"
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
              label="Image"
              name="image"
              rules={[
                {
                  // required: true,
                  message: "Please input your  image!",
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar}>
                <Button>Upload</Button>
              </WrapperUploadFile>
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
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="80%"
      >
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
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
            initialValues={{
              remember: true,
            }}
            onFinish={onUpdateProduct}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your  name!",
                },
              ]}
            >
              <InputComponet
                value={stateProductDetails.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your  type!",
                },
              ]}
            >
              <InputComponet
                value={stateProductDetails.type}
                onChange={handleOnchangeDetails}
                name="type"
              />
            </Form.Item>
            <Form.Item
              label="Count InStock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your  count InStock!",
                },
              ]}
            >
              <InputComponet
                value={stateProductDetails.countInStock}
                onChange={handleOnchangeDetails}
                name="countInStock"
              />
            </Form.Item>{" "}
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <InputComponet
                value={stateProductDetails.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>{" "}
            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating!",
                },
              ]}
            >
              <InputComponet
                value={stateProductDetails.rating}
                onChange={handleOnchangeDetails}
                name="rating"
              />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your  description!",
                },
              ]}
            >
              <InputComponet
                value={stateProductDetails.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>
            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  message: "Please input your  image!",
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatarDetails}>
                <Button>Aplly</Button>
              </WrapperUploadFile>
              {stateProductDetails && stateProductDetails.image && (
                <img
                  src={stateProductDetails && stateProductDetails.image}
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
            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>
    </div>
  );
}

export default AdminProduct;
