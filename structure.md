# Le Ticket — Structure des homepages

> Document vivant. Mis à jour à chaque nouvelle version.

---

## Design Tokens

| Token | Valeur | Usage |
|-------|--------|-------|
| `--cream` | `#F7F6F3` | Fond principal |
| `--cream-border` | `#E5E0D8` | Bordures sur fond crème |
| `--ink` | `#0C1628` | Texte principal |
| `--teal` | `#0F5744` | Sidebar, accents, CTA principaux |
| `--teal-light` | `#1A6655` | Variante teal (UGC section) |
| `--amber` | `#E8A020` | Tags, highlights, CTA sidebar |
| `--sidebar-w` | `260px` | Largeur sidebar |
| `--font-sans` | `Inter` | Corps de texte |
| `--font-serif` | `DM Serif Display` | Titres, hero, chiffres |

---

## Navigation Sidebar

**Groupe 1 — Formats**

1. La newsletter
2. Les Émissions du Ticket
3. Les évènements Produit
4. Tous les articles
5. Les fiches de lecture

*— séparateur —*

**Groupe 2 — Thématiques**

1. IA & Produit
2. Les fondamentaux du produit
3. Stratégie Produit
4. Roadmap & OKR

---

## Ordre des blocs — v5

| # | Nom | Pattern | Fond | Notes |
|---|-----|---------|------|-------|
| 1 | Barre d'annonce | Full-width dark bar | `#0C1628` | Actualité / prochain évènement |
| 2 | Hero | Email form + 2 CTAs + stats row | `--cream` | Pas d'articles. CTA 1 = gratuit, CTA 2 = Premium. Stats : abonnés, entreprises, archives, taux ouverture |
| 3 | Logos carrousel | CSS marquee infini | `--cream` | Noms entreprises membres ; fade edges ; style claude.ai. Hover pause. |
| 4 | UGC — Témoignages | Grille 3×2 cartes sombres | `#0F2A1E` | Style v2 : avatar couleur + nom + rôle + "Abonné·e depuis..." + citation italique |
| 5 | Derniers articles | Lignes horizontales séparées | `--cream` | Style claude.com/product/claude-code : 90px thumb + tags + titre serif + excerpt + meta + "Lire →" pill |
| 6 | Dirigeants tech EU | Grille 3 colonnes | `--cream` | Style v3 : gradient photo + nom + rôle + excerpt 3 lignes + "Lire l'interview →" |
| 7 | JTBD : Ce qu'il faut avoir lu | App Store grid (featured + 3 compacts) | `--cream` | Featured card gauche + stack 3 compacts droite |
| 8 | JTBD : Me former à l'IA | App Store grid | `#F2F4F2` (alt) | Même pattern, fond légèrement distinct pour alternance |
| 9 | JTBD : Management produit | App Store grid | `--cream` | |
| 10 | JTBD : Fondamentaux + fiches | App Store grid | `#F2F4F2` (alt) | Mention explicite "fiches de lecture" dans les compacts |
| 11 | Les plus lus | Grille 2 colonnes numérotée | `--cream` | Numéros en DM Serif gris clair, 6 items |
| 12 | Les Émissions du Ticket | 3 vidéo-cards | `#0C1628` | Style v3 : 16:9 thumb + play overlay + auteur + titre |
| 13 | Premium | Tableau tarifaire 2 colonnes | `--teal` | Gratuit vs Premium. 6 avantages Premium |
| 14 | FAQ | Accordéon `<details>` | `--cream` | 5 questions. Icône + rotates 45° à l'ouverture |
| 15 | CTA Newsletter | Flex 2 colonnes : texte + form | `--cream` | "Pas encore prêt pour le Premium ?" |
| 16 | Footer | Grille 4 colonnes | `#0C1628` | Brand desc + Formats + Thématiques + Le Ticket |

---

## Patterns réutilisables

### 1. App Store / JTBD Grid

Structure 2 colonnes : featured card gauche + stack compacts droite.

```html
<section class="jtbd-section">
  <div class="section-header">
    <div>
      <div class="section-eyebrow">Contexte / persona</div>
      <h2 class="section-title font-serif">Titre JTBD</h2>
    </div>
    <a href="#" class="see-all">Voir tout →</a>
  </div>
  <div class="jtbd-grid"> <!-- grid-cols: 1fr 1fr, gap: 20px -->

    <!-- Featured card (colonne gauche) -->
    <a href="#" class="featured-card">
      <div class="img-zone img-xxx"></div> <!-- height: 200px -->
      <div class="card-body">
        <span class="tag">Tag</span>
        <h3 class="card-title font-serif">Titre</h3>
        <p class="card-excerpt">Excerpt...</p>
      </div>
    </a>

    <!-- Compact stack (colonne droite) -->
    <div class="compact-stack"> <!-- flex-col, gap: 12px -->
      <a href="#" class="compact-item"> <!-- flex, 70px thumb + body -->
        <div class="compact-thumb img-xxx"></div>
        <div class="compact-body">
          <span class="tag">Tag</span>
          <div class="compact-title">Titre article</div>
        </div>
      </a>
      <!-- × 3 items -->
    </div>
  </div>
</section>
```

Variante fond : ajouter class `alt` sur `.jtbd-section` → `background: #F2F4F2`

---

### 2. Article Row (style claude.com)

```html
<a href="#" class="article-row"> <!-- flex, align-center, gap: 20px, border-bottom -->
  <div class="art-thumb img-xxx"></div> <!-- 90×90, border-radius: 10px -->
  <div class="art-body"> <!-- flex: 1 -->
    <div class="art-tags"><span class="tag">Tag</span></div>
    <h3 class="art-title font-serif">Titre de l'article</h3>
    <p class="art-excerpt">Excerpt 2 lignes max...</p>
    <span class="art-meta">Date · X min de lecture</span>
  </div>
  <a href="#" class="art-cta">Lire →</a> <!-- pill white border, hover: teal -->
</a>
```

---

### 3. Video Card (style v3)

```html
<div class="video-card"> <!-- border-radius: 14px, overflow: hidden -->
  <div class="video-thumb img-xxx"> <!-- aspect-ratio: 16/9, position: relative -->
    <div class="play-overlay"> <!-- inset: 0, bg: rgba(0,0,0,.25) -->
      <div class="play-circle">▶</div> <!-- 48px, white bg, border-radius: 50% -->
    </div>
  </div>
  <div class="video-info"> <!-- padding: 16px -->
    <div class="video-author">Prénom Nom · Épisode N</div>
    <div class="video-title">Titre de l'émission</div>
  </div>
</div>
```

---

### 4. Testimonial Card (style v2)

Section sur fond `#0F2A1E`, grille 3×2.

```html
<div class="testimonial-card"> <!-- bg: rgba(255,255,255,.06), border: rgba(255,255,255,.1) -->
  <div class="t-header"> <!-- flex, gap: 12px, mb: 16px -->
    <div class="t-avatar img-xxx">XX</div> <!-- 40px, border-radius: 50%, initiales -->
    <div>
      <div class="t-name">Prénom Nom</div>
      <div class="t-role">Rôle · Entreprise</div>
      <div class="t-since">Abonné·e depuis mois année</div>
    </div>
  </div>
  <p class="t-quote">« Citation italique... »</p>
</div>
```

---

### 5. Gradient placeholders (images)

```css
.img-blue    { background: linear-gradient(135deg, #667eea, #764ba2); }
.img-green   { background: linear-gradient(135deg, #11998e, #38ef7d); }
.img-amber   { background: linear-gradient(135deg, #f7971e, #ffd200); }
.img-purple  { background: linear-gradient(135deg, #834d9b, #d04ed6); }
.img-rose    { background: linear-gradient(135deg, #f953c6, #b91d73); }
.img-slate   { background: linear-gradient(135deg, #485563, #29323c); }
.img-teal    { background: linear-gradient(135deg, #0F5744, #1a9175); }
.img-teal-d  { background: linear-gradient(135deg, #0a3d2b, #0F5744); }
.img-navy    { background: linear-gradient(135deg, #0C1628, #1a2a4a); }
.img-indigo  { background: linear-gradient(135deg, #3b1f6b, #5c3daa); }
.img-orange  { background: linear-gradient(135deg, #e8500a, #f7971e); }
.img-pink    { background: linear-gradient(135deg, #ee0979, #ff6a00); }
```

---

## Changelog

| Version | Date | Résumé |
|---------|------|--------|
| v1 | mars 2026 | Éditoriale & sobre. Fond crème, DM Serif, hero avec stats, entreprises en liste bold. |
| v2 | mars 2026 | Contenu réel scrapé le-ticket.fr. Sections sombres, gradients teal, onglets podcast. |
| v3 | mars 2026 | Sidebar + UI sobre (fonds blancs). Badges entreprises, JTBD, vidéos, fiches de lecture. |
| v4 | mars 2026 | Sidebar v3 + UI magazine v1 (crème, DM Serif). JTBD App Store, social proof haut. Hero avec 2 articles. |
| v5 | mars 2026 | Hero email-form (sans articles). Logos carrousel CSS. UGC style v2. Articles style claude.com. FAQ accordion. |
