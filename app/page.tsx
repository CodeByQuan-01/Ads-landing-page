"use client";

import { useState, useEffect } from "react";
import { CloudIcon, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/1234567890");

  useEffect(() => {
    // Load WhatsApp link from localStorage
    const savedLink = localStorage.getItem("whatsappLink");
    if (savedLink) {
      setWhatsappLink(savedLink);
    }
  }, []);

  const featureCards = [
    {
      title: "Creative Solutions",
      description:
        "Innovative designs that capture your brand's essence and engage your audience.",
    },
    {
      title: "Expert Team",
      description:
        "Professional designers with years of experience in creating stunning visuals.",
    },
    {
      title: "Fast Delivery",
      description:
        "Quick turnaround times without compromising on quality and attention to detail.",
    },
  ];

  const handleWhatsAppClick = () => {
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16 lg:mb-24">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-bold text-[#252525] text-4xl sm:text-5xl lg:text-7xl leading-tight mb-6 lg:mb-8">
              New designs
              <br />
              New inspirations
            </h1>

            <p className="text-[#252525cc] text-lg sm:text-xl lg:text-2xl leading-relaxed mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0">
              Transform your ideas into stunning visual experiences. Our
              creative team delivers exceptional designs that make your brand
              stand out in today&apos;s competitive market.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="px-8 sm:px-12 py-4 sm:py-6 bg-[#252525] rounded-[36px] hover:bg-[#252525]/90 text-lg sm:text-xl lg:text-2xl">
                Explore
              </Button>

              <Button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-6 bg-[#25D366] rounded-[36px] hover:bg-[#25D366]/90 text-lg sm:text-xl lg:text-2xl"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Contact Us
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <img
              className="w-full h-auto rounded-lg shadow-lg"
              alt="Creative Design Showcase"
              src="/modern-design-showcase-with-creative-elements.jpg"
            />
          </div>
        </div>

        <Card className="bg-[#252525] rounded-[40px] border-none">
          <CardContent className="p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {featureCards.map((card, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start gap-4 lg:gap-6"
                >
                  <div className="flex flex-col items-start gap-3">
                    <CloudIcon className="w-6 h-6 text-white" />
                    <h3 className="text-[#ffffffcc] text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="fixed bottom-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/admin")}
            className="text-gray-400 hover:text-gray-600 text-xs bg-white/80 backdrop-blur-sm"
          >
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
