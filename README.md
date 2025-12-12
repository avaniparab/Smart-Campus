# Smart Campus Admin

A comprehensive campus management system built with React, TypeScript, Supabase, and Tailwind CSS.

## Features

### User Management
- Role-based access control (Admin, Staff, Security, Student)
- User profiles with department and contact information
- Secure authentication system with Supabase Auth

### Campus Management
- Building management with floor plans and locations
- Facility tracking (labs, libraries, cafeterias, gyms)
- Room allocation and monitoring
- Asset management and tracking

### Emergency Management
- Real-time emergency reporting and tracking
- Severity levels (Critical, High, Medium, Low)
- Emergency response team coordination
- Incident report management

### Communication Center
- Campus-wide broadcast system
- Priority-based notifications
- Multiple communication types (announcements, emergencies, events, maintenance)
- Targeted messaging to specific user roles

### Analytics & Reports
- User growth metrics
- Building utilization statistics
- Emergency response trends
- Real-time campus activity monitoring

### Settings & Configuration
- Security settings and access control
- Notification preferences
- Data backup and retention
- System customization

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   The `.env` file already contains your Supabase credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Database Schema

The application uses the following main tables:

- **profiles** - User profiles with roles and information
- **buildings** - Campus buildings with locations
- **facilities** - Facilities within buildings
- **rooms** - Individual rooms
- **assets** - Campus assets and equipment
- **emergencies** - Emergency incidents
- **incident_reports** - Detailed incident documentation
- **response_teams** - Emergency response teams
- **team_members** - Team member assignments
- **notifications** - User notifications
- **broadcasts** - Campus-wide communications
- **audit_logs** - System audit trail

## Security

- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- JWT-based authentication
- Secure password handling
- Audit logging for all critical operations

## Default Roles

1. **Admin**: Full system access, user management, system settings
2. **Staff**: Campus and facility management, reports
3. **Security**: Emergency management, incident reporting
4. **Student**: Limited read access to public information

## Usage

1. **Create an Account**: Navigate to `/register` and create a new account
2. **Login**: Use your credentials to log in at `/login`
3. **Dashboard**: View campus overview and recent activity
4. **Manage Users**: (Admin only) Add and manage campus users
5. **Campus Management**: Track buildings, facilities, and rooms
6. **Emergency Response**: Report and manage campus emergencies
7. **Communications**: Send campus-wide broadcasts and notifications
8. **Analytics**: View reports and insights

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── layout/       # Layout components (Sidebar, Layout)
│   └── ProtectedRoute.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── lib/             # Utilities and configurations
│   └── supabase.ts
├── pages/           # Application pages
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── Campus.tsx
│   ├── Emergency.tsx
│   ├── Communication.tsx
│   ├── Analytics.tsx
│   └── Settings.tsx
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Contributing

This is a production-ready campus management system. When contributing:

1. Follow the existing code style
2. Write meaningful commit messages
3. Test all features before submitting
4. Ensure RLS policies are properly configured
5. Document any new features

## License

MIT License
