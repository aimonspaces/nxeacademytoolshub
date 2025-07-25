# NXE Academy Tools Hub

A modern GitHub alternative for developers to share scripts and explore NXE Academy's innovative tools.

## Overview

NXE Academy Tools Hub is a developer-focused platform where coders can create accounts, share scripts, and explore the exclusive NXE Academy All Tools collection. Designed as a modern alternative to GitHub, this platform emphasizes collaboration, script sharing, and highlighting NXE Academy's innovative tools.

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB (via MongoDB Atlas for Render compatibility)
- **Frontend**: React with Tailwind CSS for styling
- **Authentication**: JSON Web Tokens (JWT) for secure user management
- **Hosting**: Render for deployment, with environment variables for configuration
- **SEO**: Meta tags, sitemaps, and clean URLs for search engine visibility

## Project Structure

```
nxe-tools-hub/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ScriptCard.js
│   │   │   ├── NXEAcademyTools.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── ScriptSubmit.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── public/
│   │   ├── index.html
│   ├── package.json
├── server/                      # Node.js/Express backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Script.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── scripts.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   ├── server.js
│   ├── package.json
├── .env                         # Environment variables
├── render.yaml                  # Render deployment configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Run the development servers

## Features

- User authentication and authorization
- Script submission and sharing
- NXE Academy Tools showcase
- Responsive design for all devices
- Search and discovery functionality

## Deployment

This project is configured for deployment on Render using the `render.yaml` configuration file.#   n x e a c a d e m y t o o l s h u b  
 