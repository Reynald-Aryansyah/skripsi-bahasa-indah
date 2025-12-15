import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WordCounter } from "@/components/WordCounter";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PremiumCTA } from "@/components/PremiumCTA";
import { GraduationCap, ArrowRight, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WORD_LIMIT = 100;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const wordCount = countWords(inputText);
  const isOverLimit = wordCount > WORD_LIMIT;

  const handleSubmit = useCallback(async () => {
    if (!inputText.trim()) {
      toast({
        title: "Teks kosong",
        description: "Silakan masukkan teks yang ingin diubah.",
        variant: "destructive",
      });
      return;
    }

    if (isOverLimit) {
      toast({
        title: "Teks terlalu panjang",
        description: `Versi gratis hanya mendukung maksimal ${WORD_LIMIT} kata.`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setOutputText("");

    try {
      // Simulated API call structure - ready for backend integration
      // const response = await fetch('/api/humanize', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: inputText }),
      // });
      // const data = await response.json();
      // setOutputText(data.result);

      // Temporary simulation for demo
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Placeholder output for demonstration
      setOutputText(
        `[Demo] Teks akademik akan muncul di sini setelah API terhubung.\n\nTeks asli (${wordCount} kata):\n"${inputText.substring(0, 150)}${inputText.length > 150 ? '...' : ''}"`
      );

      toast({
        title: "Berhasil!",
        description: "Teks telah diubah ke bahasa akademik.",
      });
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memproses teks. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, isOverLimit, wordCount, toast]);

  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      toast({
        title: "Tersalin!",
        description: "Teks berhasil disalin ke clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast({
        title: "Gagal menyalin",
        description: "Tidak dapat menyalin teks.",
        variant: "destructive",
      });
    }
  }, [outputText, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4 md:py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                SkripsiSakti
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Ubah teks biasa menjadi bahasa skripsi yang formal dan natural.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 md:py-10">
        {/* Mobile subtitle */}
        <p className="text-sm text-muted-foreground mb-6 sm:hidden text-center">
          Ubah teks biasa menjadi bahasa skripsi yang formal dan natural.
        </p>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Column */}
          <div className="space-y-3 animate-slide-up">
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">
                Teks Asli
              </span>
              <Textarea
                variant="academic"
                placeholder="Tempelkan teks kamu di sini (hasil ChatGPT, draft skripsi, dll)"
                className="min-h-[240px] md:min-h-[300px] resize-none font-body"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
              />
            </label>
            <WordCounter count={wordCount} limit={WORD_LIMIT} />
          </div>

          {/* Output Column */}
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Hasil Bahasa Akademik
              </label>
              {outputText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Salin
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              variant="readonly"
              placeholder="Hasil parafrase bahasa skripsi akan muncul di sini."
              className="min-h-[240px] md:min-h-[300px] resize-none font-body"
              value={outputText}
              readOnly
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button
            variant="academic"
            size="lg"
            onClick={handleSubmit}
            disabled={isProcessing || !inputText.trim()}
            className="w-full sm:w-auto min-w-[280px]"
          >
            {isProcessing ? (
              <>
                <LoadingSpinner size="sm" />
                Memproses teks…
              </>
            ) : (
              <>
                Ubah ke Bahasa Skripsi
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          
          {/* Version Info */}
          <p className="text-sm text-muted-foreground text-center">
            Mode Gratis: Maksimal {WORD_LIMIT} kata · Tanpa login
          </p>
        </div>

        {/* Premium CTA */}
        <div className="mt-10 max-w-md mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <PremiumCTA />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container py-6">
          <p className="text-sm text-muted-foreground text-center">
            Dibuat untuk membantu mahasiswa Indonesia. Gunakan dengan bijak.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
