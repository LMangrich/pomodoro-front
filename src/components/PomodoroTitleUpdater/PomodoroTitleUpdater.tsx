"use client";

import { useEffect } from "react";
import { usePomodoro } from "@/src/context/PomodoroContext";

const BASE_TITLE = "Pomodoro - Gerenciamento de Tempo";

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const PomodoroTitleUpdater = () => {
  const { isRunning, secondsRemaining } = usePomodoro();

  useEffect(() => {
    if (isRunning) {
      document.title = `${formatTime(secondsRemaining)} ${BASE_TITLE}`;
      return;
    }

    document.title = BASE_TITLE;
  }, [isRunning, secondsRemaining]);

  return null;
};
