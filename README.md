# HR Team Management System

A modern HR management system built with React, Vite, and Supabase. The system includes features for employee attendance tracking and management.

## Features

- Employee attendance tracking
- Clock in/out functionality
- Admin dashboard with employee management
- Real-time updates using Supabase
- Responsive design with modern UI

## Tech Stack

- React 18
- Vite
- Supabase
- TailwindCSS
- Framer Motion
- React Router DOM
- Date-fns
- Lucide React Icons

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account and project

## Setup & Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hr-team
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Build for production:
```bash
npm run build
# or
yarn build
```

## Deployment

This project is configured for deployment on Render. Follow these steps to deploy:

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Use the following settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
   - Environment Variables: Add your Supabase credentials

## Environment Variables

Make sure to set these environment variables in your Render dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## License

MIT License 