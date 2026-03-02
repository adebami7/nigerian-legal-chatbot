import { useNavigate } from "react-router-dom";
import { Scale, Shield, BookOpen, MessageCircle, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.15),transparent_70%)]" />
        <div className="relative z-10 max-w-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent shadow-lg">
            <Scale className="h-10 w-10 text-accent-foreground" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Judicial Support AI
          </h1>
          <p className="mb-2 text-lg text-accent-foreground font-medium">
            Virtual Legal Assistant for Nigerian Law
          </p>
          <p className="mb-8 text-muted-foreground leading-relaxed">
            Get instant guidance on Nigerian criminal law, sexual violence legislation, constitutional rights, and legal procedures — powered by AI trained on the Nigerian Constitution, VAPP Act 2015, Criminal Code, and more.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/chat")}
            className="gap-2 rounded-xl px-8 text-base"
          >
            <MessageCircle className="h-5 w-5" />
            Start Consultation
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "VAPP Act 2015",
              desc: "Comprehensive coverage of the Violence Against Persons (Prohibition) Act including rape, assault, and protection orders.",
            },
            {
              icon: BookOpen,
              title: "Constitutional Rights",
              desc: "Your fundamental rights under Chapter IV of the 1999 Constitution — dignity, liberty, fair hearing, and more.",
            },
            {
              icon: Scale,
              title: "Criminal Code & Penal Code",
              desc: "Provisions on sexual offenses under both Southern and Northern Nigerian criminal legislation.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-background p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border px-6 py-10">
        <div className="mx-auto max-w-2xl rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
            <div>
              <h3 className="mb-1 font-semibold text-destructive">Legal Disclaimer</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This application provides <strong>general legal information only</strong> and does not constitute legal advice. The AI assistant is not a licensed legal practitioner. For specific legal matters, please consult a qualified Nigerian lawyer or contact the Legal Aid Council of Nigeria, FIDA (Federation of International Women Lawyers), or your State Ministry of Justice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground">
        <p>Judicial Support AI — A Machine Learning Project</p>
        <p className="mt-1">Based on the Nigerian Constitution (1999), VAPP Act 2015, Criminal Code Act & Child Rights Act 2003</p>
      </footer>
    </div>
  );
}
