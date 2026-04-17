import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Phixl AI | Historical Photo Restoration",
    short_name: "Phixl AI",
    description: "Restore faded black-and-white photos with artifact-free AI.",
    start_url: "/",
    display: "standalone", // Hides the browser UI when installed on a phone
    background_color: "#050a14",
    theme_color: "#c20074", // Your red-brand color
    icons: [
      {
        src: "/favicon.ico", // Make sure you have a favicon in your public/ folder!
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
