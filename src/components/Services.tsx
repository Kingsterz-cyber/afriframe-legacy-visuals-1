import { Button } from "@/components/ui/button";
import { Camera, Video, Sparkles, Edit, Image, Briefcase } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Camera,
      title: "Photography",
      description: "Cinematic portraits & editorial wedding photography",
      deliverables: [
        "High-res edited photos",
        "Professional color grading",
        "Private online gallery"
      ],
      startingPrice: "$120/hour"
    },
    {
      icon: Video,
      title: "Videography",
      description: "Event highlights, cinematic films, social clips",
      deliverables: [
        "4K highlight film",
        "Social media edits",
        "Raw footage access"
      ],
      startingPrice: "$350"
    },
    {
      icon: Sparkles,
      title: "Event Coverage",
      description: "Multi-camera coverage for conferences & concerts",
      deliverables: [
        "Full event documentation",
        "Multiple angles",
        "Same-day delivery options"
      ],
      startingPrice: "$500"
    },
    {
      icon: Briefcase,
      title: "Brand Content",
      description: "Ad creatives and product films made to convert",
      deliverables: [
        "Commercial photography",
        "Product videos",
        "Social content strategy"
      ],
      startingPrice: "$800"
    },
    {
      icon: Edit,
      title: "Post-Production",
      description: "Professional retouching & color grading services",
      deliverables: [
        "Advanced retouching",
        "Cinematic color grading",
        "Fast turnaround"
      ],
      startingPrice: "$50/photo"
    },
    {
      icon: Image,
      title: "Albums & Prints",
      description: "Premium printed albums and wall art",
      deliverables: [
        "Fine art prints",
        "Custom albums",
        "Framing options"
      ],
      startingPrice: "Custom"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From intimate moments to grand celebrations, we craft visual stories that resonate
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="afri-glass p-6 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </div>

                {/* Deliverables */}
                <ul className="space-y-2 mb-4">
                  {service.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                  <div>
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <p className="text-lg font-bold text-primary">{service.startingPrice}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="group-hover:bg-primary/20 transition-colors"
                  >
                    Select
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="afri-glass p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Need a Custom Package?</h3>
            <p className="text-muted-foreground mb-6">
              Every story is unique. Let's discuss what you need and create a tailored solution.
            </p>
            <Button 
              size="lg"
              className="afri-glass border-2 border-primary hover:bg-primary/20"
            >
              Request Custom Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
