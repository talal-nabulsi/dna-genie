import AuthGuard from "@/components/auth/AuthGuard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 py-8 sm:py-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
