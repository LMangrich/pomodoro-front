"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
import { HeroBox } from "@/src/components/HeroBox/HeroBox";
import { Button } from "@/src/components/Button/Button";
import { Input } from "@/src/components/Input/Input";
import { BoyWalkingIcon, NotVisibleIcon, VisibleIcon } from "@/src/components/Icon/Icon";
import { ErrorMessage } from "@/src/components/ErrorMessage/ErrorMessage";
import { validateEmail, validateFullName } from "@/src/lib/validators";

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

export default function SignUpFormSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const validateField = (fieldId: string, value: string): string => {
    switch (fieldId) {
      case 'name':
        if (!value.trim()) {
          return 'Nome é obrigatório';
        }
        if (!validateFullName(value)) {
          return 'Nome deve conter pelo menos 2 palavras';
        }
        return '';
      case 'username':
        if (!value.trim()) {
          return 'Usuário é obrigatório';
        }
        if (value.trim().length < 3) {
          return 'Usuário deve ter pelo menos 3 caracteres';
        }
        if (!/^[a-zA-Z0-9_\- ]{3,20}$/.test(value)) {
          return 'Usuário deve conter apenas letras, números, hífens e underscores';
        }
        return '';
      case 'email':
        if (!value.trim()) {
          return 'Email é obrigatório';
        }
        if (!validateEmail(value)) {
          return 'Email inválido (ex: nome@email.com)';
        }
        return '';
      case 'password':
        if (!value) {
          return 'Senha é obrigatória';
        }
        if (value.length < 8) {
          return 'A senha deve conter pelo menos 8 caracteres';
        }
        return '';
      case 'confirmPassword':
        if (!value) {
          return 'Confirmação de senha é obrigatória';
        }
        if (value !== password) {
          return 'As senhas não coincidem';
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    if (fieldId === 'name') setName(value);
    if (fieldId === 'username') setUsername(value);
    if (fieldId === 'email') setEmail(value);
    if (fieldId === 'password') setPassword(value);
    if (fieldId === 'confirmPassword') setConfirmPassword(value);

    if (touched[fieldId]) {
      const error = validateField(fieldId, value);
      setFieldErrors(prev => ({
        ...prev,
        [fieldId]: error
      }));
    }
  };

  const handleFieldBlur = (fieldId: string, value: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    const error = validateField(fieldId, value);
    setFieldErrors(prev => ({
      ...prev,
      [fieldId]: error
    }));
  };

  const isFormValid = () => {
    const errors = {
      name: validateField('name', name),
      username: validateField('username', username),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const errors = {
      name: validateField('name', name),
      username: validateField('username', username),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error !== '')) {
      return;
    }
    
    await register(name, email, username, password);
  };

  return (
    <section className="mx-auto">
      <HeroBox
        illustration={<BoyWalkingIcon className="mx-auto md:flex-shrink-0" />}
        title="Faça seu cadastro"
        titleClassName="text-20 md:text-30 md:mt-10"
        innerClassName="md:gap-10"
        actions={
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
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

            {(error || validationError) && (
              <ErrorMessage message={validationError || error} />
            )}

            <div className="flex flex-col gap-6">
              <Input
                id="nome"
                label="NOME"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => handleFieldBlur('name', name)}
                error={fieldErrors.name}
                required
              />

              <Input
                id="username"
                label="USUÁRIO"
                type="text"
                placeholder="Seu usuário"
                value={username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                onBlur={() => handleFieldBlur('username', username)}
                error={fieldErrors.username}
                pattern="^[a-zA-Z0-9_\-]{3,20}$"
                title="Usuário deve conter apenas letras, números, hífens e underscores (3-20 caracteres)"
                required
              />

              <Input
                id="email"
                label="E-MAIL"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email', email)}
                error={fieldErrors.email}
                required
              />

              <div className="relative">
                <Input
                  id="password"
                  label="SENHA"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password', password)}
                  error={fieldErrors.password}
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

              <div className="relative">
                <Input
                  id="confirmPassword"
                  label="CONFIRMAR SENHA"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className="w-full pr-12"
                  value={confirmPassword}
                  onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                  onBlur={() => handleFieldBlur('confirmPassword', confirmPassword)}
                  error={fieldErrors.confirmPassword}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 translate-y-1/3 text-off-white/50 hover:text-off-white transition-colors z-10"
                >
                  {showConfirmPassword ? (
                    <NotVisibleIcon />
                  ) : (
                    <VisibleIcon />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" className="w-full md:px-6 md:py-2 md:text-20" disabled={isLoading || !isFormValid()}>
              {isLoading ? "CADASTRANDO..." : "CADASTRAR"}
            </Button>

            <div className="flex flex-col gap-2 items-center text-14">
              <div className="text-off-white">
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="text-button-primary font-bold underline transition-colors"
                >
                  Faça login.
                </button>
              </div>
            </div>
          </form>
        }
      />
    </section>
  );
}
