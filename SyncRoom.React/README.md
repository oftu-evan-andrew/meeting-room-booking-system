# SyncRoom Frontend

React + TypeScript + Tailwind UI shell for the SyncRoom ASP.NET Core API.
No mock data. No fake API calls. Just the design.

## Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS + custom design tokens
- Framer Motion (animations)
- Radix UI (Dialog, Dropdown — accessible primitives)
- React Hook Form + Zod (form validation)
- React Router v6
- Redux Toolkit (store wired, slices are yours to add)
- lucide-react (icons)

## Setup
```bash
npm install
npm run dev
```

## How to wire up Redux

All page components accept plain props — no Redux inside them.
Open `src/pages/RouteContainers.tsx` and replace the placeholder
values with your selectors and dispatch calls.

### Example for RoomsRoute:
```ts
// Before (placeholder):
const rooms: RoomSummary[] = [];

// After (your Redux):
const rooms = useAppSelector(selectAllRooms);

// And dispatch on mount:
useEffect(() => { dispatch(fetchRoomsThunk()); }, []);
```

### Store
`src/store/index.ts` — add your slices here.

### Auth
`src/context/AuthContext.tsx` — call `setUser(user)` after your
login thunk resolves. Call `setUser(null)` on logout.

## File structure
```
src/
├── components/
│   ├── admin/         CreateRoomModal, EditRoomModal
│   ├── bookings/      BookingForm
│   ├── layout/        AppLayout, Navbar, ProtectedRoute
│   ├── rooms/         RoomCard, RoomImageGallery
│   └── ui/            Button, Input, Badge, Modal, ConfirmDialog, Skeleton, Avatar
├── context/           AuthContext
├── lib/               utils
├── pages/
│   ├── RouteContainers.tsx   ← wire Redux here
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── RoomsPage.tsx
│   ├── RoomDetailPage.tsx
│   └── AdminPage.tsx
├── store/             Redux store (add slices here)
└── types/             All TS interfaces matching your DTOs
```

## API endpoints (from your controllers)
| Method | Endpoint | Role |
|--------|----------|------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Cookie |
| POST | /api/auth/refresh | Cookie |
| GET | /api/room | Authenticated |
| GET | /api/room/:id | Authenticated |
| POST | /api/room/create | SuperAdmin |
| PUT | /api/room/:id | SuperAdmin |
| DELETE | /api/room/:id | SuperAdmin |
| POST | /api/booking/create | Authenticated |
| POST | /api/booking?Id=... | Authenticated |
