import Banner from "@/components/Banner"
import HowItWorks from "@/components/HowItWorks"
import WhyChoose from "@/components/WhyChoose"
import Plans from "@/components/Plans"
import FAQ from "@/components/FAQ"
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Phixl AI | Bring Your Family History Back to Life",
  description:
    "Seamlessly repair tears, remove scratches, and vividly colorize faded black-and-white photos with artifact-free AI. Start restoring your digital heritage today.",
  keywords: [
    "photo restoration",
    "restore old photos",
    "AI photo repair",
    "family history preservation",
    "genealogical research tools",
    "colorize black and white photos",
    "fix water damaged photos",
    "digital heritage",
  ],
  alternates: {
    canonical: "/",
  },
};


export default function Home():React.ReactElement {
  return (
    <main className="bg-canvas">
      <Banner />
      <HowItWorks />
      <WhyChoose />
      <Plans />
      <FAQ />
    </main>
  )
}
