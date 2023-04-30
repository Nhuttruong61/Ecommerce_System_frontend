import React, { useEffect, useState, useRef } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space, Select } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import { PlusOutlined } from "@ant-design/icons";
import InputComponet from "../InputComponet/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import * as message from "../../component/Mesage/Message";
import { useQuery } from "react-query";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import DrawerComponent from "../DrawerComponet/DrawerComponet";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

function AdminProduct() {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state && state.user);
  // const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const inittial = () => ({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    rating: "",
    description: "",
    image: "",
    newType: "",
    discount: "",
  });
  const [stateProduct, setStateProduct] = useState(inittial())
  const [stateProductDetails, setStateProductDetails] = useState(inittial())
  const mutation = useMutationHooks((data) => {
    const {
      name,
      image,
      type,
      countInStock,
      price,
      rating,
      description,
      discount,
    } = data;
    const res = ProductService.createProduct({
      name,
      image,
      type,
      countInStock,
      price,
      rating,
      description,
      discount,
    });
    return res;
  });
  // console.log("rowSelected", rowSelected);
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
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
        discount: res && res.data && res.data.discount,
      });
      // console.log(res);
    }
    setIsLoadingUpdate(false);
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  useEffect(() => {
    if(!isModalOpen) {
      form.setFieldsValue(stateProductDetails)
    }else {
      form.setFieldsValue(inittial())
    }
  }, [form, stateProductDetails, isModalOpen])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchDetailsProducts(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);
  // console.log("stateproductdetail", stateProductDetails);
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };
  const handleDelteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user && user.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const { data, isLoading, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;
  const {
    data: dataDeletedMany,
    isLoading: isLoadingDeletedMany,
    isSuccess: isSuccessDelectedMany,
    isError: isErrorDeletedMany,
  } = mutationDeletedMany;
  const queryProduct = useQuery(["products"], getAllProducts);
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  const [form] = Form.useForm();

  useEffect(() => {
    if (isSuccess && data && data.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted && dataDeleted.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted]);
  useEffect(() => {
    if (
      isSuccessDelectedMany &&
      dataDeletedMany &&
      dataDeletedMany.status === "OK"
    ) {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDelectedMany]);

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
      discount: "",
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
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponet
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(function () {
          if (searchInput.current) {
            searchInput.current.select();
          }
        }, 100);
      }
    },
    //   render: (text) =>
    //     searchedColumn === dataIndex ? (
    //       <Highlighter
    //         highlightStyle={{
    //           backgroundColor: '#ffc069',
    //           padding: 0,
    //         }}
    //         searchWords={[searchText]}
    //         autoEscape
    //         textToHighlight={text ? text.toString() : ''}
    //       />
    //     ) : (
    //       text
    //     ),
  });
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 350000",
          value: ">=",
        },
        {
          text: "<= 350000",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 350000;
        }
        return record.price <= 350000;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "<= 3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.rating) >= 3;
        }
        return Number(record.rating) <= 3;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: (a, b) => a.type - b.type,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user && user.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
    console.log("delete");
  };
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
      discount: "",
    });
    form.resetFields();
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      discount: stateProduct.discount,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
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
      [e.target.name]: e.target.value,
    });
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
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user && user.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
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
          handleDelteMany={handleDelteManyProducts}
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
      <ModalComponent
        forceRender
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
              <Select
                name="type"
                // defaultValue="lucy"
                // style={{ width: 120 }}
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(
                  typeProduct && typeProduct.data && typeProduct.data.data
                )}
              />
            </Form.Item>
            {stateProduct.type === "add_type" && (
              <Form.Item
                label="New type"
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponet
                  value={stateProduct.newType}
                  onChange={handleOnchange}
                  name="newType"
                />
              </Form.Item>
            )}
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
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your  count Discount!",
                },
              ]}
            >
              <InputComponet
                value={stateProduct.discount}
                onChange={handleOnchange}
                name="discount"
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
      </ModalComponent>
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
            label="Discount"
            name="discount"
            rules={[
              {
                required: true,
                message: "Please input your  count Discount!",
              },
            ]}
          >
            <InputComponet
              value={stateProductDetails.discount}
              onChange={handleOnchangeDetails}
              name="discount"
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
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isLoading={isLoadingDeleted}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
}

export default AdminProduct;
