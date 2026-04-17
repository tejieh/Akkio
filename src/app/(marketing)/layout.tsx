import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getServerSession } from "@/lib/auth-session";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <>
      <Header isAuthenticated={!!session} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 relative bg-muted flex flex-col">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
