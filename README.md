# Ledger — Mini CRM Lead Manager

A simple full-stack CRM for tracking leads — built with the MERN stack.

**🔗 Live demo:** [crm-lead-manager.vercel.app](https://crm-lead-manager.vercel.app)

## Features

- Sign up / log in with secure JWT authentication
- Add, search, and filter leads by status (new, contacted, converted)
- Per-user dashboard — your leads stay private to your account
- Lead analytics at a glance

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js + Express
- MongoDB (Mongoose) — hosted on MongoDB Atlas
- JWT authentication
- bcrypt password hashing

**Hosting**
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

## Project Structure

```
Crm_Lead_Manager/
├── backend/     Express REST API — auth + leads CRUD
└── frontend/    React SPA — login, dashboard, lead management
