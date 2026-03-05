import os
import httpx
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP

load_dotenv()

API_KEY = os.getenv("MEMBERPRESS_API_KEY")
BASE_URL = os.getenv("MEMBERPRESS_BASE_URL", "https://www.le-ticket.fr/wp-json/mp/v1").rstrip("/")
SSL_VERIFY = os.getenv("MEMBERPRESS_SSL_VERIFY", "true").lower() != "false"

mcp = FastMCP("MemberPress")


def _headers() -> dict:
    return {"MEMBERPRESS-API-KEY": API_KEY}


def _get(path: str, params: dict | None = None) -> dict | list:
    url = f"{BASE_URL}{path}"
    with httpx.Client(timeout=30, verify=SSL_VERIFY) as client:
        response = client.get(url, headers=_headers(), params=params)
        response.raise_for_status()
        return response.json()


def _get_all(path: str, base_params: dict | None = None) -> list:
    """Récupère toutes les pages d'un endpoint paginé et retourne la liste complète."""
    params = dict(base_params or {})
    params.setdefault("per_page", 100)
    all_items: list = []
    page = 1
    with httpx.Client(timeout=30, verify=SSL_VERIFY) as client:
        while True:
            params["page"] = page
            response = client.get(f"{BASE_URL}{path}", headers=_headers(), params=params)
            response.raise_for_status()
            items = response.json()
            if not items:
                break
            all_items.extend(items)
            if len(items) < params["per_page"]:
                break
            page += 1
    return all_items


# ---------------------------------------------------------------------------
# Members
# ---------------------------------------------------------------------------

@mcp.tool()
def list_members(page: int = 1, per_page: int = 25, search: str = "", fetch_all: bool = False) -> list:
    """
    Récupère la liste paginée des membres MemberPress.

    Chaque membre retourné contient :
    - Infos de base : id, email, username, first_name, last_name, display_name, registered_at
    - active_memberships : liste des memberships actives (id, title, price, period_type, expire_type)
    - active_txn_count, expired_txn_count, trial_txn_count : compteurs de transactions
    - sub_count : nombre d'abonnements
    - login_count : nombre de connexions
    - first_txn, latest_txn : première et dernière transaction (id, amount, status, created_at)
    - recent_transactions : liste des transactions récentes
    - recent_subscriptions : liste des abonnements récents
    - address : adresse postale (line1, line2, city, state, zip, country)
    - profile : champs de profil personnalisés

    Args:
        page: Numéro de page (défaut: 1) — ignoré si fetch_all=True
        per_page: Nombre de membres par page (défaut: 25, max recommandé: 100)
        search: Terme de recherche (email, nom, prénom)
        fetch_all: Si True, récupère automatiquement toutes les pages et retourne tous les membres
    """
    params: dict = {"per_page": per_page}
    if search:
        params["search"] = search
    if fetch_all:
        return _get_all("/members", params)
    params["page"] = page
    return _get("/members", params)


@mcp.tool()
def get_member(member_id: int) -> dict:
    """
    Récupère les détails complets d'un membre MemberPress par son ID.

    Retourne les mêmes champs riches que list_members pour un seul membre :
    - Infos de base : id, email, username, first_name, last_name, display_name, registered_at
    - active_memberships : liste des memberships actives avec détails (title, price, period_type)
    - active_txn_count, expired_txn_count, trial_txn_count : compteurs de transactions
    - sub_count : nombre d'abonnements
    - login_count : nombre de connexions
    - first_txn, latest_txn : première et dernière transaction (id, amount, status, created_at)
    - recent_transactions : liste des transactions récentes avec détails
    - recent_subscriptions : liste des abonnements récents avec détails
    - address : adresse postale complète
    - profile : champs de profil personnalisés

    Args:
        member_id: L'identifiant numérique du membre
    """
    return _get(f"/members/{member_id}")


# ---------------------------------------------------------------------------
# Memberships (produits/offres d'abonnement)
# ---------------------------------------------------------------------------

@mcp.tool()
def list_memberships(page: int = 1, per_page: int = 25, fetch_all: bool = False) -> list:
    """
    Récupère la liste paginée des memberships (offres d'abonnement) disponibles.

    Une membership est un produit/offre que les membres peuvent souscrire.
    Chaque membership contient :
    - id, title, status (publish/draft)
    - price : prix de l'offre
    - period, period_type : durée (ex: 1 month, 1 year)
    - group : groupe tarifaire auquel appartient l'offre
    - trial : si une période d'essai est disponible (trial_days, trial_amount)
    - expire_type : type d'expiration (none, fixed, interval)
    - tax_exempt, tax_class : paramètres fiscaux
    - pricing_title, pricing_benefits : informations affichées sur la page de tarification
    - limit_cycles : si le nombre de cycles est limité
    - allow_renewal : si le renouvellement est autorisé
    - date, modified : dates de création et modification

    Args:
        page: Numéro de page (défaut: 1) — ignoré si fetch_all=True
        per_page: Nombre de memberships par page (défaut: 25, max recommandé: 100)
        fetch_all: Si True, récupère automatiquement toutes les pages et retourne toutes les memberships
    """
    if fetch_all:
        return _get_all("/memberships", {"per_page": per_page})
    return _get("/memberships", {"page": page, "per_page": per_page})


@mcp.tool()
def get_membership(membership_id: int) -> dict:
    """
    Récupère les détails complets d'une membership (offre d'abonnement) par son ID.

    Retourne tous les détails de configuration d'une offre :
    - id, title, status, date, modified
    - price, period, period_type : tarification et durée
    - group : groupe tarifaire avec ses paramètres
    - author : auteur/créateur de l'offre
    - trial, trial_days, trial_amount : paramètres de période d'essai
    - expire_type, expire_after, expire_unit, expire_fixed : règles d'expiration
    - tax_exempt, tax_class : paramètres fiscaux
    - pricing_title, pricing_show_price, pricing_benefits : affichage public
    - limit_cycles, limit_cycles_num, limit_cycles_action : limitation de cycles
    - allow_renewal, access_url : accès et renouvellement
    - thank_you_page_enabled, custom_login_urls : pages de redirection
    - cannot_purchase_message : message si non achetable

    Args:
        membership_id: L'identifiant numérique de la membership
    """
    return _get(f"/memberships/{membership_id}")


# ---------------------------------------------------------------------------
# Subscriptions
# ---------------------------------------------------------------------------

@mcp.tool()
def list_subscriptions(page: int = 1, per_page: int = 25, fetch_all: bool = False) -> list:
    """
    Récupère la liste paginée des abonnements MemberPress.

    Chaque abonnement contient les objets imbriqués complets membership et member,
    plus les détails de l'abonnement :
    - membership : objet complet de l'offre souscrite (title, price, period_type, etc.)
    - member : objet du membre abonné (email, first_name, last_name, etc.)
    - id, subscr_id : identifiants de l'abonnement (subscr_id = ID Stripe ex: sub_xxx)
    - status : statut (active, cancelled, expired, suspended, etc.)
    - price, total, period, period_type : tarification et périodicité
    - tax_rate, tax_amount, tax_desc, tax_class : détails fiscaux
    - gateway : passerelle de paiement utilisée
    - coupon : coupon appliqué (false si aucun)
    - created_at : date de création
    - cc_last4, cc_exp_month, cc_exp_year : infos carte bancaire (partielles)
    - trial, trial_days, trial_amount : paramètres d'essai
    - prorated_trial : si l'essai a été proratisé

    Args:
        page: Numéro de page (défaut: 1) — ignoré si fetch_all=True
        per_page: Nombre d'abonnements par page (défaut: 25, max recommandé: 100)
        fetch_all: Si True, récupère automatiquement toutes les pages et retourne tous les abonnements
    """
    if fetch_all:
        return _get_all("/subscriptions", {"per_page": per_page})
    return _get("/subscriptions", {"page": page, "per_page": per_page})


@mcp.tool()
def get_subscription(subscription_id: int) -> dict:
    """
    Récupère les détails complets d'un abonnement MemberPress par son ID.

    Retourne les mêmes champs riches que list_subscriptions pour un seul abonnement :
    - membership : objet complet de l'offre souscrite
    - member : objet complet du membre abonné
    - id, subscr_id (ex: sub_xxx Stripe), gateway
    - status : active, cancelled, expired, suspended, etc.
    - price, total, period, period_type
    - tax_rate, tax_amount, tax_desc, tax_class
    - coupon : coupon appliqué (false si aucun)
    - created_at : date de création
    - cc_last4, cc_exp_month, cc_exp_year : infos carte bancaire (partielles)
    - trial, trial_days, trial_amount, trial_total

    Args:
        subscription_id: L'identifiant numérique de l'abonnement
    """
    return _get(f"/subscriptions/{subscription_id}")


# ---------------------------------------------------------------------------
# Transactions
# ---------------------------------------------------------------------------

@mcp.tool()
def list_transactions(page: int = 1, per_page: int = 25, fetch_all: bool = False) -> list:
    """
    Récupère la liste paginée des transactions MemberPress.

    Chaque transaction contient les objets imbriqués complets membership, member et subscription,
    plus les détails de la transaction :
    - membership : objet complet de la membership concernée (title, price, period_type, etc.)
    - member : objet du membre (email, first_name, last_name, etc.)
    - subscription : objet de l'abonnement lié (subscr_id, status, gateway, etc.)
    - id : identifiant de la transaction
    - amount : montant hors taxes
    - total : montant total TTC
    - tax_amount, tax_rate, tax_desc, tax_class : détails fiscaux
    - status : statut (complete, pending, failed, refunded, etc.)
    - created_at : date de création
    - expires_at : date d'expiration de l'accès
    - gateway : passerelle de paiement
    - trans_num : numéro de transaction (ex: ID Stripe ch_xxx)
    - coupon_id : ID du coupon appliqué (0 si aucun)
    - prorated : si la transaction est proratisée

    Args:
        page: Numéro de page (défaut: 1) — ignoré si fetch_all=True
        per_page: Nombre de transactions par page (défaut: 25, max recommandé: 100)
        fetch_all: Si True, récupère automatiquement toutes les pages et retourne toutes les transactions
    """
    if fetch_all:
        return _get_all("/transactions", {"per_page": per_page})
    return _get("/transactions", {"page": page, "per_page": per_page})


@mcp.tool()
def get_transaction(transaction_id: int) -> dict:
    """
    Récupère les détails complets d'une transaction MemberPress par son ID.

    Retourne les mêmes champs riches que list_transactions pour une seule transaction :
    - membership : objet complet de la membership concernée
    - member : objet complet du membre
    - subscription : objet complet de l'abonnement lié
    - id, trans_num (ex: ch_xxx Stripe), gateway
    - amount (HT), total (TTC)
    - tax_amount, tax_rate, tax_desc, tax_class
    - status : complete, pending, failed, refunded, etc.
    - created_at, expires_at : dates de création et d'expiration d'accès
    - coupon_id : ID du coupon (0 si aucun)
    - prorated : si transaction proratisée

    Args:
        transaction_id: L'identifiant numérique de la transaction
    """
    return _get(f"/transactions/{transaction_id}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    if not API_KEY:
        raise ValueError("MEMBERPRESS_API_KEY is not set. Check your .env file.")
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
