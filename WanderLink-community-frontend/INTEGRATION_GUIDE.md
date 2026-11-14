# WanderLink Community & Explore Integration Guide
**Author:** Person 3 (Community & Explore Developer)  
**Module:** Community & Explore Pages, Reusable Cards & API Integration  
**Date:** Hackathon Sprint  
**Brand Motto:** *Every Journey Starts With a Connection.*

---

## 1. Quick Overview for the Team

Person 3 is responsible for the complete Community & Explore experience for WanderLink. All components and pages are built with:
- **React.js & ES6+**
- **Tailwind CSS** with WanderLink brand palette (Deep Emerald `#065f46`, Warm Amber `#f59e0b`, Light neutral backgrounds)
- **Lucide React** icons
- **Axios** (using shared `src/services/api.js`)
- **Graceful Fallback System:** Seamless offline mock data for Goa, Manali, Kerala, and Jaipur if Person 1's backend is not yet started or during local testing.

---

## 2. Instructions for Person 2 (Main React App & Central Routing)

Person 2 owns `App.jsx`, `main.jsx`, `Navbar.jsx`, and central routing.

### Step 2.1: Add Page Imports to `App.jsx`
Add the following imports at the top of your `App.jsx`:

```javascript
// Community & Explore Pages (Person 3)
import Explore from './pages/community/Explore';
import Accommodation from './pages/community/Accommodation';
import FoodExperiences from './pages/community/FoodExperiences';
import LocalGuides from './pages/community/LocalGuides';
import TravelGroups from './pages/community/TravelGroups';
```
*(Note: We also provide aliases at `./pages/Explore`, `./pages/Accommodation`, etc., so both import styles work identically).*

---

### Step 2.2: Add Route Definitions
Place these `<Route>` tags inside your `<Routes>` tree (within `MainLayout`):

```jsx
{/* Community & Explore Routes (Person 3) */}
<Route path="/explore" element={<Explore />} />
<Route path="/accommodation" element={<Accommodation />} />
<Route path="/food" element={<FoodExperiences />} />
<Route path="/local-guides" element={<LocalGuides />} />
<Route path="/groups" element={<TravelGroups />} />
```

---

### Step 2.3: Add Community Links to `Navbar.jsx`
Add these links to your navigation bar:

| Label | Route | Icon Suggestion |
| :--- | :--- | :--- |
| **Explore** | `/explore` | `<Compass />` |
| **Accommodations** | `/accommodation` | `<Home />` |
| **Food Experiences** | `/food` | `<Utensils />` |
| **Local Guides** | `/local-guides` | `<Award />` |
| **Travel Tribes** | `/groups` | `<Users />` |

---

### Step 2.4: Using `BuddyCard.jsx` in `BuddyMatches.jsx`
Person 2 owns the `BuddyMatches` page and matching algorithm API calls. Use Person 3's reusable `BuddyCard` component directly:

```jsx
import BuddyCard from '../components/community/BuddyCard';

// Inside your BuddyMatches component:
<BuddyCard
  buddy={buddy}
  onConnect={(buddy) => {
    // Call Person 2's connectionService / send request
    console.log('Connect clicked for traveler:', buddy.name);
  }}
  isConnected={false}
/>
```

#### `BuddyCard` Prop Specification:
```typescript
interface BuddyCardProps {
  buddy: {
    id: number | string;
    name: string;
    avatar?: string;
    destination: string;
    dates?: string;
    travelStyle: string;     // e.g. "Backpacker", "Slow Travel", "Trekking"
    budget: string;          // e.g. "Budget Friendly", "Moderate", "Luxury"
    matchScore: number;      // e.g. 96 (displayed as 96% Match)
    interests: string[];     // e.g. ['Scuba', 'Cafes', 'Culture']
    bio?: string;
    verified?: boolean;
  };
  onConnect: (buddy: object) => void;
  isConnected?: boolean;
}
```

---

## 3. API Contract Coordination with Person 1 (Spring Boot Backend)

All frontend calls in `communityService.js` use the shared Axios instance from `src/services/api.js`.

### 1. Accommodations
- **Endpoint:** `GET /api/accommodations`
- **Optional Query Params:** `?destination=Goa`
- **Expected Response (JSON Array or Spring Pageable):**
```json
[
  {
    "id": 1,
    "propertyName": "Casa Da Palma Heritage Portuguese Villa",
    "hostName": "Maria Fernandez",
    "location": "Anjuna, Goa",
    "city": "Goa",
    "pricePerNight": 2400,
    "rating": 4.9,
    "reviewsCount": 38,
    "type": "Heritage Villa",
    "description": "Charming 18th-century restored Indo-Portuguese villa...",
    "imageUrl": "https://images.unsplash.com/...",
    "amenities": ["High-speed Wi-Fi", "Free Breakfast", "Air Conditioning"],
    "contactPhone": "+91 98221 45012"
  }
]
```

### 2. Local Food Experiences
- **Endpoint:** `GET /api/food`
- **Optional Query Params:** `?destination=Kerala`
- **Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Authentic Goan Seafood Thali & Prawn Balchão Feast",
    "cuisine": "Goan Coastal Seafood",
    "providerName": "Chef Maria & Auntie Rita",
    "location": "Candolim, Goa",
    "price": 650,
    "rating": 4.95,
    "reviewsCount": 78,
    "dietaryType": "Non-Veg",
    "mealType": "Dinner Experience",
    "description": "Savor freshly caught Kingfish rava fry...",
    "imageUrl": "https://images.unsplash.com/...",
    "includes": ["3-Course Seafood Meal", "Kokum Cooler", "Bebinca"]
  }
]
```

### 3. Travel Groups & Join
- **Fetch Groups:** `GET /api/groups`
- **Join Group:** `POST /api/groups/{id}/join`
- **Request Headers:** `Authorization: Bearer <jwt-token>` (auto-attached by `api.js`)
- **Join Response:**
```json
{
  "success": true,
  "message": "Successfully joined group!",
  "groupId": 1
}
```

### 4. Local Guides
- **Endpoint Status:** Not yet finalized in Person 1's schema.
- **Frontend State:** `communityService.getLocalGuides()` provides mock data for Goa, Manali, Kerala, and Jaipur with an API-ready contract. If Person 1 exposes `GET /api/guides`, `communityService.js` will automatically use it without code modifications!

---

## 4. Reusable Community Cards Summary

| Card | File Path | Key Props |
| :--- | :--- | :--- |
| **BuddyCard** | `src/components/community/BuddyCard.jsx` | `buddy`, `onConnect`, `isConnected` |
| **AccommodationCard** | `src/components/community/AccommodationCard.jsx` | `stay`, `onRequest` |
| **FoodCard** | `src/components/community/FoodCard.jsx` | `food`, `onRequest` |
| **GuideCard** | `src/components/community/GuideCard.jsx` | `guide`, `onContact` |
| **GroupCard** | `src/components/community/GroupCard.jsx` | `group`, `onJoin`, `isJoined` |
| **SectionHeading** | `src/components/community/SectionHeading.jsx` | `title`, `subtitle`, `badge`, `viewAllLink` |
| **EmptyState** | `src/components/community/EmptyState.jsx` | `title`, `description`, `icon`, `actionLabel`, `onAction` |
| **InquiryModal** | `src/components/community/InquiryModal.jsx` | `isOpen`, `onClose`, `item`, `type` |

---

## 5. Verification & Testing Checklist
- [x] All 5 cards accept data strictly via props.
- [x] Responsive layout tested for mobile, tablet, and desktop viewports.
- [x] Interactive modals on all "Contact" and "Book" actions.
- [x] Group joining calls backend, increments member count, and disables duplicate joins.
- [x] Filter and search functionality across destinations (Goa, Manali, Kerala, Jaipur).
- [x] Graceful fallback to mock data if Spring Boot backend is offline.
