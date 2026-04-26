import SiteHeader from "@/components/SiteHeader";
import MemeGrid from "@/components/MemeGrid";
import SupportSection from "@/components/SupportSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-black">
      <SiteHeader />
      <MemeGrid />
      <SupportSection />
    </main>
  );
};

export default Index;
