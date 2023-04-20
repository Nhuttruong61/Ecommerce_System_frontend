import AdminPage from "../pages/AdminPage/AdminPage";
import Homepage from "../pages/HomePage/Homepage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage.jsx"
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage.jsx"
import ProfilePage from "../pages/Profile/Profile";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
export const routes = [
    {
        path: '/',
        page: Homepage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: ProductsPage,
        isShowHeader: true

    },
    {
        path: '/products',
        page: OrderPage ,
        isShowHeader: true

    },
    {
        path: '/type',
        page: TypeProductPage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false
    },
    {
        path: '/product-details',
        page: ProductDetailsPage,
        isShowHeader: true
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true
    },
]