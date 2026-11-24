import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="appmin">{children}</main>
      <Footer />
    </>
  );
}
