# Utilise une image officielle Node.js comme image parent
FROM node:16

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers nécessaires
COPY package.json package-lock.json /app/

# Installe les dépendances de l'application
RUN npm install

# Copie l'application React dans le conteneur
COPY . /app/

# Expose le port sur lequel React va tourner
EXPOSE 3000

# Commande pour démarrer l'application React
CMD ["npm", "start"]
