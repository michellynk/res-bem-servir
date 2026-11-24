import { UtensilsCrossed } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <span className="bg-primary/10 text-primary flex size-16 items-center justify-center rounded-full">
        <UtensilsCrossed className="size-8" aria-hidden />
      </span>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          RBS – Refeições Bem Servir
        </h1>
        <p className="text-muted-foreground mx-auto max-w-md text-balance">
          Nosso site está em construção. Em breve você poderá conferir aqui o cardápio do dia.
        </p>
      </div>
      <p className="text-muted-foreground text-sm">Segunda a sexta, das 11h às 14h.</p>
    </main>
  );
}
