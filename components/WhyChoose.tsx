import RedLabel from "@/components/RedLabel";

interface WhyChooseTypes{
  id:string;
  icon:string;
  iconInfo:string;
  description:string;
}

 const whyChooseData: WhyChooseTypes[] = [
   {
     id: "step1",
     icon: "🎯",
     iconInfo: "User-Friendly",
     description:
       "Our intuitive interface allows you to effortlessly restore images in just seconds.",
   },
   {
     id: "step2",
     icon: "⚡",
     iconInfo: "Consistent Quality",
     description:
       "Our advanced AI ensures reliable and high-quality restoration results every time.",
   },
   {
     id: "step3",
     icon: "🔒",
     iconInfo: "Privacy Assured",
     description:
       "Your images are securely processed and stored in your account for limited time, ensuring your privacy.",
   },
   {
     id: "step4",
     icon: "⚡️",
     iconInfo: "Lighting Speed",
     description:
       "Experience instant results with our fast AI technology, restore old images in mere seconds.",
   },
   {
     id: "step5",
     icon: "💰",
     iconInfo: "Cost-Effective",
     description:
       "Our affordable pricing plans make old image restoration accessible to everyone.",
   },
   {
     id: "step6",
     icon: "📈",
     iconInfo: "Scalable Solutions",
     description:
       "Whether you're an individual user or part of a large team, our restore old images service scales to meet all your needs.",
   },
 ];
 
export default function WhyChoose(): React.ReactElement {

  return (
    <section>
      <div className="px-6 max-w-full py-15 md:py-25 md:max-w-[724px] md:mx-auto lg:max-w-full">
        <div className="mb-8! md:max-w-[600px]! block mx-auto!">
          <div className="w-full flex items-center justify-center">
            <RedLabel>🤔 Why Choose Phixl ?</RedLabel>
          </div>
          <h2 className="text-center text-4xl font-bold mb-4 md:text-5xl text-color-white-fresh">
            Experience the Best AI Technology
          </h2>
          <p className="text-center text-lg text-color-gray">
            Our advanced features make creating stunning transformations simple
            and fast
          </p>
        </div>
        <div className="pt-3">
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(18rem,1fr))]">
            {whyChooseData.map((data) => (
              <div
                className="bg-blue-low-200 border border-gray-text rounded-2xl p-6 text-start cursor-pointer"
                key={data.id}
              >
                <div className="text-4xl mb-4">{data.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-color-white-fresh">
                  {data.iconInfo}
                </h3>
                <p className="text-[1rem] text-color-white-low">
                  {data.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
