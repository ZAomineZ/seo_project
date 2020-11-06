# Machinools (Outil gratuit pour vérifier votre référencement)
Dépôt du projet de référencement réalisé avec ***ReactJs et PhP***.

# A propos
- L'objectif du tool au départ de sa création était de faire plusieurs petits outils centralisés dans un seul.
- Avec la contrainte de dépenser le moins possible dans des services tiers.
- La cible était les débutants désirant d'avoir un outil gratuit qui propose un début de réponse aux vérifications de certains facteurs SEO.
- La quasi-totalité de la data est traitée en JSON (C'est un choix).

# Démo

[Source](https://www.youtube.com/watch?v=QaDk8NgGu-U)

## Prérequis
- NodeJs, Mysql, PhP, Puppeteer
- Avoir un compte [scraperapi](https://www.scraperapi.com/) gratuit ou payant
- Avoir un compte [Seranking](https://seranking.com/) (Abonnement Plus 1000 minimum)

![A screenshot of Machinools](https://i.imgur.com/VRp917I.png)

## Liste des fonctionnalités
### Analyse de mots clés
- Serp Dashboard (Voir le classement du Top 100 sur un mot clé)
- RankTo (suivi de positionnement journalier)
- Suggest (simple suggestion de termes basée sur un mot clé)
- Top Keyword By Domains (connaitre les mots-clés positionnés sur un domaine)

### Analyse de domaine
- WebSite Analyse (Analyser un domaine avec quelques métriques pour évaluer la puissance)
- Link Profile (Vérification rapide de la puissance d'un domaine)
- Campaign (surveiller les liens reçus ou achetés avec vérification indexation Google)

### Correlation
L'outil correlation permet de trouver sur le TOP 10 des sites d'un mot clé des facteurs SEO que l'on retrouve le plus via un pourcentage et un graph.

### Notes
- Quelques parties de l'outil ne fonctionne plus totalement. La récupération du profil de lien par Semrush ne marche plus à remplacer.
- Idée : la possibilité de remplacer par (https://github.com/drogbadvc/free-backlink-data)

### Details
#### Serp Dashboard
- Outil dépendant de ***ScraperApi***
- Il propose un historique du classement d'un mot clé via un ***datepicker***
- Graphique des variations de positions sur le Top10.
- Affichage des SERP feature.
- Volume par domaine calculé par rapport au volume du mot clés et CPC.

![A screenshot of Machinools](https://i.imgur.com/Aq9YNkd.jpg)

#### RankTo
- Outil de suivi de mot clé par projet. Dépendant de ***ScraperApi***
- Suivi de la position de mot clés avec graph d'historique.
- Filtre par volume et meilleure progression.

![A screenshot of Machinools](https://i.imgur.com/gevt5n9.png)
![A screenshot of Machinools](https://i.imgur.com/us5EaaN.png)

#### Suggest
- Outil qui récupère les suggest de Google avec les questions, et les suffixes alphabet.
- Possibilité de barrer les mots clés pas utile et exportation de la liste en Csv.

![A screenshot of Machinools](https://i.imgur.com/7UZpopf.png)

#### Top Keyword By Domains

- Outil permettant de voir le nombre de mots-clés positionnés dans Google.
- Graphique pour voir le nb de keyword en Top 1, 10 ...
- Liste des mots-clés présent dans Google Search avec filtre par position, volume ...
- Comparaison de mots-clés et traffic sur plusieurs domaines.

![A screenshot of Machinools](https://i.imgur.com/Jay3AcW.png)
![A screenshot of Machinools](https://i.imgur.com/C8nzMLb.png)
![A screenshot of Machinools](https://i.imgur.com/i86uuC4.png)

#### WebSite Analyse

- Outil pour analyser le profile de liens, ancres...
- Analyse de la catégorisation du domaine.
- Courbe du trafic du domaine.

![A screenshot of Machinools](https://i.imgur.com/VtrOEIS.jpg)

#### Campaign

- L'outil campaign permet de suivre ses campagnes de liens. Ajouter un site, les liens reçus.
- Vérification de l'indexation du lien
- Vérification follow du lien.
- Graphique de suivi des dépenses de campagnes de liens.

![A screenshot of Machinools](https://i.imgur.com/Tcv3KpJ.png)

#### Correlation Analyse

- L'outil permet de voir les correlations du TOP 10 sur un mot clé sur différents facteurs.
- Via un pourcentage, il y a un calcul pour chaque facteur pour voir lequel revient le plus. Exemple, si tous les domaines du TOP 10 a du HTTPS alors c'est du 100%.
- Via un graph on peut voir le placement du TOP 10 avec une bulle qui prend la taille de la data.

![A screenshot of Machinools](https://i.imgur.com/3Z68CBD.png)

### Dépendance

Outils | Dépendance 
------|------------
Serp Dashboard | ScraperApi
RankTo | ScraperApi
Suggest | Google
Top Keyword By Domains | Seranking
WebSite Analyse | Semrush (Off) , Majestic
Link Profile | Semrush (Off), Majestic
Campaign | ScraperApi
Correlation Analyse | ScraperApi
