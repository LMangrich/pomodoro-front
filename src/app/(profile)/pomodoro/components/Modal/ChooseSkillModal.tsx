"use client";


import { SearchIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSkills } from "@/src/hooks/useSkills";
import { skillService } from "@/src/services/skill.service";
import type { Skill } from "@/src/types/skill.types";
import { StandingUpGirlIcon } from "@/src/components/Icon/Icon";
import { Input } from "@/src/components/Input/Input";
import { Button } from "@/src/components/Button/Button";

const SKILLS_PER_PAGE = 6;
const DEFAULT_DURATION = 25; // Default pomodoro duration

interface ChooseSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseSkill: (skill: Skill) => void;
}

export default function ChooseSkillModal({
  isOpen,
  onClose,
  onChooseSkill,
}: ChooseSkillModalProps) {
  const { skills, isLoading, error } = useSkills();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [skillXpMap, setSkillXpMap] = useState<Record<number, number>>({});

  const filtered = useMemo(
    () =>
      skills.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      ),
    [skills, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / SKILLS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * SKILLS_PER_PAGE,
    page * SKILLS_PER_PAGE
  );

  // Fetch XP for visible skills
  useEffect(() => {
    paginated.forEach((skill) => {
      if (!skillXpMap[skill.id]) {
        skillService
          .calculateXp(skill.id, DEFAULT_DURATION)
          .then((result) => {
            setSkillXpMap((prev) => ({
              ...prev,
              [skill.id]: result.expectedXp,
            }));
          })
          .catch(() => {
            setSkillXpMap((prev) => ({
              ...prev,
              [skill.id]: 0,
            }));
          });
      }
    });
  }, [paginated, skillXpMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl relative w-full bg-primary border border-border rounded-[20px] p-8 overflow-hidden">
        
        <StandingUpGirlIcon className="absolute -right-2 top-4 h-auto z-0" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-off-white hover:text-button-primary transition-colors text-24 z-10"
        >
          ✕
        </button>

        <div className="relative z-10 flex items-start justify-between mb-8">
          <div>
            <h2 className="text-off-white text-28 font-bold mb-2">
              Escolha uma habilidade
            </h2>
            <p className="text-off-white text-16">
              Escolha a habilidade que você quer trabalhar e receber XP:
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl flex flex-row items-center  gap-5 mb-6">
          <Input
            id="search-skill"
            type="text"
            placeholder="Buscar habilidade"
            className="h-[40px] bg-inner text-button-primary placeholder:text-button-primary focus:outline-none"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />

          <Button
            variant="primary"
            className="p-2.5 self-end"
          >
            <SearchIcon className="w-4 h-4 text-background" />
          </Button>
        </div>

        <div className="relative z-10 mb-6">
          <h3 className="text-off-white text-20 font-bold flex items-center gap-2 mb-6">
            Todas as habilidades
            <span className="text-button-primary text-20 font-normal">
              ({filtered.length})
            </span>
          </h3>

          {isLoading ? (
            <p className="text-off-white text-14">Carregando habilidades...</p>
          ) : error ? (
            <p className="text-red-400 text-14">Erro ao carregar habilidades: {error}</p>
          ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {paginated.map((skill) => (
              <Button
                key={skill.id}
                variant="secondary"
                onClick={() => onChooseSkill(skill)}
                className="bg-primary border border-inner-text-content rounded-[20px] p-4 flex items-center justify-between hover:border-button-primary transition-colors text-left"
              >
                <div className="flex flex-col gap-5 px-2">
                  <div className="flex flex-row items-center gap-3">
                    <span className="text-16">{skill.emojString ?? "📚"}</span>
                    <span className="text-off-white text-16 font-bold ">
                      {skill.name}
                    </span>
                  </div>

                  <span className="text-off-white text-14 font-medium ">
                      Você receberá {skillXpMap[skill.id] ?? "..."} XP
                  </span>
                </div>
              </Button>
            ))}
          </div>
          )}
        </div>

        {totalPages > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-1 mb-6 mt-4">
          <span className="text-off-white text-14 font-bold">
            Página
          </span>
          {page > 1 && (
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="text-button-primary hover:text-off-white text-14 font-bold px-2"
            >
              ←
            </button>
          )}
          {page > 2 && (
            <span className="text-line text-12">...</span>
          )}
          {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
            const startPage = Math.max(1, page - 1);
            const p = startPage + i;
            if (p > totalPages) return null;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2 py-1 text-12 font-bold rounded transition-colors ${
                  p === page
                    ? 'bg-button-primary text-background'
                    : 'text-line hover:bg-inner'
                }`}
              >
                {p}
              </button>
            );
          })}
          {page < totalPages - 1 && (
            <span className="text-line text-12">...</span>
          )}
          {page < totalPages && (
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="text-button-primary hover:text-off-white text-14 font-bold px-2"
            >
              →
            </button>
          )}
        </div>
        )}

        <Button
          variant="primary"
          onClick={onClose}
          className="relative z-10 w-full h-[46px]"
        >
          CONTINUAR
        </Button>
      </div>
    </div>
  );
}
