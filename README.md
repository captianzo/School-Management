# School Management API

A REST API that lets you add schools to a database and retrieve them sorted by proximity to a given location using the Haversine formula. Deployed live on Railway.

---

## Live Endpoints

**Add a school**
```
POST https://school-management-production-b5ac.up.railway.app/api/addSchool
```

**List schools by proximity**
```
GET https://school-management-production-b5ac.up.railway.app/api/listSchools?latitude=21.1702&longitude=72.8311
```

---

## How It Works

Send a POST request with a school's name, address, latitude, and longitude to store it in the database. Send a GET request with your coordinates to retrieve all schools sorted by distance from your location - closest first.

Distance is calculated using the **Haversine formula**, which accounts for the curvature of the Earth and returns accurate distances in kilometres between two coordinate pairs.

All inputs are validated before hitting the database - coordinate ranges, type checks, and empty string guards are handled at the controller level.

---

## Project Structure

```
School-Management/
├── config/
│   └── db.js                     # MySQL connection pool
├── controllers/
│   ├── addSchoolController.js    # Input validation + DB insert
│   └── listSchoolsController.js  # Haversine sort + DB fetch
├── routes/
│   └── schoolRoutes.js           # Route definitions
├── index.js                      # Express entry point
└── README.md
```

`index.js` sets up the Express app and mounts all routes under `/api`.

`addSchoolController.js` validates all four required fields - name, address, latitude, longitude - with type checks and coordinate range enforcement before inserting into MySQL.

`listSchoolsController.js` fetches all schools, computes the Haversine distance from the user's coordinates to each school, and returns them sorted ascending by distance.

`db.js` creates a promise-based MySQL2 connection pool using environment variables.

---

## API Reference

### POST `/api/addSchool`

**Request body (JSON):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | School name |
| address | string | Yes | School address |
| latitude | number | Yes | Between -90 and 90 |
| longitude | number | Yes | Between -180 and 180 |

**Success response (201):**
```json
{
  "message": "School added successfully",
  "schoolId": 1
}
```

**Error responses:** `400` for validation failures, `500` for database errors.

---

### GET `/api/listSchools`

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | number | Yes | Your latitude |
| longitude | number | Yes | Your longitude |

**Success response (200):**
```json
{
  "message": "Schools fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Example School",
      "address": "123 Main St",
      "latitude": 21.17,
      "longitude": 72.83,
      "distance": 0.42
    }
  ]
}
```

Schools are sorted by `distance` in kilometres, ascending.

---

## Setup

### 1. Prerequisites

- Node.js 18+
- MySQL database
- Railway account (or any Node.js host)

### 2. Database Setup

Create a MySQL database and run:

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

### 3. Installation

```bash
git clone https://github.com/captianzo/school-management.git
cd school-management
npm install
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
```

### 5. Running the Server

```bash
npm start
```

---

## Technical Notes

- **Stack:** Node.js, Express.js, MySQL2
- **Deployment:** Railway (live and publicly accessible)
- **Distance algorithm:** Haversine formula - computes great-circle distance between two coordinate pairs in kilometres
- **Validation:** Coordinate range checks (-90/90 lat, -180/180 lon), type coercion guards, and empty string rejection at the controller level before any DB call
