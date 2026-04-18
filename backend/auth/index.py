import json
import os
import hashlib
import secrets
import psycopg2

SCHEMA = "t_p19054905_duolingo_blood_mobil"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def make_token() -> str:
    return secrets.token_hex(32)

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

def handler(event: dict, context) -> dict:
    """Авторизация: регистрация, вход, проверка сессии, выход. Роутинг через ?action=register|login|me|logout."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    body = json.loads(event.get("body") or "{}")

    # register
    if action == "register":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        if not name or not email or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = %s", (email,))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email уже зарегистрирован"})}

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id, name, email, level, xp, streak, avatar_emoji",
            (name, email, hash_password(password))
        )
        row = cur.fetchone()
        user = {"id": row[0], "name": row[1], "email": row[2], "level": row[3], "xp": row[4], "streak": row[5], "avatar_emoji": row[6]}

        token = make_token()
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user["id"], token))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "user": user})}

    # login
    if action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        if not email or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Введите email и пароль"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, email, level, xp, streak, avatar_emoji FROM {SCHEMA}.users WHERE email = %s AND password_hash = %s",
            (email, hash_password(password))
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

        user = {"id": row[0], "name": row[1], "email": row[2], "level": row[3], "xp": row[4], "streak": row[5], "avatar_emoji": row[6]}
        token = make_token()
        cur.execute(f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)", (user["id"], token))
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "user": user})}

    # me — проверка токена
    if action == "me":
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if not token:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Нет токена"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT u.id, u.name, u.email, u.level, u.xp, u.streak, u.avatar_emoji
                FROM {SCHEMA}.sessions s
                JOIN {SCHEMA}.users u ON s.user_id = u.id
                WHERE s.token = %s AND s.expires_at > NOW()""",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

        user = {"id": row[0], "name": row[1], "email": row[2], "level": row[3], "xp": row[4], "streak": row[5], "avatar_emoji": row[6]}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"user": user})}

    # logout
    if action == "logout":
        token = (event.get("headers") or {}).get("X-Session-Token", "")
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}