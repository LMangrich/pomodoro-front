"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { Button } from "@/src/components/Button/Button";
import { Input } from "@/src/components/Input/Input";
import { HeroBox } from "@/src/components/HeroBox/HeroBox";
import { GirlSittingIcon, NotVisibleIcon, VisibleIcon } from "@/src/components/Icon/Icon";
import { ErrorMessage } from "@/src/components/ErrorMessage/ErrorMessage";

// const BUTTON_DATA = [
//   {
//     id: 1,
//     label: "Com o Google",
//     icon: <GoogleIcon />,
//   },
//   {
//     id: 2,
//     label: "Com o Github",
//     icon: <GithubIcon />,
//   },
// ];

export default function LoginFormSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <section className="mx-auto">
      <HeroBox
        illustration={<GirlSittingIcon className="mx-auto lg:flex-shrink-0" />}
        title="Entre em sua conta"
        titleClassName="text-20 md:text-30 md:mt-10"
        actions={
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 md:gap-8">
            {/* <div className="flex flex-col md:flex-row gap-4 w-full">
              {BUTTON_DATA.map(({ id, label, icon }) => (
                <Button
                  key={id}
                  type="button"
                  variant="secondary"
                  size="md"
                  className="flex items-center justify-center gap-2 font-bold text-16"
                >
                    {icon}
                    {label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-0.5 bg-line"></div>
              <span className="text-line font-bold text-14">
                OU
              </span>
              <div className="flex-1 h-0.5 bg-line"></div>
            </div> */}
            {error && ( <ErrorMessage message={error} />)}

            <div className="flex flex-col gap-4">
              <Input
                id="username"
                label="USUÁRIO"
                type="text"
                placeholder="Seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <div className="relative">
                <Input
                  id="password"
                  label="SENHA"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 translate-y-1/3 text-off-white/50 hover:text-off-white transition-colors z-10"
                >
                  {showPassword ? (
                    <NotVisibleIcon />
                  ) : (
                    <VisibleIcon />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" className="w-full md:px-6 md:py-2 md:text-20" disabled={isLoading}>
              {isLoading ? "ENTRANDO..." : "ENTRAR"}
            </Button>

            <div className="flex flex-col gap-2 items-center text-14">
              {/* <button type="button" className="text-button-primary font-bold underline hover:text-off-white transition-colors">
                Esqueceu a senha?
              </button> */}
              <div className="text-off-white">
                Ainda não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/cadastro")}
                  className="text-button-primary font-bold underline hover:text-button-primary transition-colors"
                >
                  Cadastre-se.
                </button>
              </div>
            </div>
          </form>
        }
      />
    </section>
  );
}
