export interface UserData {
  username: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserData;
}

export interface UserSkill {
  skillId: number;
  skillName: string;
  icon?: string;
  xp: number;
  level: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
}

export interface UserStats {
  username: string;
  totalXp: number;
  totalFocusMinutes: number;
  totalPomodoros: number;
  completedPomodoros: number;
  abandonedPomodoros: number;
  skills: UserSkill[];
}

// Legacy alias kept for UserContext compatibility
export type VetUserData = UserData;
