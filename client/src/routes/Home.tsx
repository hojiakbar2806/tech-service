import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { TestimonialsSection } from "@/components/testimonals-section";
import { CtaSection } from "@/components/cta-section";
import { SiteFooter } from "@/components/site-footer";
import { Faq } from "@/components/faq-section";


export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <HeroSection />
                <ServicesSection />
                <Faq />
                <TestimonialsSection />
                <CtaSection />
            </main>
            <SiteFooter />
        </div>
    );
}