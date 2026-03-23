import img1 from "@/public/img1.jpg";
import img2 from "@/public/img2.jpg";
import RedBtn from "@/components/RedBtn";
import ImageReveal from "@/components/ImageReveal";

export default function Banner(): React.ReactElement {
  return (
    <section className="banner-container">
      <div className="text-section">
        <span className="main-tagline">✨ AI-Powered Technology</span>
        <h1>
          Restore images with
          <span className="highlighted-title">Phixl AI</span>
        </h1>
        <p>
          Experiance the future of restore images with our advanced restore AI
          technology.
        </p>
        <div className="button-section">
          <div className="button-combo">
            <RedBtn className="w-full">Restore Now</RedBtn>

            <span className="btn-tagline">✨ 3 free images included</span>
          </div>

          <button className="button-outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.49.8-.75 3.12-1.36 5.2-2.26 6.24-2.7 2.98-1.25 3.6-1.47 4.01-1.47.09 0 .28.02.4.12.11.08.14.19.16.27.02.07.02.14.01.2z"></path>{" "}
            </svg>
            <span>Telegram Bot</span>
          </button>
          <button className="button-outline">
            <span>Learn More</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-y-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>{" "}
            </svg>
          </button>
        </div>
        <div className="header-card">
          <div className="card">
            <div className="card-icon">👥</div>
            <h5>+450K</h5>
            <span>Users</span>
          </div>

          <div className="card">
            <div className="card-icon">🖼️</div>
            <h5>+450K</h5>
            <span>Images</span>
          </div>
          <div className="card">
            <div className="card-icon">⚡</div>
            <h5>+450K</h5>
            <span>Uptime</span>
          </div>
        </div>
      </div>

      <ImageReveal img1={img1} img2={img2} />

      <div className="header-card-sm ">
        <div className="card">
          <div className="card-icon">👥</div>
          <h5>+450K</h5>
          <span>Users</span>
        </div>

        <div className="card">
          <div className="card-icon">🖼️</div>
          <h5>+450K</h5>
          <span>Images</span>
        </div>
        <div className="card">
          <div className="card-icon">⚡</div>
          <h5>+450K</h5>
          <span>Uptime</span>
        </div>
      </div>
    </section>
  );
}
