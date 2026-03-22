"use client";

import { useState } from "react";
import { useUser } from "@/src/context/UserContext";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { RayIcon } from "@/src/components/Icon/Icon";
import Pagination from "@/src/components/Pagination/Pagination";
import { LoadingSplash } from "@/src/components/LoadingSplash/LoadingSplash";

const SKILLS_PER_PAGE = 6;

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
    <section className="w-full px-5 md:px-10 py-2">
        <h2 className="text-off-white text-20 md:text-24 font-bold mb-6 md:mb-9">
            Habilidades
        </h2>

        {isLoading ? (
          <LoadingSplash />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
          {paginated.map((skill) => (
            <div
              key={skill.id}
              className="w-full max-w-[303px] border border-button-primary rounded-[20px] p-3 lg:px-4 lg:py-3"
            >
              <div className="flex flex-row gap-2 md:gap-3 mb-3">
                <div className="w-10 md:w-12 h-10 md:h-12 self-center flex-shrink-0 flex items-center justify-center">
                  <span className="text-16 md:text-20 ">{skill.emojString ?? "📚"}</span>
                </div>
                <div className="flex flex-col flex-1 gap-3 md:gap-4 min-w-0">
                  <h3 className="text-off-white text-14 md:text-16 font-bold truncate">
                    {skill.skillName}
                  </h3>
                  <div className="flex flex-col w-full items-start gap-2">
                    <div className="text-off-white text-11 md:text-12 font-bold flex items-center gap-1">
                      <RayIcon className="text-button-primary flex-shrink-0" /> {skill.totalXp} XP
                    </div>
                    <div className="flex flex-row items-center gap-2 md:gap-4 w-full">
                        <div className="flex-1 h-2.5 bg-border rounded-full overflow-hidden min-w-0">
                        <div
                            className="h-full bg-button-primary rounded-full"
                            style={{ width: `${Math.min(100, (skill.xpNeededForNextLevel > 0 ? ((skill.xpForNextLevel - skill.xpNeededForNextLevel) / skill.xpForNextLevel) * 100 : 100))}%` }}
                        />
                        </div>
                        <span className="text-off-white text-11 md:text-12 font-bold whitespace-nowrap">
                        NV. {skill.currentLevel}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="flex justify-end">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
    </section>
  );
}
