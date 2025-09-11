import { Routes, Route } from "react-router-dom";
import ContactPage from "./pages/ContactPage.js";
import HomePage from "./pages/HomePage.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCampsites } from "./features/campsites/campsitesSlice.js";
import { fetchPartners } from "./features/partners/partnersSlice.js";
import { fetchPromotions } from "./features/promotions/promotionsSlice.js";
import { fetchComments } from "./features/comments/commentsSlice.js";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import CampsitesDirectoryPage from "./pages/CampsitesDirectoryPage.js";
import CampsiteDetailPage from "./pages/CampsiteDetailPage";
import AboutPage from "./pages/AboutPage";

import "./App.css";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCampsites());
        dispatch(fetchPartners());
        dispatch(fetchPromotions());
        dispatch(fetchComments());
    }, [dispatch]);

    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="directory" element={<CampsitesDirectoryPage />} />
                <Route path="directory/:campsiteId" element={<CampsiteDetailPage />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
