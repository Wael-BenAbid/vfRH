# Utilise une image officielle Python 3.10 comme image parent
FROM python:3.10-slim

# Définit le répertoire de travail
WORKDIR /app

# Installe les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpq-dev gcc && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Met à jour pip
RUN pip install --upgrade pip

# Copie les fichiers nécessaires
COPY requirements.txt /app/

# Installe les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie l'application Django dans le conteneur
COPY . /app/

# Définit STATIC_ROOT pour collecter les fichiers statiques
ENV STATIC_ROOT=/app/staticfiles

# Exécute la commande collectstatic pour gérer les fichiers statiques
RUN python manage.py collectstatic --noinput || echo "Collectstatic failed, continuing..."

# Expose le port sur lequel l'application va tourner
EXPOSE 8000

# Définit les variables d'environnement par défaut
ENV DJANGO_SETTINGS_MODULE=SystemeRH.settings
ENV PYTHONUNBUFFERED=1

# Commande pour démarrer l'application avec Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "SystemeRH.wsgi:application"]
