import { Button } from "@/components/ui/button";
import { Camera, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="container mx-auto px-4">
        <div className="afri-glass px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-primary" strokeWidth={1.5} />
              <span className="text-2xl font-bold">Afriframe Pictures</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                size="sm"
                className="afri-glass border-2 border-primary hover:bg-primary/20"
                onClick={() => window.location.href = '/booking'}
              >
                Book Now
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                onClick={() => window.location.href = '/admin-login'}
                className="flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-foreground/10">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className="text-left text-foreground/80 hover:text-foreground transition-colors py-2"
                  >
                    {item.label}
                  </button>
                ))}
                <Button 
                  size="sm"
                  className="w-full afri-glass border-2 border-primary hover:bg-primary/20"
                  onClick={() => window.location.href = '/booking'}
                >
                  Book Now
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => window.location.href = '/admin-login'}
                  className="w-full flex items-center gap-2 justify-center"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;