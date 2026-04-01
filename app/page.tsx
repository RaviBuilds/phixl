import Banner from "@/components/Banner"
import HowItWorks from "@/components/HowItWorks"
import WhyChoose from "@/components/WhyChoose"
import Plans from "@/components/Plans"
import FAQ from "@/components/FAQ"


export default function Home():React.ReactElement {
  return(
    <main>
      <div className="w-full md:bg-[#050a14] md:relative md:mx-auto">
        <Banner />
      </div>
      <HowItWorks />
      <WhyChoose />
      <Plans />
      <FAQ />
    </main>
  )
}
