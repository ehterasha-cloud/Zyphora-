import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Activity, Users, ArrowRight, Menu, X, ChevronRight, Target } from 'lucide-react';

const Reveal = ({ children, className = "", threshold = 0.1 }: { children: React.ReactNode, className?: string, threshold?: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        } else {
          entry.target.classList.remove('animate-in');
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return <div ref={ref} className={className}>{children}</div>;
};

const Magnetic = ({ children, className = "", ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate(0px, 0px)`;
  };

  return (
    <div 
      ref={ref} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out inline-block magnetic ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const TypewriterText = ({ text }: { text: string }) => {
  return (
    <span className="inline-block">
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className="typewriter-char" 
          style={{ transitionDelay: `${i * 0.03}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateRing);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, .magnetic')) {
        ring?.classList.add('hovered');
      } else {
        ring?.classList.remove('hovered');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'The Expert', href: '#expert' },
    { name: 'Trainers', href: '#trainers' },
  ];

  return (
    <div className="min-h-screen bg-zyphora-dark text-white selection:bg-zyphora-red selection:text-white relative">
      <div id="cursor-dot" className="cursor-dot hidden md:block"></div>
      <div id="cursor-ring" className="cursor-ring hidden md:block"></div>
      
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }}></div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-zyphora-dark/90 backdrop-blur-md border-b border-zyphora-border py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Magnetic>
            <a href="#" className="group flex items-center gap-1">
              <span className="font-bebas text-3xl md:text-4xl tracking-[0.15em] text-white group-hover:text-gray-300 transition-colors">
                ZYPHOR<span className="text-zyphora-red">A</span>
              </span>
            </a>
          </Magnetic>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Magnetic key={link.name}>
                <a href={link.href} className="nav-link text-sm font-medium tracking-widest uppercase text-gray-400 hover:text-white transition-colors py-2">
                  {link.name}
                </a>
              </Magnetic>
            ))}
            <Magnetic>
              <a href="#contact" className="px-6 py-2 border border-zyphora-border hover:border-zyphora-red text-sm font-medium tracking-widest uppercase transition-all hover:bg-zyphora-red hover:text-white">
                Join Now
              </a>
            </Magnetic>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zyphora-dark flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="font-bebas text-4xl tracking-widest hover:text-zyphora-red transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 px-8 py-4 bg-zyphora-red text-white font-bebas text-2xl tracking-widest"
          >
            START TRAINING
          </a>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-heat">
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16 w-full">
          <Reveal className="flex justify-center overflow-hidden mb-2">
            <span className="font-bebas text-7xl md:text-[12rem] leading-[0.85] tracking-tight letter-left">FORGE&nbsp;</span>
            <span className="font-bebas text-7xl md:text-[12rem] leading-[0.85] tracking-tight letter-right">YOUR</span>
          </Reveal>
          <Reveal className="flex justify-center overflow-hidden mb-6">
            <span className="font-bebas text-7xl md:text-[12rem] leading-[0.85] tracking-tight letter-left text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">LEG</span>
            <span className="font-bebas text-7xl md:text-[12rem] leading-[0.85] tracking-tight letter-right text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">ACY</span>
          </Reveal>
          <Reveal>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light tracking-wide blur-sharp">
              Elite conditioning. Brutal discipline. No excuses.
            </p>
          </Reveal>
          <Reveal>
            <Magnetic>
              <a href="#contact" className="cta-button inline-flex items-center gap-4 text-white px-10 py-5 font-bebas text-2xl tracking-widest">
                START TRAINING
                <ArrowRight size={24} />
              </a>
            </Magnetic>
          </Reveal>
        </div>

        {/* Ticker */}
        <div className="absolute bottom-0 w-full overflow-hidden bg-zyphora-red text-white py-3 border-y border-zyphora-border">
          <div className="ticker-track font-bebas text-2xl tracking-widest whitespace-nowrap">
            <span>STRENGTH &middot; DISCIPLINE &middot; RESULTS &middot; NO EXCUSES &middot; BUILT DIFFERENT &middot;&nbsp;</span>
            <span>STRENGTH &middot; DISCIPLINE &middot; RESULTS &middot; NO EXCUSES &middot; BUILT DIFFERENT &middot;&nbsp;</span>
            <span>STRENGTH &middot; DISCIPLINE &middot; RESULTS &middot; NO EXCUSES &middot; BUILT DIFFERENT &middot;&nbsp;</span>
            <span>STRENGTH &middot; DISCIPLINE &middot; RESULTS &middot; NO EXCUSES &middot; BUILT DIFFERENT &middot;&nbsp;</span>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-zyphora-border overflow-hidden">
        <Reveal threshold={0.3}>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="slide-left">
              <h2 className="font-bebas text-6xl md:text-8xl leading-none tracking-tight">
                WE DON'T <br />
                <span className="text-zyphora-red">DO EASY.</span>
              </h2>
            </div>
            <div className="slide-right space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                Zyphora is a sanctuary for the dedicated. We stripped away the juice bars, the neon lights, and the distractions. What remains is pure, unadulterated performance.
              </p>
              <p>
                Industrial-grade equipment. Elite coaching. An environment engineered to push you past your perceived limits. If you're looking for comfort, you're in the wrong place.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-32 px-6 md:px-12 bg-zyphora-card overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <h2 className="font-bebas text-5xl md:text-7xl mb-16 tracking-tight slide-left">DISCIPLINES</h2>
          </Reveal>
          
          <Reveal threshold={0.2}>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Strength", icon: <Dumbbell size={32} />, desc: "Powerlifting, Olympic weightlifting, and raw strength mechanics.", delay: "" },
                { title: "Conditioning", icon: <Activity size={32} />, desc: "High-intensity metabolic conditioning to build an unbreakable engine.", delay: "delay-100" },
                { title: "Personal Training", icon: <Users size={32} />, desc: "1-on-1 brutal accountability and bespoke programming.", delay: "delay-200" }
              ].map((service, i) => (
                <div key={i} className={`rise-up ${service.delay}`}>
                  <div className="service-card group p-10 border border-zyphora-border bg-zyphora-dark h-full flex flex-col">
                    <div className="text-gray-500 group-hover:text-zyphora-red transition-colors mb-8">
                      {service.icon}
                    </div>
                    <h3 className="font-bebas text-3xl tracking-wide mb-4">{service.title}</h3>
                    <p className="text-gray-400 font-light leading-relaxed flex-grow">{service.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-gray-500 group-hover:text-white transition-colors cursor-pointer">
                      Explore <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXPERT & TESTIMONIALS SECTION */}
      <section id="expert" className="py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <Reveal>
          <h2 className="font-bebas text-5xl md:text-7xl mb-16 tracking-tight slide-left">THE ARCHITECT</h2>
        </Reveal>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Expert Profile */}
          <Reveal threshold={0.2}>
            <div className="relative aspect-[4/5] bg-zyphora-card border border-zyphora-border group overflow-hidden flex flex-col justify-end clip-reveal">
              <div className="absolute inset-0 bg-zyphora-dark z-10 opacity-60 group-hover:opacity-20 transition-opacity duration-700"></div>
              
              {/* 
                USER INSTRUCTION: 
                Upload your photoshopped image to the 'public' folder and name it 'expert.jpg'.
                It will automatically replace the placeholder!
              */}
              <img 
                src="/expert.jpg" 
                onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop"; }}
                alt="Head Coach" 
                className="absolute inset-0 w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
              />
              
              <div className="relative z-20 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="w-8 h-1 bg-zyphora-red mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="font-bebas text-5xl tracking-wide mb-1 text-white">THE FOUNDER</h3>
                <p className="text-zyphora-red text-sm font-medium tracking-widest uppercase mb-4">Master Trainer & Gym Expert</p>
                <p className="text-gray-300 font-light italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  "I don't just change bodies. I rewire minds."
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right: Testimonials */}
          <div className="flex flex-col gap-16">
            <Reveal threshold={0.4}>
              <div className="border-l-2 border-zyphora-red pl-8 slide-right">
                <p className="font-bebas text-3xl md:text-4xl leading-[1.1] tracking-wide mb-6 text-gray-200">
                  "<TypewriterText text="HE PUSHED ME PAST LIMITS I DIDN'T KNOW I HAD. BRUTAL BUT NECESSARY." />"
                </p>
                <p className="text-sm font-medium tracking-widest uppercase text-gray-500 blur-sharp delay-300">
                  — JAMES T.
                </p>
              </div>
            </Reveal>
            
            <Reveal threshold={0.4}>
              <div className="border-l-2 border-zyphora-red pl-8 slide-right delay-100">
                <p className="font-bebas text-3xl md:text-4xl leading-[1.1] tracking-wide mb-6 text-gray-200">
                  "<TypewriterText text="NO MIRRORS. NO EGOS. JUST PURE, UNFILTERED PROGRESS UNDER HIS WATCH." />"
                </p>
                <p className="text-sm font-medium tracking-widest uppercase text-gray-500 blur-sharp delay-300">
                  — SARAH M.
                </p>
              </div>
            </Reveal>
            
            <Reveal threshold={0.4}>
              <div className="border-l-2 border-zyphora-red pl-8 slide-right delay-200">
                <p className="font-bebas text-3xl md:text-4xl leading-[1.1] tracking-wide mb-6 text-gray-200">
                  "<TypewriterText text="THE ONLY TRAINER WHO ACTUALLY DELIVERS ON THE PROMISE OF ELITE CONDITIONING." />"
                </p>
                <p className="text-sm font-medium tracking-widest uppercase text-gray-500 blur-sharp delay-300">
                  — DAVID K.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TRAINERS SECTION */}
      <section id="trainers" className="py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden border-t border-zyphora-border">
        <Reveal>
          <h2 className="font-bebas text-5xl md:text-7xl mb-16 tracking-tight slide-left">THE SQUAD</h2>
        </Reveal>
        
        <Reveal threshold={0.2}>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "MARCUS V.", 
                spec: "Strength Mechanics", 
                quote: "Form dictates function. We build the foundation first.",
                icon: <Dumbbell size={24} className="text-zyphora-red mb-4" />,
                bgGraphic: (
                  <svg viewBox="0 0 200 200" className="absolute w-[150%] h-[150%] text-white" fill="none" stroke="currentColor">
                    <pattern id="strength-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="20" height="40" fill="currentColor" opacity="0.2" />
                      <rect x="20" y="10" width="20" height="20" fill="currentColor" opacity="0.5" />
                      <path d="M0 0h40v40H0z" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#strength-pattern)" />
                  </svg>
                ),
                delay: ""
              },
              { 
                name: "ELENA R.", 
                spec: "Metabolic Conditioning", 
                quote: "Your mind will quit a thousand times before your body does.",
                icon: <Activity size={24} className="text-zyphora-red mb-4" />,
                bgGraphic: (
                  <svg viewBox="0 0 200 200" className="absolute w-[150%] h-[150%] text-white" fill="none" stroke="currentColor">
                    <pattern id="cond-pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="30" stroke="currentColor" strokeWidth="4" opacity="0.6" />
                      <line x1="10" y1="0" x2="10" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                      <line x1="20" y1="0" x2="20" y2="30" stroke="currentColor" strokeWidth="8" opacity="0.1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#cond-pattern)" />
                  </svg>
                ),
                delay: "delay-100"
              },
              { 
                name: "DAVID K.", 
                spec: "Combat / Boxing", 
                quote: "Precision under exhaustion. That's where champions live.",
                icon: <Target size={24} className="text-zyphora-red mb-4" />,
                bgGraphic: (
                  <svg viewBox="0 0 200 200" className="absolute w-[150%] h-[150%] text-white" fill="none" stroke="currentColor">
                    <circle cx="100" cy="100" r="80" strokeDasharray="4 8" strokeWidth="2" opacity="0.4" />
                    <circle cx="100" cy="100" r="60" strokeWidth="1" opacity="0.2" />
                    <circle cx="100" cy="100" r="40" strokeWidth="4" opacity="0.6" />
                    <path d="M100 0v200M0 100h200" strokeWidth="1" opacity="0.3" />
                    <path d="M20 20l160 160M20 180L180 20" strokeWidth="1" strokeDasharray="5 5" opacity="0.2" />
                    <rect x="85" y="85" width="30" height="30" fill="currentColor" opacity="0.1" />
                  </svg>
                ),
                delay: "delay-200"
              }
            ].map((trainer, i) => (
              <div key={i} className={`clip-reveal ${trainer.delay}`}>
                <div className="relative aspect-[3/4] bg-zyphora-card border border-zyphora-border group overflow-hidden flex flex-col justify-end p-8">
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none">
                    {trainer.bgGraphic}
                  </div>
                  
                  <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="w-8 h-1 bg-zyphora-red mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {trainer.icon}
                    <h3 className="font-bebas text-4xl tracking-wide mb-1">{trainer.name}</h3>
                    <p className="text-zyphora-red text-sm font-medium tracking-widest uppercase mb-4">{trainer.spec}</p>
                    <p className="text-gray-400 font-light italic opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      "{trainer.quote}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CONTACT / CTA SECTION */}
      <Reveal threshold={0.3}>
        <section id="contact" className="py-32 px-6 md:px-12 text-center contact-bg">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-bebas text-6xl md:text-8xl tracking-tight mb-6 slide-up-field">READY TO COMMIT?</h2>
            <p className="text-gray-400 text-lg font-light mb-12 slide-up-field delay-field-1">
              Drop your email. We'll send you the initiation protocol.
            </p>
            
            <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto slide-up-field delay-field-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                required
                className="flex-grow bg-transparent border border-zyphora-border px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-zyphora-red transition-colors font-medium tracking-widest uppercase text-sm"
              />
              <Magnetic>
                <button 
                  type="submit"
                  className="bg-zyphora-red text-white px-10 py-4 font-bebas text-2xl tracking-widest hover:bg-white hover:text-zyphora-dark transition-colors h-full w-full"
                >
                  APPLY
                </button>
              </Magnetic>
            </form>
          </div>
        </section>
      </Reveal>

      {/* FOOTER */}
      <footer className="py-8 border-t border-zyphora-border text-center px-6">
        <p className="text-gray-600 text-xs font-medium tracking-widest uppercase">
          &copy; {new Date().getFullYear()} ZYPHORA. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
