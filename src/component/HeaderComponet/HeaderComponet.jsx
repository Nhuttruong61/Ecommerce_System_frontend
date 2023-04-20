import { Badge, Col, Popove, Button, Popover } from "antd";
import React, { useEffect, useState } from "react";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccout,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButttonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponet/LoadingComponet";

const HeaderComponet = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState("");
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const hanleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setLoading(false);
  };
  useEffect(() => {
    setLoading(true);
    setUserName(user && user.name);
    setUserAvatar(user && user.avatar);
    setLoading(false);
  }, [user && user.name, user && user.avatar]);

  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate("/profile-user")}>
        Thông tin người dùng
      </WrapperContentPopup>
      {user && user.isAdmin && (
        <WrapperContentPopup onClick={() => navigate("/system/admin")}>
          Quản lí hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={hanleLogout}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );
  return (
    <div
      style={{
        width: "100%",
        background: "rgb(249, 76, 47)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <WrapperHeader>
        <Col span={5}>
          <WrapperTextHeader
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            Ecommerce
          </WrapperTextHeader>
        </Col>
        <Col span={13}>
          <ButttonInputSearch
            size="large"
            textbutton="Tìm kiếm"
            placeholder="Tìm kiếm tại đây"
            // onSearch={onSearch}
          />
        </Col>
        <Col
          span={6}
          style={{ display: "flex", gap: "54px", alignItems: "center" }}
        >
          <Loading isLoading={loading}>
            <WrapperHeaderAccout>
              <UserOutlined style={{ fontSize: "30px" }} />
              {user && user.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: "pointer" }}>
                      {userName && userName.length
                        ? userName
                        : user && user.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <WrapperTextHeaderSmall>
                    Đăng nhập/Đăng ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccout>
          </Loading>
          <div>
            <Badge count={4} size="small">
              <ShoppingCartOutlined
                style={{ fontSize: "30px", color: "#fff" }}
              />
            </Badge>
            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderComponet;
