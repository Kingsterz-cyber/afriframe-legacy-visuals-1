import { Camera, Video, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import photographyImg from '@/assets/bridal-portrait.jpg';
import videographyImg from '@/assets/wedding-outdoor.jpg';
import eventImg from '@/assets/graduation-portrait.jpg';
import brandImg from '@/assets/fashion-portrait.jpg';

interface ServiceSelectionCardProps {
  onSelect: (service: {
    id: string;
    name: string;
    description: string;
    startingPrice: number;
    image: string;
  }) => void;
}

const services = [
  {
    id: 'photography',
    name: 'Photography',
    tagline: 'Cinematic portraits for weddings & brands.',
    description: 'High-res edited photos with professional color grading',
    startingPrice: 120,
    icon: Camera,
    image: photographyImg,
  },
  {
    id: 'videography',
    name: 'Videography',
    tagline: 'Event highlights and cinematic films.',
    description: '4K highlight films and social media edits',
    startingPrice: 350,
    icon: Video,
    image: videographyImg,
  },
  {
    id: 'event-coverage',
    name: 'Event Coverage',
    tagline: 'Multi-camera coverage for special events.',
    description: 'Full event documentation with multiple angles',
    startingPrice: 500,
    icon: Sparkles,
    image: eventImg,
  },
  {
    id: 'brand-content',
    name: 'Brand Content',
    tagline: 'Ad creatives for brands that convert.',
    description: 'Commercial photography and product videos',
    startingPrice: 800,
    icon: Briefcase,
    image: brandImg,
  },
];

const ServiceSelectionCard = ({ onSelect }: ServiceSelectionCardProps) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Select Your Service</h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect service for your cinematic experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="afri-glass group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] animate-in fade-in-50 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelect(service)}
            >
              {/* Hero Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                
                {/* Icon Overlay */}
                <div className="absolute top-4 right-4 p-3 bg-primary/90 rounded-lg backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  {service.tagline}
                </p>
                <p className="text-foreground/80 mb-4">
                  {service.description}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                  <div>
                    <span className="text-xs text-muted-foreground">Starting from</span>
                    <p className="text-2xl font-bold text-primary">
                      ${service.startingPrice}
                    </p>
                  </div>
                  <Button 
                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    size="lg"
                  >
                    Select Service
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelectionCard;
