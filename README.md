# MemberPress MCP Server

Serveur MCP (Model Context Protocol) pour interroger l'API MemberPress directement depuis Claude.

## Outils disponibles

| Outil | Description |
|-------|-------------|
| `list_members` | Liste les membres (pagination + recherche) |
| `get_member` | Détails d'un membre par ID |
| `list_subscriptions` | Liste les abonnements (pagination) |
| `get_subscription` | Détails d'un abonnement par ID |
| `list_transactions` | Liste les transactions (pagination) |
| `get_transaction` | Détails d'une transaction par ID |

## Installation

### 1. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Édite `.env` et renseigne ta clé API :

```
MEMBERPRESS_API_KEY=ta_clé_api
MEMBERPRESS_BASE_URL=https://www.leticket.fr/wp-json/mp/v1
```

### 2. Installer les dépendances

```bash
pip install -e .
```

Ou avec `uv` (recommandé) :

```bash
uv pip install -e .
```

### 3. Tester le serveur

```bash
python server.py
```

## Configuration Claude Desktop

Ajoute ceci dans `~/Library/Application Support/Claude/claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "memberpress": {
      "command": "python",
      "args": ["/chemin/absolu/vers/server.py"],
      "env": {
        "MEMBERPRESS_API_KEY": "ta_clé_api",
        "MEMBERPRESS_BASE_URL": "https://www.leticket.fr/wp-json/mp/v1"
      }
    }
  }
}
```

> **Note** : Si tu utilises un environnement virtuel, remplace `"command": "python"` par le chemin absolu vers le Python du venv, ex: `"/chemin/vers/venv/bin/python"`.

Redémarre Claude Desktop après avoir modifié la config.
