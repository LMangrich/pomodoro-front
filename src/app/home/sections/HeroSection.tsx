import { Button } from "@/src/components/Button/Button";
import { HeroBox } from "@/src/components/HeroBox/HeroBox";
import { GirlReadingIcon } from "@/src/components/Icon/Icon";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="mx-auto">
      <HeroBox
        illustration={<GirlReadingIcon className="mx-auto lg:flex-shrink-0" />}
        title="Maximize sua Produtividade"
        description="Domine o tempo com a técnica Pomodoro. Trabalhe com foco total, acompanhe seu progresso e alcance seus objetivos mais rapidamente."
        actions={
          <>
            <Link href="/login" >
              <Button variant="secondary" size="sm" className="md:px-6 md:py-2 md:text-20">
                ENTRAR
              </Button>
            </Link>

            <Link href="/sign-up" >
              <Button variant="primary" size="sm" className="md:px-6 md:py-2 md:text-20">
                CADASTRAR
              </Button>
            </Link>
          </>
        }
      />
    </section>
  );
}
