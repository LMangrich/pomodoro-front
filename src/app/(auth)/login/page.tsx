import HeaderSection from "@/src/components/Header/Header";
import LoginFormSection from "./sections/LoginFormSection";
import Footer from "@/src/components/Footer/Footer";

export default function LoginPage() {
  return (
    <>
      <HeaderSection />
      <main className="max-w-xl md:max-w-5xl mx-auto px-5 lg:px-0">
        <LoginFormSection />
      </main>
      <Footer />
    </>
  );
}
