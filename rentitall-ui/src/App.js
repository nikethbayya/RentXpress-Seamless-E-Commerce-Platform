import './App.css';
import './variables.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./screens/login-page/LoginPage";
import { SignupPage } from "./screens/signup-page/SignupPage";
import { HomePage } from "./screens/home-page/HomePage";
import { ForgotPasswordPage } from "./screens/forgot-password/ForgotPasswordPage";
import { ResetPassword } from "./screens/reset-password/ResetPassword";
import { ProtectedRoute } from "./wrapper/ProtectedRoute";
import { createContext, useCallback, useState } from "react";
import { NavBar } from "./components/NavBar";
import { Footer } from "./components/Footer";
import { ProductListModal } from './components/ProductListModal';
import { SessionProvider } from "./hooks/SessionContext";
import { AdminPanel } from "./screens/admin-panel/AdminPanel";
import { ManageProducts } from "./screens/manage-products/ManageProducts";
import { RentalItems } from './screens/rental-items';
import { ResultsPage } from './screens/results';
import { SuccessPopup } from "./components/SuccessPopup";
import DummyPaymentPage from "./components/DummyPaymentPage";
import { LoadScript } from '@react-google-maps/api';
import {ManageAccount} from "./components/ManageAccount";
import { Messaging } from './screens/messaging';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY

const UserContext = createContext();
function App() {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = useCallback(() => {
        setShowModal(prev => !prev)
    }, []);

    return (
        <SessionProvider>
            <Router>
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
                    <div className="App">
                        <NavBar handleProductListModal={toggleModal} />
                        <div className='routes'>
                            <Routes>
                                <Route exact path='/' element={<Navigate to='/home' />} />
                                <Route exact path='/login' element={<LoginPage />} />
                                <Route exact path='/signup' element={<SignupPage />} />
                                <Route exact path='/home' element={<HomePage handleProductListModal={toggleModal} />} />
                                <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
                                <Route exact path='/reset-password' element={
                                    <ProtectedRoute><ResetPassword /></ProtectedRoute>
                                } />
                                {/*<Route exact path='/admin' element={*/}
                                {/*    <ProtectedRoute><AdminPanel /></ProtectedRoute>*/}
                                {/*} />*/}
                                <Route exact path='/admin' element={<AdminPanel />} />
                                <Route exact path='/manage-products' element={<ManageProducts />} />
                                <Route exact path='/manage-account' element={<ManageAccount />} />
                                <Route exact path='/rental-items' element={<RentalItems />} />
                                <Route exact path='/results' element={<ResultsPage />} />
                                <Route path="/payment" element={<DummyPaymentPage />} />
                                <Route path="/payment-success" element={<SuccessPopup />} />
                                <Route path = "/messaging" element={<Messaging />} />
                            </Routes>
                        </div>
                        <ProductListModal show={showModal} closeModal={toggleModal} />
                        <Footer />
                    </div>
                </LoadScript>
            </Router>
        </SessionProvider>
    );
}

export default App;
