export interface Skill {
  id: number;
  name: string;
  description?: string;
  emojString?: string;
}

export interface CalculateXpResponse {
  skillId: number;
  durationMinutes: number;
  expectedXp: number;
}
