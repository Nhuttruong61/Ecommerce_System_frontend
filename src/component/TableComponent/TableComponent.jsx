import { Table } from "antd";
import React, { useState } from "react";
import Loading from "../../component/LoadingComponet/LoadingComponet";

const TableComponent = (props) => {
  const { selectionType = 'checkbox', data = [], isLoading = false, columns = [], handleDelteMany } = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])




  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === "Disabled User",
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  // console.log('data', data)
  const handleDeleteAll = () => {
    handleDelteMany(rowSelectedKeys)
  }

  return (
    <Loading isLoading={isLoading}>
    {rowSelectedKeys.length > 0 && (
      <div style={{
        background: '#f94c2f',
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px',
        cursor: 'pointer'
      }}
        onClick={handleDeleteAll}
      >
        Xóa tất cả
      </div>
    )}
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
