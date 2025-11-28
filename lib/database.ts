import Database from 'better-sqlite3';
import path from 'path';
import { encrypt, decrypt } from './encryption';
import type { SalaryProfile, SearchFilters } from '@/types';

let db: Database.Database | null = null;

/**
 * Initialise la connexion à la base de données SQLite
 * La base de données est stockée localement et contient les données chiffrées
 */
function getDatabase(): Database.Database {
  if (db) return db;

  const dbPath = path.join(process.cwd(), 'data', 'salaries.db');

  // Créer le dossier data s'il n'existe pas
  const fs = require('fs');
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(dbPath);

  // Créer la table si elle n'existe pas
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      position TEXT NOT NULL,
      years_of_experience INTEGER NOT NULL,
      location TEXT NOT NULL,
      team_size INTEGER NOT NULL,
      salary_encrypted TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Index pour améliorer les performances de recherche
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_position ON profiles(position);
    CREATE INDEX IF NOT EXISTS idx_experience ON profiles(years_of_experience);
    CREATE INDEX IF NOT EXISTS idx_location ON profiles(location);
    CREATE INDEX IF NOT EXISTS idx_team_size ON profiles(team_size);
  `);

  return db;
}

/**
 * Crée un nouveau profil salarial chiffré
 */
export function createProfile(profile: Omit<SalaryProfile, 'id' | 'createdAt'>): SalaryProfile {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Chiffrer le salaire avant de le stocker
  const encryptedSalary = encrypt(profile.salary.toString());

  const stmt = db.prepare(`
    INSERT INTO profiles (id, position, years_of_experience, location, team_size, salary_encrypted, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    profile.position,
    profile.yearsOfExperience,
    profile.location,
    profile.teamSize,
    encryptedSalary,
    createdAt
  );

  return {
    id,
    ...profile,
    createdAt,
  };
}

/**
 * Recherche des profils similaires basés sur les filtres
 * Calcule un score de similarité pour chaque profil
 */
export function searchProfiles(filters: SearchFilters): SalaryProfile[] {
  const db = getDatabase();

  let query = 'SELECT * FROM profiles WHERE 1=1';
  const params: any[] = [];

  // Construire la requête dynamiquement selon les filtres
  if (filters.position) {
    query += ' AND position = ?';
    params.push(filters.position);
  }

  // Recherche approximative pour l'expérience (±2 ans)
  if (filters.yearsOfExperience !== undefined) {
    query += ' AND years_of_experience BETWEEN ? AND ?';
    params.push(filters.yearsOfExperience - 2);
    params.push(filters.yearsOfExperience + 2);
  }

  if (filters.location) {
    query += ' AND location = ?';
    params.push(filters.location);
  }

  // Recherche approximative pour la taille d'équipe (±5 personnes)
  if (filters.teamSize !== undefined) {
    query += ' AND team_size BETWEEN ? AND ?';
    params.push(Math.max(0, filters.teamSize - 5));
    params.push(filters.teamSize + 5);
  }

  query += ' ORDER BY created_at DESC LIMIT 50';

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as any[];

  // Déchiffrer les salaires et calculer la similarité
  return rows.map(row => {
    const salary = parseInt(decrypt(row.salary_encrypted), 10);

    return {
      id: row.id,
      position: row.position,
      yearsOfExperience: row.years_of_experience,
      location: row.location,
      teamSize: row.team_size,
      salary,
      createdAt: row.created_at,
    };
  }).sort((a, b) => {
    // Calculer un score de similarité
    const scoreA = calculateSimilarity(a, filters);
    const scoreB = calculateSimilarity(b, filters);
    return scoreB - scoreA;
  });
}

/**
 * Calcule un score de similarité entre un profil et les filtres de recherche
 */
function calculateSimilarity(profile: SalaryProfile, filters: SearchFilters): number {
  let score = 0;

  // Match exact du poste = +100 points
  if (filters.position && profile.position === filters.position) {
    score += 100;
  }

  // Proximité de l'expérience (plus c'est proche, plus le score est élevé)
  if (filters.yearsOfExperience !== undefined) {
    const expDiff = Math.abs(profile.yearsOfExperience - filters.yearsOfExperience);
    score += Math.max(0, 50 - (expDiff * 10));
  }

  // Match exact de la localisation = +75 points
  if (filters.location && profile.location === filters.location) {
    score += 75;
  }

  // Proximité de la taille d'équipe
  if (filters.teamSize !== undefined) {
    const teamDiff = Math.abs(profile.teamSize - filters.teamSize);
    score += Math.max(0, 25 - (teamDiff * 2));
  }

  return score;
}

/**
 * Récupère tous les profils (pour l'administration uniquement)
 */
export function getAllProfiles(): SalaryProfile[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM profiles ORDER BY created_at DESC');
  const rows = stmt.all() as any[];

  return rows.map(row => ({
    id: row.id,
    position: row.position,
    yearsOfExperience: row.years_of_experience,
    location: row.location,
    teamSize: row.team_size,
    salary: parseInt(decrypt(row.salary_encrypted), 10),
    createdAt: row.created_at,
  }));
}

/**
 * Récupère les statistiques globales (sans dévoiler les données individuelles)
 */
export function getStats() {
  const db = getDatabase();

  const countStmt = db.prepare('SELECT COUNT(*) as count FROM profiles');
  const { count } = countStmt.get() as { count: number };

  const positionsStmt = db.prepare('SELECT DISTINCT position FROM profiles');
  const positions = (positionsStmt.all() as any[]).map(r => r.position);

  const locationsStmt = db.prepare('SELECT DISTINCT location FROM profiles');
  const locations = (locationsStmt.all() as any[]).map(r => r.location);

  return {
    totalProfiles: count,
    positions,
    locations,
  };
}
