# Utilise une image officielle Python comme image parent
FROM python:3.9-slim

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copie l'application Django dans le conteneur
COPY . /app/

# Expose le port sur lequel Django va tourner
EXPOSE 8000

# Commande pour démarrer l'application Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
