import { Camera, Award, Heart } from "lucide-react";
import bgBlueOrbs from "@/assets/bg-blue-orbs.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgBlueOrbs})` }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">About Afriframe</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We tell honest, cinematic stories — one frame at a time
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="afri-glass p-8 md:p-12 mb-8">
            <p className="text-lg leading-relaxed mb-6">
              Afriframe Pictures was born from a passion for preserving life's most precious moments 
              in their most authentic form. We believe every smile, every tear, every glance tells a story 
              worth remembering forever.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our approach combines technical excellence with emotional intelligence. We don't just 
              capture images — we craft visual narratives that transport you back to the feeling, 
              the atmosphere, the magic of your special moments.
            </p>
            <p className="text-lg leading-relaxed">
              From intimate weddings to bold commercial projects, we bring the same commitment: 
              cinematic quality, genuine emotion, and timeless elegance.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="afri-glass p-6 text-center">
              <div className="flex justify-center mb-4">
                <Camera className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Professional Equipment</h3>
              <p className="text-sm text-muted-foreground">
                Sony/Canon mirrorless systems, cinema lenses, and drone support
              </p>
            </div>

            <div className="afri-glass p-6 text-center">
              <div className="flex justify-center mb-4">
                <Award className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Award-Winning Work</h3>
              <p className="text-sm text-muted-foreground">
                Recognized for excellence in photography and cinematography
              </p>
            </div>

            <div className="afri-glass p-6 text-center">
              <div className="flex justify-center mb-4">
                <Heart className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Client-Centered</h3>
              <p className="text-sm text-muted-foreground">
                Your vision, our expertise — collaboration at every step
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
