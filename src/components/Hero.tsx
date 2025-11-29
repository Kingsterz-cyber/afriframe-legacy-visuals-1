import { Button } from "@/components/ui/button";
import { Camera, Phone } from "lucide-react";
import bgStars from "@/assets/bg-stars.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgStars})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glass Card with Hero Content */}
          <div className="afri-glass p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <Camera className="w-16 h-16 text-primary" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
              We Capture Moments That Live Forever
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Afriframe Pictures transforms fleeting moments into cinematic stories — photography & films for weddings, events, and brands.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 afri-glass border-2 border-primary hover:bg-primary/20"
                onClick={() => window.location.href = '/booking'}
              >
                Book a Shoot
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-2 border-foreground/30 hover:border-foreground/60"
                onClick={() => scrollToSection('portfolio')}
              >
                View Portfolio
              </Button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <span>500+ Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              <span>Available Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
