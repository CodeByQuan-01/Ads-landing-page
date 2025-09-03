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
    <div className="bg-white grid justify-items-center [align-items:start] w-screen">
      <div className="bg-white w-[1440px] h-[1024px] relative">
        <div className="inline-flex flex-col items-start gap-8 absolute top-36 left-[65px]">
          <h1 className="relative w-[637px] mt-[-1.00px] [font-family:'Avenir-Heavy',Helvetica] font-normal text-[#252525] text-7xl tracking-[0] leading-[88px]">
            New designs
            <br />
            New inspirations
          </h1>

          <p className="relative w-[586px] [font-family:'Avenir-Roman',Helvetica] font-normal text-[#252525cc] text-[26px] tracking-[0] leading-[normal]">
            Transform your ideas into stunning visual experiences. Our creative
            team delivers exceptional designs that make your brand stand out in
            today&apos;s competitive market.
          </p>

          <div className="flex gap-4">
            <Button className="inline-flex items-start gap-2.5 px-12 py-6 relative flex-[0_0_auto] bg-[#252525] rounded-[36px] overflow-hidden h-auto hover:bg-[#252525]/90">
              <span className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[18px] whitespace-nowrap">
                Explore
              </span>
            </Button>

            <Button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-3 px-12 py-6 relative flex-[0_0_auto] bg-[#25D366] rounded-[36px] overflow-hidden h-auto hover:bg-[#25D366]/90"
            >
              <MessageCircle className="w-6 h-6 text-white" />
              <span className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[18px] whitespace-nowrap">
                Contact Us
              </span>
            </Button>
          </div>
        </div>

        <img
          className="absolute w-[548px] h-[519px] top-[92px] left-[828px]"
          alt="Creative Design Showcase"
          src="/modern-design-showcase-with-creative-elements.jpg"
        />

        <Card className="absolute top-[667px] left-16 bg-[#252525] rounded-[40px] border-none">
          <CardContent className="inline-flex flex-col items-start gap-2 p-16">
            <div className="gap-[118px] inline-flex items-start relative flex-[0_0_auto]">
              {featureCards.map((card, index) => (
                <div
                  key={index}
                  className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]"
                >
                  <div className="flex-col gap-3 inline-flex items-start relative flex-[0_0_auto]">
                    <CloudIcon className="relative w-6 h-6 text-white" />

                    <h3 className="relative w-[316px] [font-family:'Avenir-Heavy',Helvetica] font-normal text-[#ffffffcc] text-[32px] tracking-[0] leading-[normal]">
                      {card.title}
                    </h3>
                  </div>

                  <p className="relative w-[316px] [font-family:'Avenir-Book',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Access Link */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/admin")}
            className="text-gray-400 hover:text-gray-600 text-xs"
          >
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
}
