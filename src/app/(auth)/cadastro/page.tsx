import HeaderSection from "@/src/components/Header/Header";
import SignUpFormSection from "./sections/SignUpFormSection";
import Footer from "@/src/components/Footer/Footer";

export default function SignUpPage() {
  return (
    <>
      <HeaderSection />
      <main className="max-w-xl md:max-w-5xl mx-auto px-5 lg:px-0">
        <SignUpFormSection />
      </main>
      <Footer />
    </>
  );
}
