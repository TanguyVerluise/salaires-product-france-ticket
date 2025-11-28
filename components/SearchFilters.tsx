'use client';

import { useState, useEffect } from 'react';
import type { SearchFilters as Filters } from '@/types';

interface SearchFiltersProps {
  onSearch: (filters: Filters) => void;
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [position, setPosition] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [location, setLocation] = useState('');
  const [teamSize, setTeamSize] = useState('');

  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  useEffect(() => {
    // Charger les options disponibles depuis les stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAvailablePositions(data.stats.positions);
          setAvailableLocations(data.stats.locations);
        }
      })
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    const filters: Filters = {
      position: position || undefined,
      yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience, 10) : undefined,
      location: location || undefined,
      teamSize: teamSize ? parseInt(teamSize, 10) : undefined,
    };
    onSearch(filters);
  };

  // Recherche automatique quand les filtres changent
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, yearsOfExperience, location, teamSize]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Poste */}
        <div>
          <label htmlFor="position" className="block text-sm font-medium text-linear-text mb-2">
            Ton poste
          </label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full bg-linear-surface border border-linear-border rounded-lg px-4 py-2.5 text-linear-text focus:outline-none focus:border-linear-primary transition-colors"
          >
            <option value="">Sélectionner un poste</option>
            {availablePositions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Années d'expérience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-linear-text mb-2">
            Ton nombre d'années d'expérience dans le produit
          </label>
          <input
            id="experience"
            type="number"
            min="0"
            max="50"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            placeholder="Ex: 5"
            className="w-full bg-linear-surface border border-linear-border rounded-lg px-4 py-2.5 text-linear-text focus:outline-none focus:border-linear-primary transition-colors"
          />
        </div>

        {/* Localisation */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-linear-text mb-2">
            Ton lieu d'habitation
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-linear-surface border border-linear-border rounded-lg px-4 py-2.5 text-linear-text focus:outline-none focus:border-linear-primary transition-colors"
          >
            <option value="">Sélectionner une ville</option>
            {availableLocations.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Taille d'équipe */}
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-linear-text mb-2">
            Le nombre de personnes que tu manages
          </label>
          <input
            id="teamSize"
            type="number"
            min="0"
            max="100"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            placeholder="Ex: 3"
            className="w-full bg-linear-surface border border-linear-border rounded-lg px-4 py-2.5 text-linear-text focus:outline-none focus:border-linear-primary transition-colors"
          />
        </div>
      </div>

      <div className="text-sm text-linear-muted">
        Les résultats s'affinent automatiquement en fonction de tes critères
      </div>
    </div>
  );
}
