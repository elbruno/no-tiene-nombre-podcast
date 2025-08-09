import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import testimonialsData from "@/lib/testimonials.json";

export function TestimonialsSection() {
  const { section_title, list } = testimonialsData;
  return (
    <section className="max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-10 text-foreground font-display">{section_title}</h2>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {list.map((t, i) => (
          <Card key={i} className="glass-effect p-6 flex flex-col items-center text-center shadow-lg">
            <img src={t.avatar} alt={`Avatar de ${t.name}`} loading="lazy" className="w-16 h-16 rounded-full mb-4 border-2 border-accent" />
            <CardHeader className="mb-2">
              <CardTitle className="text-lg font-semibold text-accent">{t.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground italic">“{t.text}”</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
