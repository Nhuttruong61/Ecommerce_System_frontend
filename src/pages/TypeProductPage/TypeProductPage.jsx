import React, { useEffect, useState } from "react";
import { Col, Pagination, Row } from "antd";
import { WrapperProducts } from "./style";
import CardComponet from "../../component/CardComponet/CardComponet";
import { useLocation } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });
  const [type, setType] = useState(state);

  const fetchProductType = async (type, page, limit) => {
    setLoading(true);
    const res = await ProductService.getProductType(type, page, limit);
    if (res && res.status === "OK") {
      setLoading(false);
      setProducts(res && res.data);
      setPanigate({ ...panigate, total: res && res.total });
    } else {
      setLoading(false);
    }
  };

  // console.log("Search", searchProduct);
  useEffect(() => {
    setType(state);
  }, [state]);

  useEffect(() => {
    fetchProductType(type, panigate.page, panigate.limit);
  }, [type, panigate.page, panigate.limit]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
  };

  return (
    <Loading isLoading={loading}>
      <div style={{ width: "100%", background: "#efefef", height: "100%" }}>
        <div style={{ width: "1270px", margin: "0 auto", height: "100%" }}>
          <Row
            style={{ flexWrap: "nowrap", paddingTop: "10px", height: "100%" }}
          >
            <Col span={24}>
              <WrapperProducts>
                {products &&
                  products
                    .filter((pro) => {
                      return (
                        searchDebounce === "" ||
                        (pro &&
                          pro.name &&
                          pro.name
                            .toLowerCase()
                            .includes(searchDebounce.toLowerCase()))
                      );
                    })
                    .map((product) => {
                      return (
                        <CardComponet
                          key={product._id}
                          countInStock={product.countInStock}
                          description={product.description}
                          image={product.image}
                          name={product.name}
                          price={product.price}
                          rating={product.rating}
                          type={product.type}
                          selled={product.selled}
                          discount={product.discount}
                          id={product._id}
                        />
                      );
                    })}
              </WrapperProducts>
              <Pagination
                defaultCurrent={panigate.page + 1}
                total={panigate && panigate.total}
                onChange={onChange}
                style={{ textAlign: "center", marginTop: "10px" }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
