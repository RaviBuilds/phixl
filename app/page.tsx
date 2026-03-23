import Banner from "@/components/Banner"
import HowItWorks from "@/components/HowItWorks"
import WhyChoose from "@/components/WhyChoose"
import Plans from "@/components/Plans"
import FAQ from "@/components/FAQ"


export default function Home():React.ReactElement {
  return(
    <main>
      <div className="banner-wrapper">
        <Banner />
      </div>
      <HowItWorks />
      <WhyChoose />
    </main>
  )
}
