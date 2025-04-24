#!/bin/sh
set -e

if [ -n "$DATABASE_HOST" ]; then
  until nc -z $DATABASE_HOST $DATABASE_PORT; do
    echo "Waiting for database..."
    sleep 2
  done
fi

python manage.py migrate --noinput

exec gunicorn --bind 0.0.0.0:8000 --workers 3 SystemeRH.wsgi:application