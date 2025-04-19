import { CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import RouteEstimator from './customers/components/RouteEstimator';


import darkTheme from "./theme/DarkTheme";
import Routers from "./Routers/Routers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./State/Authentication/Action";
import { findCart } from "./State/Customers/Cart/cart.action";
import {
  getAllRestaurantsAction,
  getRestaurantById,
  getRestaurantByUserId,
} from "./State/Customers/Restaurant/restaurant.action";

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const { restaurantByUserId } = useSelector(store => store.restaurant);
  console.log("🏷️ App.js – restaurantByUserId slice:", restaurantByUserId);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {

    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(findCart(jwt));
      dispatch(getAllRestaurantsAction(jwt));
    }
  }, [auth.jwt]);

  useEffect(() => {
    if (auth.user?.role == "ROLE_RESTAURANT_OWNER") {
      dispatch(getRestaurantByUserId(auth.jwt || jwt));
    }
  }, [auth.user]);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routers />
      {/* auto‑route: uses the restaurant record you fetched elsewhere */}
      <RouteEstimator restaurantId={2} />
      {/*<RouteEstimator restaurantId={restaurantByUserId?.id} />*/}
    </ThemeProvider>
  );
}

export default App;
