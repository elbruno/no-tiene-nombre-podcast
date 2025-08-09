import pageTexts from "@/lib/page-texts.json";
import { SocialLinks } from "@/components/SocialLinks";

export function CTABanner() {
  const cta = pageTexts.cta_banner;
  return (
    <section className="max-w-3xl mx-auto my-16 p-8 glass-effect rounded-2xl text-center shadow-xl">
      <h2 className="text-2xl font-bold text-primary mb-2 font-display">{cta.title}</h2>
  <p className="text-muted-foreground mb-8">{cta.subtitle}</p>
  <SocialLinks className="mt-2" />
    </section>
  );
}
