'use client';

import type { SalaryProfile } from '@/types';

interface SearchResultsProps {
  results: SalaryProfile[];
  loading: boolean;
}

export default function SearchResults({ results, loading }: SearchResultsProps) {
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const getExperienceLabel = (years: number) => {
    if (years === 0) return 'Débutant';
    if (years === 1) return '1 an';
    return `${years} ans`;
  };

  const getTeamSizeLabel = (size: number) => {
    if (size === 0) return 'Aucune équipe';
    if (size === 1) return '1 personne';
    return `${size} personnes`;
  };

  const calculateAverageSalary = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, profile) => sum + profile.salary, 0);
    return total / results.length;
  };

  const calculateMedianSalary = () => {
    if (results.length === 0) return 0;
    const sorted = [...results].sort((a, b) => a.salary - b.salary);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1].salary + sorted[middle].salary) / 2;
    }
    return sorted[middle].salary;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-linear-primary border-r-transparent"></div>
        <p className="mt-4 text-linear-muted">Recherche en cours...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 border border-linear-border rounded-lg bg-linear-surface">
        <svg className="mx-auto h-12 w-12 text-linear-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-linear-text">Aucun profil trouvé</h3>
        <p className="mt-2 text-linear-muted">Essayez d&apos;ajuster vos filtres pour voir plus de résultats</p>
      </div>
    );
  }

  const averageSalary = calculateAverageSalary();
  const medianSalary = calculateMedianSalary();

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-surface border border-linear-border rounded-lg p-6">
          <div className="text-sm font-medium text-linear-muted mb-1">Profils similaires</div>
          <div className="text-3xl font-semibold text-linear-text">{results.length}</div>
        </div>
        <div className="bg-linear-surface border border-linear-border rounded-lg p-6">
          <div className="text-sm font-medium text-linear-muted mb-1">Salaire moyen</div>
          <div className="text-3xl font-semibold text-linear-primary">{formatSalary(averageSalary)}</div>
        </div>
        <div className="bg-linear-surface border border-linear-border rounded-lg p-6">
          <div className="text-sm font-medium text-linear-muted mb-1">Salaire médian</div>
          <div className="text-3xl font-semibold text-linear-primary">{formatSalary(medianSalary)}</div>
        </div>
      </div>

      {/* Liste des profils */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-linear-text">Profils similaires</h3>
        {results.map((profile, index) => (
          <div
            key={profile.id}
            className="bg-linear-surface border border-linear-border rounded-lg p-6 hover:border-linear-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-linear-text mb-1">{profile.position}</h4>
                <div className="flex items-center gap-4 text-sm text-linear-muted">
                  <span>{getExperienceLabel(profile.yearsOfExperience)} d&apos;expérience</span>
                  <span>•</span>
                  <span>{profile.location}</span>
                  <span>•</span>
                  <span>{getTeamSizeLabel(profile.teamSize)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-linear-primary">
                  {formatSalary(profile.salary)}
                </div>
                <div className="text-xs text-linear-muted mt-1">par an</div>
              </div>
            </div>

            {/* Indicateur de similarité */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-linear-border rounded-full h-1.5">
                <div
                  className="bg-linear-primary rounded-full h-1.5"
                  style={{ width: `${Math.max(20, 100 - (index * 5))}%` }}
                ></div>
              </div>
              <span className="text-xs text-linear-muted">
                {Math.max(20, 100 - (index * 5))}% de similarité
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
