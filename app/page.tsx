'use client';

import { useState } from 'react';
import SearchFilters from '@/components/SearchFilters';
import SearchResults from '@/components/SearchResults';
import type { SalaryProfile, SearchFilters as Filters } from '@/types';

export default function Home() {
  const [results, setResults] = useState<SalaryProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (filters: Filters) => {
    setLoading(true);
    try {
      const response = await fetch('/api/profiles/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error searching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-bg">
      {/* Header */}
      <header className="border-b border-linear-border bg-linear-bg/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-linear-text">
                Comparateur de Salaires
              </h1>
              <p className="text-sm text-linear-muted mt-1">
                Product Managers en France
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-linear-muted">Données chiffrées et anonymes</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Filtres */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-linear-surface border border-linear-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-linear-text mb-6">
                  Trouve ton profil
                </h2>
                <SearchFilters onSearch={handleSearch} />
              </div>

              {/* Info box */}
              <div className="mt-6 bg-linear-surface border border-linear-border rounded-lg p-6">
                <h3 className="text-sm font-semibold text-linear-text mb-3">
                  🔒 Sécurité et confidentialité
                </h3>
                <p className="text-sm text-linear-muted leading-relaxed">
                  Toutes les données sont chiffrées avec AES-256 et stockées de manière anonyme.
                  Même les développeurs ne peuvent pas accéder aux informations sensibles sans la clé de chiffrement.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - Résultats */}
          <div className="lg:col-span-2">
            <SearchResults results={results} loading={loading} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-linear-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-linear-muted">
            <p>Comparateur de salaires pour Product Managers en France</p>
            <p className="mt-2">Données anonymisées et chiffrées • Mise à jour continue</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
