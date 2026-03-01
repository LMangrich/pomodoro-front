"use client";

import { useState } from "react";
import { useUser } from "@/src/context/UserContext";
import { useUserProfile } from "@/src/hooks/useUserProfile";

const SKILLS_PER_PAGE = 6;

const SKILL_ICONS: Record<string, string> = {
  "Programação": "💻",
  "Língua estrangeira": "🌍",
  "Desenho": "🎨",
  "Arte 3D": "🎭",
  "Matemática": "📊",
};

export default function ProfileStatsSection() {
  const { userData } = useUser();
  const { skills, isLoading } = useUserProfile(userData?.username);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(skills.length / SKILLS_PER_PAGE));
  const paginated = skills.slice(
    (page - 1) * SKILLS_PER_PAGE,
    page * SKILLS_PER_PAGE
  );

  return (
    <section className="w-full px-10 py-2">
        <h2 className="text-off-white text-24 font-bold mb-9">
            Habilidades
        </h2>

        {isLoading ? (
          <p className="text-off-white text-14">Carregando habilidades...</p>
        ) : (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {paginated.map((skill) => (
            <div
              key={skill.skillId}
              className="w-full max-w-[302px] border-2 border-button-primary rounded-[20px] p-4"
            >
              <div className="flex flex-row gap-3 mb-3">
                <div className="w-12 h-12 self-center border-2 border-button-primary rounded-[8px] flex items-center justify-center">
                  <span className="text-20">{SKILL_ICONS[skill.skillName] ?? "📚"}</span>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                  <h3 className="text-off-white text-16 font-bold">
                    {skill.skillName}
                  </h3>
                  <div className="flex flex-col w-full items-start gap-2">
                    <div className="text-off-white text-12 font-bold">
                      ⚡ {skill.xp} XP
                    </div>
                    <div className="flex flex-row items-center  gap-4 w-full">
                        <div className="flex-1 h-2.5 bg-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-button-primary rounded-full"
                            style={{ width: `${Math.min(100, (skill.xpInCurrentLevel / skill.xpForNextLevel) * 100)}%` }}
                        />
                        </div>
                        <span className="text-off-white text-12 font-bold">
                        NV. {skill.level}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="flex items-center gap-8 justify-end">
            <span className="text-off-white text-16 font-bold">
                Página
            </span>
            <div className="flex flex-row gap-6 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`font-bold text-16 ${
                      p === page ? "text-off-white" : "text-line"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {page < totalPages && (
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className="text-button-primary text-16 font-bold"
                  >
                    &gt;
                  </button>
                )}
            </div>
          </div>
    </section>
  );
}
