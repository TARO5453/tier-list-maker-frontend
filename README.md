# Tier List Maker – Frontend

A responsive React frontend for the Tier List Maker application.
This frontend handles authentication, template management, and interactive tier list creation, and communicates with a Spring Boot backend API.
The application is containerized using Docker and served via Nginx for production-ready deployment.

---

## Author

**Nathanon C.**
Computer Science Student

This project was built for learning purposes and to demonstrate frontend architecture, authentication flow, routing, and containerized deployment using React and Docker.

---


## Features

* User registration and login
* Protected routes for authenticated users
* Create tier list templates
* Browse public templates
* Create tier lists based on templates
* Client-side routing with React Router
* Production build served with Nginx
* Fully containerized using Docker

---

## Tech Stack

**Frontend**

* React (Create React App)
* React Router
* JavaScript
* Bootstrap CSS

**DevOps / Tooling**

* Docker 
* Nginx
* Node.js 
* npm

---

## Project Structure

```
.
├── Dockerfile
├── nginx.conf
├── package.json
├── package-lock.json
├── public
├── src
│   ├── components
│   │   ├── auth
│   │   │   └── ProtectedRoute.js
│   │   ├── layouts
│   │   │   └── Navigation.js
│   │   └── Tierlist
│   ├── contexts
│   │   └── AuthContext.js
│   ├── pages
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Templates.js
│   │   ├── PublicTemplates.js
│   │   ├── NewTemplate.js
│   │   └── CreateTierlist.js
│   ├── App.js
│   ├── index.js
│   ├── App.css
│   └── index.css
└── README.md
```

## Routing Overview
---

| Route | Description | Access |
| :---         |     :---:      |          ---: |
| /   | Home page     | Public    |
| /login     | Login page       | Public      |
| /register   | Registration page     | Public    |
| /templates     | User templates       | Protected      |
| /new-template   | Create template     | Protected    |
| /public-templates     | Browse public templates       | Protected      |
| /create-tierlist/:templateId   | Create tier list     | Protected    |

---

## Getting Started

### Prerequisites

* Docker
* Docker Compose

---

### Run with Docker

From the project root directory:

```bash
docker build -t tier-list-maker-frontend .
docker run -p 3000:80 tier-list-maker-frontend
```

### Run locally
```bash
npm install
npm start
```

The app will show up at http://localhost:3000 

---

## Notes

Notes

* This frontend is designed to work with a Spring Boot backend
* Nginx is used instead of the React dev server for production performance
* The frontend and backend are maintained in separate repositories for clarity and modularity

---

## Acknowledgements

AI tools were used as a learning and productivity aid during development 
(e.g., for clarifying concepts, debugging, and improving code structure).

---