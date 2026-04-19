from db.connection import get_connection


def get_all_listings():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM listings ORDER BY price;")
            rows = cur.fetchall()
            return [dict(row) for row in rows]