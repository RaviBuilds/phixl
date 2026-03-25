import {popularServices } from "@/lib/content";
import { disclaimers } from "@/lib/content";

export default function Footer(): React.ReactElement {
  return (
    <section>
      <div className="section-wrapper">
        <footer>
          <div className="quicklinks">
            <h3>Quick Links</h3>
            <ul>
              <li>Terms</li>
              <li>Privacy</li>
              <li>Contact</li>
            </ul>
          </div>
          <hr />
          <div className="popular-services">
            <h3>Popular Services</h3>
            <ul>
              {popularServices.map((item) => (
                <li key={item}>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <span className="rights">© 2025 Phixl. All rights reserved.</span>
          <hr />
          <div className="disclaimer">
            <ul>
              {disclaimers.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}
