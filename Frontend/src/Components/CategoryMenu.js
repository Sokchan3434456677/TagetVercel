import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './Style/style.css';
const CategoryMenu = () => {
  const location = useLocation(); 
  const [activeTab, setActiveTab] = useState(""); 
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);
  return (
    <div className="section-title">
      <h3 className="title">TARGET STORE</h3>
      <div className="section-nav">
        <ul className="section-tab-nav tab-nav">
          <li className={activeTab === "/hoodie" ? "active active4" : ""}>
            <Link to="/new-arrivas">NEW ARRIVALS</Link>
          </li>
          <li className={activeTab === "/t-shirt" ? "active active4" : ""}>
            <Link to="/hoodies">HOODIES</Link>
          </li>
          <li className={activeTab === "/stussy-cap" ? "active active4" : ""}>
            <Link to="/tees">TEES</Link>
          </li>
          <li className={activeTab === "/sweat-shorts" ? "active active4" : ""}>
            <Link to="/outfits">OUTFITS</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default CategoryMenu;
