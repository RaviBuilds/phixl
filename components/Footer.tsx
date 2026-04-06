import { popularServices } from "@/utils/content";
import { disclaimers } from "@/utils/content";

export default function Footer(): React.ReactElement {
  return (
    <section className="bg-blue-low-200! px-6! ">
      <div className="px-6 max-w-full py-15 md:py-15 md:max-w-181 md:mx-auto lg:max-w-full">
        <footer>
          <div>
            <h3 className="mb-4 text-[1rem] text-white-fresh font-semibold">
              Quick Links
            </h3>
            {/* Exact translation of `footer .quicklinks ul` */}
            <ul className="flex flex-row gap-5">
              {/* Exact translation of `footer li` */}
              <li className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors">
                Terms
              </li>
              <li className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors">
                Privacy
              </li>
              <li className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors">
                Contact
              </li>
            </ul>
          </div>

          <hr className="border-[#282e3a] my-6" />

          <div>
            <h3 className="mb-4 text-[1rem] text-amber-50 font-semibold">
              Popular Services
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 ml-0 w-max gap-3">
              {popularServices.map((item) => (
                <li
                  key={item}
                  className="text-sm text-color-white! cursor-pointer hover:text-red-brand-light! transition-colors"
                >
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <span className="text-sm text-gray-400 text-center block mt-10">
            © 2025 Phixl. All rights reserved.
          </span>

          <hr className="border-[#282e3a] my-6" />

          <div className="pb-10!">
            <ul>
              {disclaimers.map((item) => (
                <li
                  key={item}
                  className="mb-4! text-sm text-gray-500 cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}

/*import {popularServices } from "@/utils/content";
import { disclaimers } from "@/utils/content";

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
*/
