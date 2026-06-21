"""Основная функция колеса: баланс, промокод, спин."""
import json
import os
import random
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

PRIZES = [
    {'label': 'Ничего',   'weight': 50,  'emoji': '😶'},
    {'label': 'Стикер',   'weight': 25,  'emoji': '🎟️'},
    {'label': 'VPN',      'weight': 15,  'emoji': '🛡️'},
    {'label': 'Промокод', 'weight': 8,   'emoji': '🎫'},
    {'label': 'Ничего',   'weight': 1.9, 'emoji': '😶'},
    {'label': 'Админка',  'weight': 0.1, 'emoji': '⚡'},
]
SPIN_COST = 10


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def resp(status, body, headers=None):
    h = {**CORS, 'Content-Type': 'application/json'}
    if headers:
        h.update(headers)
    return {'statusCode': status, 'headers': h, 'body': json.dumps(body, ensure_ascii=False)}


def get_or_create_user(cur, username):
    cur.execute("SELECT id, bricks FROM users WHERE username = %s", (username,))
    row = cur.fetchone()
    if row:
        return row[0], row[1]
    cur.execute("INSERT INTO users (username, bricks) VALUES (%s, 0) RETURNING id, bricks", (username,))
    return cur.fetchone()


def weighted_pick():
    total = sum(p['weight'] for p in PRIZES)
    r = random.uniform(0, total)
    for p in PRIZES:
        r -= p['weight']
        if r <= 0:
            return p
    return PRIZES[0]


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return resp(200, '')

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    # GET ?username=xxx
    if method == 'GET':
        username = (event.get('queryStringParameters') or {}).get('username', '').strip()
        if not username:
            return resp(400, {'error': 'username required'})
        conn = get_conn()
        cur = conn.cursor()
        uid, bricks = get_or_create_user(cur, username)
        conn.commit()
        conn.close()
        return resp(200, {'username': username, 'bricks': bricks})

    # POST /promo — активировать промокод
    if method == 'POST' and '/promo' in path:
        username = body.get('username', '').strip()
        code = body.get('code', '').strip().upper()
        if not username or not code:
            return resp(400, {'error': 'username и code обязательны'})
        conn = get_conn()
        cur = conn.cursor()
        uid, bricks = get_or_create_user(cur, username)
        cur.execute("SELECT id, bricks, max_uses, uses FROM promo_codes WHERE code = %s", (code,))
        promo = cur.fetchone()
        if not promo:
            conn.close()
            return resp(404, {'error': 'Промокод не найден'})
        promo_id, promo_bricks, max_uses, uses = promo
        if uses >= max_uses:
            conn.close()
            return resp(400, {'error': 'Промокод уже использован'})
        cur.execute("SELECT 1 FROM promo_uses WHERE user_id = %s AND promo_id = %s", (uid, promo_id))
        if cur.fetchone():
            conn.close()
            return resp(400, {'error': 'Ты уже использовал этот промокод'})
        cur.execute("UPDATE users SET bricks = bricks + %s WHERE id = %s", (promo_bricks, uid))
        cur.execute("UPDATE promo_codes SET uses = uses + 1 WHERE id = %s", (promo_id,))
        cur.execute("INSERT INTO promo_uses (user_id, promo_id) VALUES (%s, %s)", (uid, promo_id))
        conn.commit()
        cur.execute("SELECT bricks FROM users WHERE id = %s", (uid,))
        new_bricks = cur.fetchone()[0]
        conn.close()
        return resp(200, {'ok': True, 'added': promo_bricks, 'bricks': new_bricks})

    # POST /spin — прокрутить колесо
    if method == 'POST' and '/spin' in path:
        username = body.get('username', '').strip()
        if not username:
            return resp(400, {'error': 'username required'})
        conn = get_conn()
        cur = conn.cursor()
        uid, bricks = get_or_create_user(cur, username)
        if bricks < SPIN_COST:
            conn.close()
            return resp(400, {'error': f'Недостаточно бриков. Нужно {SPIN_COST}, у тебя {bricks}'})
        prize = weighted_pick()
        cur.execute("UPDATE users SET bricks = bricks - %s WHERE id = %s", (SPIN_COST, uid))
        cur.execute("INSERT INTO spins (user_id, prize, cost) VALUES (%s, %s, %s)", (uid, prize['label'], SPIN_COST))
        conn.commit()
        cur.execute("SELECT bricks FROM users WHERE id = %s", (uid,))
        new_bricks = cur.fetchone()[0]
        conn.close()
        return resp(200, {'prize': prize, 'bricks': new_bricks})

    return resp(404, {'error': 'Not found'})