import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 relative bg-muted flex flex-col">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
