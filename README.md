# Ostrich Bakery Management System

A complete modern bakery management website/web app for Ostrich Bakery.

## Features

### Customer Features
- **View Products**: Browse bakery items by category.
- **Place Orders**: Order products for pickup or delivery.
- **Custom Cake Requests**: Submit requests for custom-designed cakes.
- **Catering Requests**: Bulk orders for events.
- **Daily Specials**: View fresh bread schedules and special deals.
- **Contact**: Location, hours, and WhatsApp integration.

### Admin Features
- **Dashboard**: Overview of total/pending orders and requests.
- **Product Management**: CRUD operations for bakery items.
- **Order Management**: Track and update order statuses.
- **Cake Request Management**: Manage custom cake workflows.
- **Catering Management**: Review event requests.
- **Specials Management**: Update daily deals.
- **Data Export**: Export orders and requests as CSV.

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: SQLite (better-sqlite3).

## Setup & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

3. **Admin Access**:
   - Route: `/admin`
   - Password: `milan000000`

## Deployment

### GitHub
1. Create a new repository on GitHub.
2. Push the code:
   ```bash
   git init
   ```

### Vercel
1. Connect your GitHub repository to Vercel.
2. Set the **Build Command** to `npm run build`.
3. Set the **Output Directory** to `dist`.
4. Add any necessary environment variables.
   *Note: For SQLite persistence on Vercel, consider using a hosted database like Supabase or PlanetScale, as Vercel's filesystem is ephemeral.*

### Environment Variables
- `GEMINI_API_KEY`: (Optional) If AI features are added.
- `APP_URL`: The base URL of the application.
