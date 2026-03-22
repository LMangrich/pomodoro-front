/**
 * Pomodoro Timer Utilities
 * Contains all helper functions and constants for PomodoroTimerSection
 */

// Constants
export const DURATION_STEP_MINUTES = 5;

export const getDurationConstants = (
  minDuration: number,
  maxDuration: number,
  defaultDuration: number
) => {
  return {
    minDurationSeconds: minDuration * 60,
    maxDurationSeconds: maxDuration * 60,
    defaultDurationSeconds: defaultDuration * 60,
    durationStepSeconds: DURATION_STEP_MINUTES * 60,
  };
};

// Time formatting utilities
export const formatTime = (mins: number, secs: number): string =>
  `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

// Duration draft utilities
export const getDurationDraftParts = (
  durationDraft: string | null,
  durationSeconds: number
): { minutesPart: string; secondsPart: string } => {
  const baseDraft =
    durationDraft ??
    formatTime(Math.floor(durationSeconds / 60), durationSeconds % 60);
  const [minutesPart = "", secondsPart = ""] = baseDraft.split(":");

  return {
    minutesPart,
    secondsPart,
  };
};

export const updateDurationDraftPart = (
  rawValue: string,
  durationDraft: string | null,
  durationSeconds: number
): string => {
  const { secondsPart } = getDurationDraftParts(durationDraft, durationSeconds);
  const sanitizedValue = rawValue.replace(/\D/g, "").slice(0, 3);
  return `${sanitizedValue}:${secondsPart || "00"}`;
};

// Duration input parsing
export const parseDurationInput = (
  value: string,
  durationSeconds: number,
  {
    minDurationSeconds,
    maxDurationSeconds,
    durationStepSeconds,
    defaultDurationSeconds,
  }: ReturnType<typeof getDurationConstants>
): number => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return defaultDurationSeconds;

  const onlyDigits = trimmedValue.replace(/\D/g, "");

  if (!onlyDigits) return durationSeconds;

  let minutes = 0;
  let seconds = 0;

  if (trimmedValue.includes(":")) {
    const [minutesPart = "0", secondsPart = "0"] = trimmedValue.split(":");
    minutes = Number.parseInt(minutesPart.replace(/\D/g, "") || "0", 10);
    seconds = Number.parseInt(secondsPart.replace(/\D/g, "") || "0", 10);
  } else if (onlyDigits.length <= 3) {
    minutes = Number.parseInt(onlyDigits, 10);
  } else {
    minutes = Number.parseInt(onlyDigits.slice(0, -2), 10);
    seconds = Number.parseInt(onlyDigits.slice(-2), 10);
  }

  const rawSeconds = minutes * 60 + seconds;
  const clampedSeconds = Math.min(
    maxDurationSeconds,
    Math.max(minDurationSeconds, rawSeconds)
  );
  const normalizedSeconds =
    Math.round(clampedSeconds / durationStepSeconds) * durationStepSeconds;

  return Math.min(
    maxDurationSeconds,
    Math.max(minDurationSeconds, normalizedSeconds)
  );
};

// Duration adjustment utilities
export const increaseDuration = (
  currentDuration: number | null,
  defaultDurationSeconds: number,
  maxDurationSeconds: number
): number => {
  const current = currentDuration ?? defaultDurationSeconds;
  return Math.min(maxDurationSeconds, current + DURATION_STEP_MINUTES * 60);
};

export const decreaseDuration = (
  currentDuration: number | null,
  defaultDurationSeconds: number,
  minDurationSeconds: number
): number => {
  const current = currentDuration ?? defaultDurationSeconds;
  return Math.max(minDurationSeconds, current - DURATION_STEP_MINUTES * 60);
};

// Progress calculation
export const calculateProgress = (
  totalSeconds: number,
  secondsRemaining: number
): number =>
  totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
