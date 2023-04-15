import Homepage from "../pages/HomePage/Homepage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage.jsx"
import ProductsPage from "../pages/ProductsPage/ProductsPage.jsx"
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
        path: '*',
        page: NotFoundPage
    }
]