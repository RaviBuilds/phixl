
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
      <div className="section-wrapper">
        <div className="section-heading section-heading-why">
          <span className="main-tagline mx-auto !block max-w-fit">
            Why Choose Phixl?
          </span>
          <h2 className="section-title section-title-why ">
            Experience the Best AI Technology
          </h2>
          <p className="section-subtitle">
            Our advanced features make creating stunning transformations simple
            and fast
          </p>
        </div>
        <div className="section-content-cards">
          <div className="cards-wrapper">
            {whyChooseData.map((data) => (
              <div className="feature-card" key={data.id}>
                <div className="feature-card-img">{data.icon}</div>
                <h3 className="feature-card-heading">{data.iconInfo}</h3>
                <p className="feature-card-info">
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
