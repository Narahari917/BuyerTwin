from db.connection import get_connection


def get_all_buyers():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM buyers ORDER BY created_at;")
            rows = cur.fetchall()
            return [dict(row) for row in rows]


def get_buyer_by_id(buyer_id: str):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM buyers WHERE id = %s;", (buyer_id,))
            row = cur.fetchone()
            return dict(row) if row else None