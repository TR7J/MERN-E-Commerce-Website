import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left-center-right">
        <div className="footer-left">
          <h1>Mot du Jour</h1>
        </div>
        <div className="footer-center-right">
          <div className="footer-center">
            <div className="footer-categories">
              <h3>About Us </h3>
              <ul>
                <li className="footer-categories-li">About Mot Du Jour</li>
                <li className="footer-categories-li">Privacy and Cookies</li>
                <li className="footer-categories-li">Your Privacy Cookies</li>
                <li className="footer-categories-li">Terms & Conditions</li>
                <li className="footer-categories-li">Billing Policy</li>
              </ul>
            </div>
          </div>
          <div className="footer-center">
            <div className="footer-categories">
              <h3>Support </h3>
              <ul>
                <li className="footer-categories-li">Safety Tips</li>
                <li className="footer-categories-li">Contact Us</li>
                <li className="footer-categories-li">Socials</li>
                <li className="footer-categories-li">FAQ</li>
              </ul>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-categories">
              <h3>Categories</h3>
              <ul>
                <li className="footer-categories-li">Braking System</li>
                <li className="footer-categories-li">Cooling System</li>
                <li className="footer-categories-li">Engine Parts</li>
                <li className="footer-categories-li">Lubricants</li>
                <li className="footer-categories-li">Transmission</li>
                <li className="footer-categories-li">& More</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="social-icons">
          <i className="fab fa-linkedin"></i>
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-youtube"></i>
        </div>
        <p>© 2024 Mot du Jour</p>
      </div>
    </footer>
  );
};

export default Footer;
