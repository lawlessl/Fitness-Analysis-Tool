# Fitness-Analysis-Tool

## Overview

The Activity Data Visualization Platform is a web application designed to help users analyze and visualize their fitness activity data. The platform allows users to upload their activity files, securely store the data, and explore various data visualizations to gain insights into their activities.

## Key Features

- **User Authentication**: Secure user authentication using Firebase Authentication. Users can sign in using their Google accounts.
- **File Upload**: Users can upload their activity files in `.fit` formats, `.gpx` (coming soon).
- **Data Parsing**: Uploaded files are parsed to extract relevant activity data.
- **Data Storage**: Parsed activity data is stored in Firebase Firestore for persistent storage.
- **Data Visualization**: Visualize activity data with custom D3.js charts and graphs.

## Technologies Used

- **Frontend**:

  - **React**: A JavaScript library for building user interfaces.
  - **TypeScript**: A statically typed superset of JavaScript.
  - **Firebase**: For authentication and real-time database.
  - **Libraries**: `axios`, `react-router-dom`, `leaflet`, and `fit-file-parser`.

- **Backend** (optional):
  - **Firebase Firestore**: For storing activity data.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v7 or higher)
