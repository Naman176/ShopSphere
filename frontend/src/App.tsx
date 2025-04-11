import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./components/Loader";
import Header from "./components/Header";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { UserReducerInitialState } from "./types/reducerTypes";
import ProtectedRoute from "./pages/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));

const Login = lazy(() => import("./pages/Login"));

const Dashboard = lazy(() => import("./pages/adminPages/Dashboard"));
const Customers = lazy(() => import("./pages/adminPages/Customers"));
const Products = lazy(() => import("./pages/adminPages/Products"));
const Transaction = lazy(() => import("./pages/adminPages/Transaction"));
const NewProduct = lazy(
  () => import("./pages/adminPages/management/NewProduct")
);
const ProductManagement = lazy(
  () => import("./pages/adminPages/management/ProductManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/adminPages/management/TransactionManagement")
);
const BarCharts = lazy(() => import("./pages/adminPages/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/adminPages/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/adminPages/charts/LineCharts"));
const Coupon = lazy(() => import("./pages/adminPages/apps/Coupon"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const { data } = await getUser(firebaseUser.uid);
        dispatch(userExist(data.user));
      } else {
        dispatch(userNotExist());
      }
    });
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Router>
        {/* Header */}
        <Header user={user} />

        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />

            {/* Not Logged In Route */}
            <Route
              path="/login"
              element={
                <ProtectedRoute isAuthenticated={user ? false : true}>
                  <Login />
                </ProtectedRoute>
              }
            />

            {/* Logged In User Routes */}
            <Route
              element={<ProtectedRoute isAuthenticated={user ? true : false} />}
            >
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/pay" element={<Checkout />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={user ? true : false}
                  adminRoute={true}
                  isAdmin={user?.role === "admin" ? true : false}
                />
              }
            >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/transaction" element={<Transaction />} />

              <Route path="/admin/product/new" element={<NewProduct />} />
              <Route
                path="/admin/product/:id"
                element={<ProductManagement />}
              />
              <Route
                path="/admin/transaction/:id"
                element={<TransactionManagement />}
              />

              <Route path="/admin/chart/bar" element={<BarCharts />} />
              <Route path="/admin/chart/pie" element={<PieCharts />} />
              <Route path="/admin/chart/line" element={<LineCharts />} />

              <Route path="/admin/app/coupon" element={<Coupon />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="bottom-center" />
      </Router>
    </>
  );
};

export default App;
