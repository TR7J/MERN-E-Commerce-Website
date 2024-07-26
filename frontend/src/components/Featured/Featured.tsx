import { Link } from "react-router-dom";
import "./Featured.css";

export default function Featured() {
  return (
    <div className="featured">
      <div className="featured-center">
        <div className="featured-columns-wrapper">
          <div className="column">
            <div className="featured-title-desc-btns">
              <h1 className="featured-title">Clutch Kits</h1>
              <p className="featured-desc">
                A clutch kit is an essential component in manual transmission
                vehicles, consisting of a clutch disc, pressure plate, and
                release bearing. It facilitates smooth engagement and
                disengagement of the engine and transmission, ensuring efficient
                power transfer, improved driving control, and prolonged
                transmission life. Ideal for performance upgrades or routine
                replacements.
              </p>
              <div className="featured-buttons-wrapper">
                <Link
                  to={`/product/Clutch-kits`}
                  className="button-link outline white"
                >
                  View Reviews
                </Link>

                <Link to={"/search"} className="button white">
                  Other Spares
                </Link>
              </div>
            </div>
          </div>
          <div className="featured-image">
            <img src="/images/ck-transparent.png" alt="clutch-kits" />
          </div>
        </div>
      </div>
    </div>
  );
}
