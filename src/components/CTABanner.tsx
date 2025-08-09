import pageTexts from "@/lib/page-texts.json";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  const cta = pageTexts.cta_banner;
  return (
    <section className="max-w-3xl mx-auto my-16 p-8 glass-effect rounded-2xl text-center shadow-xl">
      <h2 className="text-2xl font-bold text-primary mb-2 font-display">{cta.title}</h2>
      <p className="text-muted-foreground mb-6">{cta.subtitle}</p>
      <form className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
        <input type="email" placeholder={cta.newsletter_placeholder} className="px-4 py-2 rounded-lg border [border-color:var(--border)] bg-background text-foreground w-full sm:w-64" />
        <Button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300">
          {cta.newsletter_button}
        </Button>
      </form>
      <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <input type="text" placeholder={cta.suggestion_placeholder} className="px-4 py-2 rounded-lg border [border-color:var(--border)] bg-background text-foreground w-full sm:w-64" />
        <Button type="submit" className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-all duration-300">
          {cta.suggestion_button}
        </Button>
      </form>
    </section>
  );
}
