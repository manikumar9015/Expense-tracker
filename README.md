
# Expense Tracker Application

A full-stack expense tracking system built with **FastAPI** for the backend and **React (Vite)** for the frontend. 
This application allows users to manage personal finances by recording and categorizing transactions, and optionally supports financial insights using a downloadable NLP model.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Model Download](#model-download)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [License](#license)

---

## Overview

This project provides an integrated solution for managing income and expenses through a web-based interface. The backend API is developed using **FastAPI**, ensuring performance and scalability, while the frontend is built using **React** with **Vite** for fast development and build processes.

A pre-trained NLP model (`finreport-model`) for generating financial summaries was originally part of the repository but has been removed due to size constraints. Instructions are provided below to download and integrate this model manually.

---

## Features

- User authentication with JWT
- CRUD operations for transactions
- Categorization of income and expenses
- Modular backend structure (routers, services, models)
- Responsive UI built with React
- RESTful API with interactive documentation
- Optional integration with a downloadable financial NLP model

---

## Project Structure

```

finance\_tracker/
├── app/                           # FastAPI backend
│   ├── routers/                   # Route definitions
│   ├── auth.py                    # Authentication logic
│   ├── crud.py                    # Database operations
│   ├── database.py                # Database connection
│   ├── deps.py                    # Dependency injection
│   ├── main.py                    # Application entry point
│   ├── models.py                  # SQLAlchemy ORM models
│   ├── schemas.py                 # Pydantic request/response schemas
│   ├── utils.py                   # Utility functions
│   └── requirements.txt           # Backend dependencies
│
├── expense-tracker-frontend/      # React frontend
│   ├── public/                    # Static files
│   ├── src/                       # Source code for UI components
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite configuration
│   ├── package.json               # Frontend dependencies
│   └── package-lock.json          # Dependency lock file
│
└── README.md                      # Project documentation

```

---

## Model Download

The directory `app/finreport-model/` is excluded from the repository due to GitHub's file size limitations. This model is necessary if you intend to use the NLP-based financial report features.

### Download Instructions

- Access the model using the link below:

  🔗 [Download FinReport Model](https://drive.google.com/drive/folders/1D0jMFjXZcYKPFukzP3gIb5rVNddZDDgh?usp=sharing)

- After downloading, place the folder directly under the `app/` directory:

```

finance\_tracker/
└── app/
└── finreport-model/          # Place the extracted model here

````

---

## Backend Setup

### Prerequisites

- Python 3.9+
- pip
- (Optional) virtualenv

### Installation Steps

```bash
cd app
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
````

* Server will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Frontend Setup

### Prerequisites

* Node.js (v16 or later)
* npm (or yarn)

### Installation Steps

```bash
cd expense-tracker-frontend
npm install
npm run dev
```

* The frontend will be accessible at: [http://localhost:5173](http://localhost:5173)

---

## Environment Configuration

Backend settings can be managed via environment variables or a `.env` file (if supported in your setup).

Example `.env`:

```
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./expense.db
```

---

## API Documentation

FastAPI provides interactive API documentation via:

* Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

These endpoints allow testing of all exposed routes, including authentication and transaction operations.


