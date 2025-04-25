# Étape de construction
FROM python:3.10-slim as builder

WORKDIR /app

# Installation des dépendances système
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Création de l'environnement virtuel
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Installation des dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Étape finale
FROM python:3.10-slim

WORKDIR /app

# Copie de l'environnement virtuel
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Utilisateur non-root
RUN useradd -m django && \
    chown django:django /app
USER django

# Copie de l'application
COPY --chown=django:django . .

# Configuration environnement
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Fichiers statiques
RUN python manage.py collectstatic --noinput --clear

EXPOSE 8000

# Script d'entrée
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

CMD ["/app/docker-entrypoint.sh"]
