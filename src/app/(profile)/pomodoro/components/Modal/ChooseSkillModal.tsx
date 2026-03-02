"use client";


import { SearchIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSkills } from "@/src/hooks/useSkills";
import { skillService } from "@/src/services/skill.service";
import type { Skill } from "@/src/types/skill.types";
import { RayIcon, StandingUpGirlIcon } from "@/src/components/Icon/Icon";
import { Input } from "@/src/components/Input/Input";
import { Button } from "@/src/components/Button/Button";
import Pagination from "@/src/components/Pagination/Pagination";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-5">
      <div className="max-w-5xl relative w-full bg-primary border border-border rounded-[20px] p-6 md:p-8 overflow-hidden">
        <StandingUpGirlIcon className="absolute -right-2 top-4 h-auto z-0 hidden sm:block" />

        <button onClick={onClose} className="absolute top-4 md:top-6 right-4 md:right-6 text-off-white hover:text-button-primary transition-colors text-20 md:text-24 z-10">
          ✕
        </button>

        <div className="relative z-10 flex items-start justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-off-white text-20 md:text-28 font-bold mb-2">
              Escolha uma habilidade
            </h2>
            <p className="text-off-white text-14 md:text-16">
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
          <h3 className="text-off-white text-16 md:text-20 font-bold flex items-center gap-2 mb-6">
            Todas as habilidades
            <span className="text-button-primary text-16 md:text-20 font-normal">
              ({filtered.length})
            </span>
          </h3>

          {isLoading ? (
            <p className="text-off-white text-12 md:text-14">Carregando habilidades...</p>
          ) : error ? (
            <p className="text-red-400 text-12 md:text-14">Erro ao carregar habilidades: {error}</p>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-h-[300px] overflow-y-auto pr-2">
            {paginated.map((skill) => (
              <Button
                key={skill.id}
                variant="secondary"
                onClick={() => onChooseSkill(skill)}
                className="bg-primary border border-inner-text-content rounded-[20px] hover:bg-button-primary/10 hover:border-button-primary p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between transition-colors text-left"
              >
                <div className="flex flex-col gap-3 md:gap-5 w-full">
                  <div className="flex flex-row items-center gap-2 md:gap-3">
                    <span className="text-14 md:text-16">{skill.emojString ?? "📚"}</span>
                    <span className="text-off-white text-14 md:text-16 font-bold ">
                      {skill.name}
                    </span>
                  </div>

                  <span className="flex flex-row items-center gap-2 text-off-white text-12 md:text-14 font-medium ">
                      Você receberá:
                      <div className="bg-button-primary text-background px-2.5 py-1 rounded-[8px] text-11 md:text-12 font-bold whitespace-nowrap flex items-center gap-1">
                        <RayIcon className="w-3 h-3" />  {skillXpMap[skill.id] ?? "..."} XP
                      </div>
                  </span>
                </div>
              </Button>
            ))}
          </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="relative z-10 mb-6 mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

        <Button
          variant="primary"
          onClick={onClose}
          className="relative z-10 w-full h-11 md:h-[46px] text-14 md:text-16"
        >
          CONTINUAR
        </Button>
      </div>
    </div>
  );
}
