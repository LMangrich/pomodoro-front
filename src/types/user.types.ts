export interface UserData {
  username: string;
  email: string;
  name: string;
}

export interface UserSkill {
  id: number;
  skillName: string;
  emojString?: string;
  totalXp: number;
  currentLevel: number;
  xpForNextLevel: number;
  xpNeededForNextLevel: number;
  maxLevel: boolean;
}

export interface UserStats {
  username: string;
  nome: string;
  totalLevelsGained: number;
  totalXp: number;
  totalFocusedTimeHours: number;
  totalMasteredSkills: number;
  lastUpdated: string;
}
