import { useState } from "react";
import weddingOutdoor from "@/assets/wedding-outdoor.jpg";
import weddingIndoor from "@/assets/wedding-indoor.jpg";
import chefPortrait from "@/assets/chef-portrait.jpg";
import fashionPortrait from "@/assets/fashion-portrait.jpg";
import fashionJewelry from "@/assets/fashion-jewelry.jpg";
import redDressRose from "@/assets/red-dress-rose.jpg";
import graduationPortrait from "@/assets/graduation-portrait.jpg";
import blueHatFashion from "@/assets/blue-hat-fashion.jpg";
import redSuitPink from "@/assets/red-suit-pink.jpg";
import mysteryHat from "@/assets/mystery-hat.jpg";
import bridalPortrait from "@/assets/bridal-portrait.jpg";
import lifestylePortrait from "@/assets/lifestyle-portrait.jpg";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Weddings", "Portraits", "Commercial"];

  const portfolioItems = [
    {
      id: 1,
      image: weddingOutdoor,
      title: "Golden Hour Ceremony",
      category: "Weddings",
      description: "Intimate outdoor wedding captured in natural light"
    },
    {
      id: 2,
      image: weddingIndoor,
      title: "Elegant Reception",
      category: "Weddings",
      description: "Luxurious indoor celebration with cinematic framing"
    },
    {
      id: 3,
      image: bridalPortrait,
      title: "Radiant Bride",
      category: "Weddings",
      description: "Stunning bridal portrait with elegant details"
    },
    {
      id: 4,
      image: chefPortrait,
      title: "Culinary Artist",
      category: "Commercial",
      description: "Professional brand photography for hospitality"
    },
    {
      id: 5,
      image: fashionPortrait,
      title: "Editorial Portrait",
      category: "Portraits",
      description: "Fashion-forward lifestyle photography"
    },
    {
      id: 6,
      image: fashionJewelry,
      title: "Luxury Accessories",
      category: "Commercial",
      description: "Product and lifestyle photography fusion"
    },
    {
      id: 7,
      image: redDressRose,
      title: "Romantic Elegance",
      category: "Portraits",
      description: "Creative studio portrait with vibrant colors"
    },
    {
      id: 8,
      image: graduationPortrait,
      title: "Milestone Achievement",
      category: "Portraits",
      description: "Dramatic graduation photography with cinematic lighting"
    },
    {
      id: 9,
      image: blueHatFashion,
      title: "Bold Fashion",
      category: "Portraits",
      description: "High-fashion editorial with statement accessories"
    },
    {
      id: 10,
      image: redSuitPink,
      title: "Power & Style",
      category: "Commercial",
      description: "Contemporary fashion photography for brand campaigns"
    },
    {
      id: 11,
      image: mysteryHat,
      title: "Artistic Mystery",
      category: "Portraits",
      description: "Moody and artistic portrait with dramatic shadows"
    },
    {
      id: 12,
      image: lifestylePortrait,
      title: "Natural Beauty",
      category: "Portraits",
      description: "Soft lifestyle portrait with warm natural light"
    },
  ];

  const filteredItems = activeFilter === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Curated Collections</h2>
          <p className="text-xl text-muted-foreground">Pick a story — each frame tells one</p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full transition-all ${
                activeFilter === filter
                  ? "afri-glass border-2 border-primary text-primary"
                  : "bg-secondary/50 text-foreground/70 hover:bg-secondary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="afri-glass p-4">
                    <span className="text-primary text-sm font-semibold">{item.category}</span>
                    <h3 className="text-2xl font-bold mt-2 mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Want to see more? Let's create something beautiful together.</p>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
