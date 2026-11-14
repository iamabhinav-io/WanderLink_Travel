# WanderLink Backend Service

> **Every Journey Starts With a Connection.**  
> Spring Boot 3 REST API backend powering WanderLink travel buddy platform.

---

## 1. Technology Stack

- **Language:** Java 21
- **Framework:** Spring Boot 3.2.5
- **ORM / Persistence:** Spring Data JPA / Hibernate
- **Database:** MySQL 8 (with zero-config H2 profile available for local testing)
- **Validation:** Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`, etc.)
- **Security / Hashing:** BCrypt (`spring-security-crypto`)
- **Build Tool:** Apache Maven
- **Port:** `8080`
- **CORS Allowed Origin:** `http://localhost:5173` (React Vite frontend)

---

## 2. Quick Start Guide

### Step 1: Database Setup (MySQL)
Create a database named `wanderlink` in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS wanderlink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env` or set environment variables:
```bash
# Defaults in application.properties:
DB_URL=jdbc:mysql://localhost:3306/wanderlink?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Step 3: Run the Backend
From the `backend/` folder:

**Standard run (MySQL):**
```bash
mvn spring-boot:run
```

**Alternative Quick Local Testing Run (In-Memory H2 without needing MySQL running):**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

The server starts on `http://localhost:8080`.  
Predictable demo data will be automatically seeded on initial start (see Section 6).

---

## 3. REST API Contract (For Persons 2, 3, and 4)

All API responses follow a uniform format:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... },
  "timestamp": "2026-11-14T11:30:00"
}
```

### Summary of Endpoints

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **User** | `POST` | `/api/users/register` | Register traveler / host account |
| **User** | `GET` | `/api/users` | Retrieve all registered users |
| **User** | `GET` | `/api/users/{id}` | Get specific user profile |
| **User** | `PUT` | `/api/users/{id}` | Update profile details |
| **Trip** | `POST` | `/api/trips` | Create new travel itinerary |
| **Trip** | `GET` | `/api/trips` | Retrieve all trips |
| **Trip** | `GET` | `/api/trips/{id}` | Get specific trip by ID |
| **Trip** | `GET` | `/api/trips/user/{userId}` | Get all trips created by a user |
| **Matching** | `GET` | `/api/matches?tripId={id}` | Calculate & rank compatible travel buddies |
| **Connection** | `POST` | `/api/connections` | Send connection request |
| **Connection** | `GET` | `/api/connections/user/{userId}` | Get all connections for a user |
| **Connection** | `PUT` | `/api/connections/{id}/accept` | Accept connection request |
| **Connection** | `PUT` | `/api/connections/{id}/reject` | Reject connection request |
| **Accommodation**| `GET` | `/api/accommodations` | Retrieve all local stays |
| **Accommodation**| `POST` | `/api/accommodations` | Publish new accommodation listing |
| **Food** | `GET` | `/api/food` | Retrieve all homemade food experiences |
| **Food** | `POST` | `/api/food` | Publish new food experience listing |
| **Groups** | `GET` | `/api/groups` | Retrieve all travel groups |
| **Groups** | `POST` | `/api/groups` | Create a travel group |
| **Groups** | `POST` | `/api/groups/{id}/join` | Join group (prevents duplicates) |
| **AI Assistant** | `POST` | `/api/ai/assistant` | AI assistant contract endpoint (Person 4) |

---

## 4. Traveler Matching Algorithm (Core Differentiator)

Endpoint:  
`GET /api/matches?tripId=1`

### Weighted Formula:
$$\text{Score} = 0.30D + 0.25T + 0.20I + 0.15B + 0.10S$$

Where each component is normalized between `0` and `100`:

1. **Destination Compatibility ($D$ - 30%):**  
   - Normalized destination comparison. Matching destination = `100`, different = `0`.  
   - Candidates heading to different destinations are excluded.
2. **Travel Dates Compatibility ($T$ - 25%):**  
   - Calculates overlapping days relative to the shorter trip's duration.  
   - $\text{Overlap Days} = \max(0, \min(\text{end}_1, \text{end}_2) - \max(\text{start}_1, \text{start}_2) + 1)$  
   - $T = \frac{\text{Overlap Days}}{\min(\text{duration}_1, \text{duration}_2)} \times 100$
3. **Interests Similarity ($I$ - 20%):**  
   - Jaccard Similarity Index on comma-separated interest tags:  
   - $I = \frac{|\text{Interests}_1 \cap \text{Interests}_2|}{|\text{Interests}_1 \cup \text{Interests}_2|} \times 100$
4. **Budget Compatibility ($B$ - 15%):**  
   - Relative difference formula:  
   - $B = \max\left(0, 100 - \frac{|\text{budget}_1 - \text{budget}_2|}{\max(\text{budget}_1, \text{budget}_2)} \times 100\right)$
5. **Travel Style Compatibility ($S$ - 10%):**  
   - Same style = `100`, Different style = `50`.

*Note: The compatibility score strictly measures travel style, itinerary, and preference alignment. It is not an identity or safety verification score.*

---

## 5. Person 4 AI Assistant Integration Contract

Endpoint:  
`POST /api/ai/assistant`

### Request Body:
```json
{
  "message": "Plan a 3-day Goa trip"
}
```

### Response Payload:
```json
{
  "reply": "Here is your suggested Goa itinerary based on your preferences.",
  "destination": "Goa",
  "suggestions": [
    "Visit local beaches (Palolem and Morjim)",
    "Explore local Goan seafood and homemade vindaloo",
    "Join a travel group for North Goa sunset exploration"
  ]
}
```

---

## 6. Pre-seeded Demo Data

The database automatically initializes the following data on first startup:
- **6 Users:**
  1. `Aarav Sharma` (`aarav.sharma@example.com`) – Solo backpacker & photographer (Budget)
  2. `Priya Patel` (`priya.patel@example.com`) – High match buddy for Goa (Budget)
  3. `Rohan Gupta` (`rohan.gupta@example.com`) – Moderate match culture traveler (Moderate)
  4. `Ananya Iyer` (`ananya.iyer@example.com`) – Local homestay host (Luxury)
  5. `Vikram Singh` (`vikram.singh@example.com`) – Local food culinary provider (Adventure)
  6. `Neha Desai` (`neha.desai@example.com`) – Traveler heading to Manali
- **6 Trips:**
  - Trip 1: Aarav (Goa, 2026-12-20 to 2026-12-25, Budget ₹10,000)
  - Trip 2: Priya (Goa, 2026-12-21 to 2026-12-25, Budget ₹11,000) $\rightarrow$ Expected match ~92%+
  - Trip 3: Rohan (Goa, 2026-12-19 to 2026-12-24, Budget ₹18,000) $\rightarrow$ Expected match ~71%
  - Trip 4: Ananya (Goa, 2026-12-23 to 2026-12-28, Budget ₹35,000) $\rightarrow$ Expected match ~47%
  - Trip 5: Vikram (Goa, 2026-12-28 to 2027-01-02, Budget ₹12,000) $\rightarrow$ No date overlap
  - Trip 6: Neha (Manali, 2026-12-20 to 2026-12-25) $\rightarrow$ Filtered out from Goa matches
- **3 Accommodations:** Cozy Coconut Grove Villa, Backpacker Haven & Garden Studio, Cliffside Sunset Eco-Cottage
- **3 Homemade Food Experiences:** Traditional Goan Fish Thali, Bebinca & Portuguese Tea Tasting, Vegan Kokum Curry
- **3 Travel Groups:** Goa Sunset Explorers, Goan Foodie Hoppers, Dudhsagar Waterfall Trek

---

## 7. Postman Collection
Import `WanderLink_Postman_Collection.json` into Postman. It contains pre-configured requests with variables and sample payloads for all 21 API scenarios.
