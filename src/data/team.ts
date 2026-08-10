export type TeamMember = {
  nameTh: string;
  nameEn: string;
  roleTh: string;
  roleEn: string;
  bioTh: string;
  bioEn: string;
  years: number;
};

/**
 * Empty on purpose.
 *
 * This list previously held invented staff members with invented names and
 * years of experience. Add real people here — with their agreement to be
 * named publicly — and the team grid on /technical-team appears again.
 */
export const team: TeamMember[] = [];
