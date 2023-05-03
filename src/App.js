import React, { Fragment, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponet from "./component/DefaultComponet/DefaultComponet.jsx";
import { isJsonString } from "./utils";
import jwt_decode from "jwt-decode";
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";
import Loading from "./component/LoadingComponet/LoadingComponet";
import MessengerCustomerChat from 'react-messenger-customer-chat';
function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded();
    if (decoded && decoded.id) {
      handleGetDetailsUser(decoded && decoded.id, storageData);
    }
    setIsLoading(false)

  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwt_decode(storageData);
    }
    return { decoded, storageData };
  };

  // Add a request interceptor
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded && decoded.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data && data.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...(res && res.data), access_token: token }));
    // console.log(res);
  };

  return (
    <div>
    <Loading isLoading={isLoading}>
    <Router>
      <Routes >
        {routes.map((route) => {
          const Page = route.page;
          const isCheckAuth =
            !route.isPrivate || (user && user.isAdmin); // check if the user is authenticated and is an admin
          const Layout = route.isShowHeader ? DefaultComponet : Fragment;
          return isCheckAuth ? (
            <Route
              key={route.path}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          ) : null;
        })}
      </Routes>
    </Router>

    </Loading>
    </div>
  );
}

export default App;
