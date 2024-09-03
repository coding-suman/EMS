# EMS
Employee Management System

# Employee Management System (EMS) Frontend

This repository contains the frontend application for the Employee Management System (EMS). The application is built using **React** with **Redux Toolkit** for state management, **Chakra UI** for component styling, and **Axios** for API requests. It provides features for employees to manage their attendance and profile, and allows admins to oversee attendance records and employee details.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow these instructions to set up and run the frontend application on your local machine.

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** (v6 or later) or **yarn** (v1.22 or later)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/coding-suman/EMS.git
   cd EMS
2. **Install dependencies:**

    Using npm:
    ```bash
    npm install
    
    or
    
    yarn install
3. **Running the Application**

    To start the application locally, use the following command:

    ```bash
    npm start

    or

    yarn start
The application will be accessible at `http://localhost:3000`.

## Features

### Employee Dashboard:
- View and update personal profile.
- Check-in, pause, resume, and check-out of shifts.
- View attendance history filtered by the current and past months.

### Admin Dashboard:
- View and manage all employee attendance records.
- Filter attendance by employee and month.
- Export attendance records to CSV.
- Edit attendance records as necessary.


### Project Structure

    EMS/
    ├── public/                     # Public files like index.html
    ├── src/
    │   ├── components/             # Reusable UI components
    │   ├── pages/                  # Pages and Views (e.g., Login, Dashboard)
    │   ├── redux/                  # Redux Toolkit slices and store
    │   ├── styles/                 # Global styles and theming
    │   ├── utils/                  # Utility functions and Axios configuration
    │   ├── App.js                  # Main application component
    │   ├── index.js                # Entry point for React
    │   └── context/                # Context providers for auth and other global state
    ├── .env                        # Environment variables (e.g., API URL)
    ├── package.json                # Project metadata and dependencies
    └── README.md                   # Project documentation

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Redux Toolkit**: A standardized way to write Redux logic, optimized for speed.
- **Chakra UI**: A modular and accessible component library for React applications.
- **Axios**: A promise-based HTTP client for the browser and Node.js.
- **React Hook Form**: A performant and easy-to-use library for managing forms in React.
- **Yup**: A schema builder for value parsing and validation.
- **React Router**: A collection of navigational components for React.

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository.
2. **Create** a new branch with a descriptive name.
3. **Commit** your changes with clear messages.
4. **Push** your changes to your fork.
5. **Create a Pull Request** explaining your changes.
