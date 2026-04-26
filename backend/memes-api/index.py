"""
API для мемов: список, поиск, рецензии, оценки, загрузка своих мемов в S3.
"""
import base64
import json
import os
import uuid
import psycopg2
import boto3


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

SEED = [
    ("Когда код работает с первого раза", "dank_lord",
     "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/20828359-70e4-49c2-892c-afdf7369de58.jpg",
     ["it", "программисты"]),
    ("Понедельник снова пришёл", "meme_factory",
     "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/fb15952e-c129-440b-9bd7-e5eaf113132a.jpg",
     ["офис", "жизнь"]),
    ("Кот смотрит в пустоту", "catmeme42",
     "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/e1632369-5de7-4789-b180-5f9ab3c8a13f.jpg",
     ["коты", "экзистенциал"]),
    ("Дедлайн завтра, я смотрю мемы", "procrastinator99",
     "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/20828359-70e4-49c2-892c-afdf7369de58.jpg",
     ["прокрастинация", "работа"]),
    ("5 минут поиграть", "gamer_zone",
     "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/fb15952e-c129-440b-9bd7-e5eaf113132a.jpg",
     ["игры", "ложь"]),
    ("Бюджет закончился, мечты живут", "broke_but_happy",
     "https://cdn.poehali.dev/projects/d6085f8e-b88c-4ead-8c2f-dc38d0eea019/files/e1632369-5de7-4789-b180-5f9ab3c8a13f.jpg",
     ["деньги", "мечты"]),
]


def seed_if_empty(cur):
    cur.execute("SELECT COUNT(*) FROM memes")
    if cur.fetchone()[0] == 0:
        for title, author, url, tags in SEED:
            cur.execute(
                "INSERT INTO memes (title, author, image_url, tags) VALUES (%s, %s, %s, %s)",
                (title, author, url, tags)
            )


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")

    conn = get_conn()
    cur = conn.cursor()

    try:
        # POST ?action=upload — загрузить мем в S3 и сохранить в БД
        if method == "POST" and action == "upload":
            data = json.loads(event.get("body") or "{}")
            title = data.get("title", "").strip()
            author = data.get("author", "Аноним").strip() or "Аноним"
            tags_raw = data.get("tags", "")
            tags = [t.strip().lower() for t in tags_raw.split(",") if t.strip()]
            image_b64 = data.get("image", "")
            content_type = data.get("content_type", "image/jpeg")

            if not title or not image_b64:
                return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "title and image required"})}

            image_data = base64.b64decode(image_b64)
            ext = "png" if "png" in content_type else "gif" if "gif" in content_type else "jpg"
            key = f"memes/{uuid.uuid4()}.{ext}"

            s3 = get_s3()
            s3.put_object(Bucket="files", Key=key, Body=image_data, ContentType=content_type)
            image_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"

            cur.execute(
                "INSERT INTO memes (title, author, image_url, tags) VALUES (%s, %s, %s, %s) RETURNING id",
                (title, author, image_url, tags)
            )
            meme_id = cur.fetchone()[0]
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "meme_id": meme_id, "image_url": image_url})}

        # POST ?action=review — сохранить рецензию + оценку
        if method == "POST" and action == "review":
            data = json.loads(event.get("body") or "{}")
            meme_id = int(data["meme_id"])
            rating = int(data["rating"])
            body = data.get("body", "").strip()
            author_name = data.get("author_name", "Аноним").strip() or "Аноним"

            cur.execute("INSERT INTO meme_ratings (meme_id, score) VALUES (%s, %s)", (meme_id, rating))
            if body:
                cur.execute(
                    "INSERT INTO meme_reviews (meme_id, author_name, body, rating) VALUES (%s, %s, %s, %s)",
                    (meme_id, author_name, body, rating)
                )
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        # GET ?action=reviews&meme_id=X — рецензии мема
        if method == "GET" and action == "reviews":
            meme_id = int(params.get("meme_id", 0))
            cur.execute(
                "SELECT id, author_name, body, rating, created_at FROM meme_reviews WHERE meme_id = %s ORDER BY created_at DESC LIMIT 20",
                (meme_id,)
            )
            rows = cur.fetchall()
            reviews = [
                {"id": r[0], "author_name": r[1], "body": r[2], "rating": r[3],
                 "created_at": r[4].isoformat() if r[4] else None}
                for r in rows
            ]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"reviews": reviews})}

        # GET / — список с поиском
        if method == "GET":
            seed_if_empty(cur)
            conn.commit()

            search = params.get("q", "").strip().lower()
            sort = params.get("sort", "new")

            query = """
                SELECT
                    m.id, m.title, m.author, m.image_url, m.tags, m.created_at,
                    COALESCE(ROUND(AVG(r.score)::numeric, 1), 0) AS avg_rating,
                    COUNT(DISTINCT rv.id) AS review_count
                FROM memes m
                LEFT JOIN meme_ratings r ON r.meme_id = m.id
                LEFT JOIN meme_reviews rv ON rv.meme_id = m.id
            """
            conditions = []
            if search:
                safe = search.replace("'", "''")
                conditions.append(
                    "(LOWER(m.title) LIKE '%" + safe + "%' OR LOWER(m.author) LIKE '%" + safe + "%'"
                    " OR EXISTS (SELECT 1 FROM unnest(m.tags) t WHERE LOWER(t) LIKE '%" + safe + "%'))"
                )
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            query += " GROUP BY m.id"
            query += " ORDER BY avg_rating DESC, review_count DESC" if sort == "top" else " ORDER BY m.created_at DESC"

            cur.execute(query)
            rows = cur.fetchall()
            memes = [
                {"id": r[0], "title": r[1], "author": r[2], "image_url": r[3],
                 "tags": r[4] or [], "created_at": r[5].isoformat() if r[5] else None,
                 "avg_rating": float(r[6]), "review_count": int(r[7])}
                for r in rows
            ]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"memes": memes})}

    finally:
        cur.close()
        conn.close()

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
