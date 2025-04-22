# Utilise une image officielle Node.js 18 comme image parent
FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package.json package-lock.json /app/

# Installe les dépendances avec un délai d'attente augmenté
RUN npm install --timeout=600000

# Copie le reste des fichiers de l'application
COPY . /app/

# Expose le port sur lequel l'application va tourner
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]