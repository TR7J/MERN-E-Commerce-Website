import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import SearchBox from "./components/SearchBox";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="app">
      <ToastContainer position="bottom-center" limit={2} />
      <header>
        <Navbar />
      </header>

      <main>
        <div className="search-box-mobile">{isMobile && <SearchBox />}</div>
        {/* placeholder for the routes we define in createBrowserRouter */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
