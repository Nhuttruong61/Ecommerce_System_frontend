import React, { useEffect } from "react";

import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import imageLogo from "../../assets/images/logo-login.png";
import { Image } from "antd";
import ButtonComponent from "../../component/ButtonComponent/ButtonComponent";
import InputForm from "../../component/InputForm/InputForm";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../component/LoadingComponet/LoadingComponet";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user  = useSelector((state) => state.user)
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isLoading, isSuccess, isError } = mutation;
  // console.log( isLoading);
  useEffect(() => {
    // console.log("location", location);
    if (isSuccess) {
      if (location && location.state) {
        navigate(location && location.state);
      } else {
        navigate("/");
      }
      // console.log(data);
      localStorage.setItem(
        "access_token",
        JSON.stringify(data && data.access_token)
      );
      
      if (data && data.access_token) {
        const decoded = jwt_decode(data && data.access_token);
        // console.log("decoded", decoded);
        if (decoded && decoded.id) {
          handleGetDetailsUser(
            decoded && decoded.id,
            data && data.access_token
          );
        }
      }
    }
  }, [isSuccess]);
  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...(res && res.data), access_token: token }));
  };
  const handleSignIn = () => {
    mutation.mutate({ email, password });
  };
  // console.log(mutation);
  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập vào tạo tài khoản</p>
          <InputForm
            value={email}
            onChange={handleOnchangeEmail}
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              value={password}
              onChange={handleOnchangePassword}
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
            />
          </div>
          {data && data.status === "ERR" && (
            <span style={{ color: "red" }}>{data.message}</span>
          )}
          <Loading isLoading={isLoading}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={"Đăng nhập"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
        
          <p>
            Chưa có tài khoản?{" "}
            <WrapperTextLight onClick={handleNavigateSignUp}>
              {" "}
              Tạo tài khoản
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="iamge-logo"
            height="203px"
            width="203px"
          />
          <h4>Mua sắm thả ga</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
