"use client";

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton: {
    text: string;
    href: string;
  };
  backgroundClass: string;
  backgroundImage: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Your Premier Tool & Hardware Store",
    subtitle: "Quality Tools for Every Project",
    description: "Quality tools, reliable hardware, and expert service for all your projects. From professional contractors to weekend DIY enthusiasts.",
    primaryButton: {
      text: "Shop Now",
      href: "/shop"
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about"
    },
    backgroundClass: "bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-black/90",
    backgroundImage: "https://images.unsplash.com/photo-1700318131252-ab19c871ab60?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
  },
  {
    id: 2,
    title: "Professional Grade Equipment",
    subtitle: "Trusted by Contractors Nationwide",
    description: "Discover our extensive collection of professional-grade tools and equipment. Built to last, designed to perform.",
    primaryButton: {
      text: "Browse Catalog",
      href: "/shop"
    },
    secondaryButton: {
      text: "Contact Us",
      href: "/contact"
    },
    backgroundClass: "bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-gray-900/90",
    backgroundImage: "https://images.unsplash.com/photo-1584986152939-01133e0d31a2?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
  },
  {
    id: 3,
    title: "Fast Shipping & Expert Support",
    subtitle: "Get Your Tools When You Need Them",
    description: "Quick delivery, competitive prices, and unmatched customer service. Your satisfaction is our priority.",
    primaryButton: {
      text: "Start Shopping",
      href: "/shop"
    },
    secondaryButton: {
      text: "Get Support",
      href: "/contact"
    },
    backgroundClass: "bg-gradient-to-br from-zinc-900/90 via-neutral-800/90 to-stone-900/90",
    backgroundImage: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
  }
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      if (emblaApi) {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
      }
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex">
          {heroSlides.map((slide) => (
            <div key={slide.id} className="embla__slide flex-none w-full">
              <div 
                className={`relative ${slide.backgroundClass} text-white py-20 min-h-[600px] flex items-center bg-cover bg-center bg-no-repeat`}
                style={{
                  backgroundImage: `url(${slide.backgroundImage})`,
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
                
                <div className="container mx-auto px-4 text-center relative z-10">
                  <div className="max-w-4xl mx-auto">
                    <p className="text-lg md:text-xl text-gray-200 mb-4 font-medium">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                      <Button asChild size="default" className="bg-white text-black hover:bg-gray-100 font-semibold w-auto min-w-[140px] sm:min-w-[160px] px-4 sm:px-6">
                        <Link href={slide.primaryButton.href}>
                          {slide.primaryButton.text} <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Link>
                      </Button>
                      <Button 
                        asChild 
                        size="default"
                        variant="outline" 
                        className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black font-semibold transition-all duration-300 w-auto min-w-[140px] sm:min-w-[160px] px-4 sm:px-6"
                      >
                        <Link href={slide.secondaryButton.href}>
                          {slide.secondaryButton.text}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm z-10 hidden sm:flex"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm z-10 hidden sm:flex"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-white scale-110' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => scrollTo(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
