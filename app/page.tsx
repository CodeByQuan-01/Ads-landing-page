"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  MessageCircle,
  Loader2,
  Briefcase,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  subscribeToWhatsAppLink,
  trackWhatsAppClick,
} from "@/lib/whatsapp-service";

export default function Home() {
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/1234567890");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToWhatsAppLink((link) => {
      setWhatsappLink(link);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const featureCards = [
    {
      title: "Score High-Paying Gigs",
      description:
        "Unlock weekly secrets to land premium projects on Upwork, Fiverr, and beyond—fast.",
      icon: DollarSign,
    },
    {
      title: "Charge What You're Worth",
      description:
        "Master pricing strategies to win clients and boost your income without lowballing.",
      icon: Target,
    },
    {
      title: "Shine with a Killer Portfolio",
      description:
        "Discover pro tips to craft a standout portfolio that attracts dream clients.",
      icon: Briefcase,
    },
  ];

  const handleWhatsAppClick = async () => {
    // Track the click in Firebase
    await trackWhatsAppClick();
    // Open WhatsApp link
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16 lg:mb-24">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="font-bold text-[#252525] text-4xl sm:text-5xl lg:text-7xl leading-tight mb-6 lg:mb-8 text-balance">
              Skyrocket Your Freelancing Success Today!
            </h1>

            <p className="text-[#252525cc] text-lg sm:text-xl lg:text-2xl leading-relaxed mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 text-pretty">
              Join our free WhatsApp channel for proven strategies, hot gig
              leads, and insider advice to earn more and work smarter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="px-8 sm:px-12 py-4 sm:py-6 bg-[#252525] rounded-[36px] hover:bg-[#252525]/90 text-lg sm:text-xl lg:text-2xl">
                Explore
              </Button>

              <Button
                onClick={handleWhatsAppClick}
                disabled={loading}
                className="flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-6 bg-[#25D366] rounded-[36px] hover:bg-[#25D366]/90 text-lg sm:text-xl lg:text-2xl disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                ) : (
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
                Jump In on WhatsApp Now!
              </Button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-none">
            <img
              className="w-full h-auto rounded-lg shadow-lg"
              alt="Freelancing Success Showcase"
              src="/portrait-cheerful-happy-african-man.jpg"
            />
          </div>
        </div>

        <Card className="bg-[#252525] rounded-[40px] border-none mb-16">
          <CardContent className="p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {featureCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start gap-4 lg:gap-6"
                  >
                    <div className="flex flex-col items-start gap-3">
                      <IconComponent className="w-8 h-8 text-[#25D366]" />
                      <h3 className="text-[#ffffffcc] text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-balance">
                        {card.title}
                      </h3>
                    </div>
                    <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed text-pretty">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-16">
          <Button
            onClick={handleWhatsAppClick}
            disabled={loading}
            className="flex items-center gap-3 px-12 py-6 bg-[#25D366] rounded-[36px] hover:bg-[#25D366]/90 text-xl lg:text-2xl font-bold mx-auto mb-4 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
            Join the Freelance Revolution Now!
          </Button>
          <p className="text-[#252525cc] text-lg lg:text-xl text-pretty">
            Free, instant access—don&apos;t miss out on your path to freelancing
            freedom!
          </p>
        </div>

        <footer className="text-center space-y-3 pt-8 border-t border-gray-200">
          <p className="text-[#252525cc] text-sm lg:text-base">
            Your privacy is safe with WhatsApp—no spam, leave anytime.
          </p>
          <p className="text-[#252525cc] text-sm lg:text-base">
            Got questions? Email support@freelancehub.example
          </p>
          <p className="text-[#25D366] font-semibold text-base lg:text-lg">
            Join 2,500+ freelancers crushing it daily!
          </p>
          <p className="text-[#252525] text-sm">© 2025 Freelance Hub</p>
        </footer>
      </div>
    </div>
  );
}
