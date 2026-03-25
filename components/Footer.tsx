const disclaimers: string[] = [
  "Do not upload images of other individuals without their clear and written consent.",
  "You are fully responsible for the images you upload and restore using this service.",
  "Phixl AI is developed for photo restoration and enhancement purposes only and is not intended to harm, offend, or misrepresent anyone.",
  "This platform does not support or promote the creation of deepfake content.",
  "Phixl AI is focused solely on enhancing old or damaged images using AI and is not intended for explicit or adult content generation.",
  "Deepfake generation is strictly prohibited and technically restricted on this platform.",
];

const popularServices: string[] = [
  "AI Photo Restoration with Phixl AI",
  "Old Family Photo Enhancer with Phixl AI",
  "Black & White to Color Photo Converter",
  "AI Face Sharpener for Blurry Images",
  "Scratch & Damage Remover for Vintage Photos",
];

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
