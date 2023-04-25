import { Table } from "antd";
import React from "react";
import Loading from "../../component/LoadingComponet/LoadingComponet";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    products = [],
    isLoading = false,
    data =[],
    columns =[]
  } = props;




  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  // console.log('data', data)
  return (
    <Loading isLoading={isLoading}>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  );
};

export default TableComponent;
