export interface SalaryProfile {
  id: string;
  position: string;
  yearsOfExperience: number;
  location: string;
  teamSize: number;
  salary: number;
  createdAt: string;
}

export interface SearchFilters {
  position?: string;
  yearsOfExperience?: number;
  location?: string;
  teamSize?: number;
}

export interface SearchResult {
  profile: SalaryProfile;
  similarity: number;
}
