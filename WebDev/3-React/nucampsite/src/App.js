import { Routes, Route } from "react-router-dom";
import ContactPage from "./pages/ContactPage.js";
import HomePage from "./pages/HomePage.js";

import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import CampsitesDirectoryPage from "./pages/CampsitesDirectoryPage.js";
import CampsiteDetailPage from "./pages/CampsiteDetailPage";
import AboutPage from "./pages/AboutPage";

import "./App.css";

function App() {
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
