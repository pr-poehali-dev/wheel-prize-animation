"""Админка: создание и просмотр промокодов."""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
}

ADMIN_KEY = os.environ.get('ADMIN_KEY', '')


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def resp(status, body):
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'body': json.dumps(body, ensure_ascii=False, default=str),
    }


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return resp(200, '')

    headers = event.get('headers') or {}
    key = headers.get('X-Admin-Key') or headers.get('x-admin-key') or ''
    if key != ADMIN_KEY or not ADMIN_KEY:
        return resp(403, {'error': 'Нет доступа'})

    method = event.get('httpMethod', 'GET')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    # GET — список промокодов
    if method == 'GET':
        cur.execute("SELECT id, code, bricks, max_uses, uses, created_at FROM promo_codes ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()
        promos = [{'id': r[0], 'code': r[1], 'bricks': r[2], 'max_uses': r[3], 'uses': r[4], 'created_at': r[5]} for r in rows]
        return resp(200, {'promos': promos})

    # POST — создать промокод
    if method == 'POST':
        code = body.get('code', '').strip().upper()
        bricks = int(body.get('bricks', 0))
        max_uses = int(body.get('max_uses', 1))
        if not code or bricks <= 0:
            conn.close()
            return resp(400, {'error': 'code и bricks обязательны'})
        try:
            cur.execute(
                "INSERT INTO promo_codes (code, bricks, max_uses) VALUES (%s, %s, %s) RETURNING id",
                (code, bricks, max_uses)
            )
            promo_id = cur.fetchone()[0]
            conn.commit()
            conn.close()
            return resp(200, {'ok': True, 'id': promo_id, 'code': code, 'bricks': bricks, 'max_uses': max_uses})
        except psycopg2.errors.UniqueViolation:
            conn.close()
            return resp(400, {'error': 'Такой промокод уже существует'})

    conn.close()
    return resp(404, {'error': 'Not found'})
