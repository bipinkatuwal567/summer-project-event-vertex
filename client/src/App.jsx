import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import MainLayout from "./components/MainLayout.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import Signin from "./pages/Signin.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import EventDetails from "./components/EventDetails.jsx";
import Success from "./components/Success.jsx";
import Failure from "./components/Failure.jsx";
import PaymentComponent from "./components/PaymentForm.jsx";
import PurchaseSuccess from "./pages/Esewa/PurchaseSuccess.jsx";
import PurchaseFail from "./pages/Esewa/PurchaseFail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Auth related routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
        </Route>

        {/* Private route for authenticated users */}
        <Route element={<PrivateRoute />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/payment" element={<PaymentComponent />} />
          <Route path="/esewa/purchase-success" element={<PurchaseSuccess />} />
          <Route path="/esewa/purchase-fail" element={<PurchaseFail />} />
        </Route>
        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
