import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import OrganizerRoute from "./components/OrganizerRoute.jsx";
import AccountCreatedSuccess from './components/AccountCreatedSuccess';
import GoogleSignupSuccess from './components/GoogleSignupSuccess';

import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import EventDetails from "./components/EventDetails.jsx";
import PaymentComponent from "./components/PaymentForm.jsx";
import PurchaseSuccess from "./pages/Esewa/PurchaseSuccess.jsx";
import PurchaseFail from "./pages/Esewa/PurchaseFail.jsx";
import OrganizerMyEvents from "./components/OrganizerMyEvents.jsx";

function App() {
  // Log when App component renders
  console.log("App component rendering, routes being set up");
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetails />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/sign-in" element={<Signin />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/payment" element={<PaymentComponent />} />
          <Route path="/esewa/purchase-success" element={<PurchaseSuccess />} />
          <Route path="/esewa/purchase-fail" element={<PurchaseFail />} />

          {/* Organizer Only Routes */}
          <Route element={<OrganizerRoute />}>
            <Route path="/organizer-dashboard" element={<OrganizerMyEvents />} />
          </Route>
        </Route>
        
        {/* Success Pages - These should NOT be inside PrivateRoute */}
        <Route path="/account-created-success" element={<AccountCreatedSuccess />} />
        <Route path="/google-signup-success" element={<GoogleSignupSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
