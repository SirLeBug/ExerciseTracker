## Overview

This is a simple Exercise Tracker API built with Node.js, Express, and MongoDB using Mongoose. It allows users to create accounts, log exercises with descriptions, durations, and dates, and retrieve exercise logs filtered by date range and limit.

Users can POST new users, add exercises linked to users, and GET detailed exercise logs with optional query parameters to filter the results.

---

## About

This project is part of the [freeCodeCamp](https://www.freecodecamp.org/) Backend Development and APIs curriculum. It helped me practice building RESTful APIs, working with MongoDB and Mongoose, handling POST and GET requests, and filtering data with query parameters.

---

## Usage

- **POST** `/api/users` — Create a new user by submitting a username as form data.  
  Returns the created user object with a unique `_id`.

- **GET** `/api/users` — Retrieve a list of all users with their usernames and `_id`s.

- **POST** `/api/users/:_id/exercises` — Add an exercise for a user identified by `_id`.  
  Requires form data: `description` (string), `duration` (number), and optionally `date` (YYYY-MM-DD).  
  Returns the user object with the exercise data added.

- **GET** `/api/users/:_id/logs` — Retrieve a user’s exercise log.  
  Optional query parameters:  
  - `from` — Date string (YYYY-MM-DD) to filter exercises from this date (inclusive).  
  - `to` — Date string (YYYY-MM-DD) to filter exercises up to this date (inclusive).  
  - `limit` — Number to limit how many exercise entries are returned.  
  Returns the user object with a count of exercises and an array of exercise logs.

---

## Examples

- **POST** `/api/users` with body `username=alice`  
  Returns:  
  `{ "username": "alice", "_id": "6123abcde456f7890gh12ijk" }`

- **POST** `/api/users/6123abcde456f7890gh12ijk/exercises` with body `description=Running&duration=30&date=2023-01-01`  
  Returns:  
  `{ "_id": "6123abcde456f7890gh12ijk", "username": "alice", "date": "Sun Jan 01 2023", "duration": 30, "description": "Running" }`

- **GET** `/api/users/6123abcde456f7890gh12ijk/logs`  
  Returns:  
  ```json
  {
    "_id": "6123abcde456f7890gh12ijk",
    "username": "alice",
    "count": 2,
    "log": [
      { "description": "Running", "duration": 30, "date": "Sun Jan 01 2023" },
      { "description": "Cycling", "duration": 45, "date": "Tue Jan 03 2023" }
    ]
  }