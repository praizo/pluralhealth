
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)



# Plural Health Coding Assessment

This project is a coding assessment submission for Plural Health. It is a web application for managing patients and appointments, built with Next.js and MongoDB.


Figma: https://www.figma.com/design/Xe1TTzEPwbL4oEcbwv3ZYp/Plural-s-Test-File?node-id=2-4215&t=lGeBL3bEOets1gA2-0


## Overview

The application allows users to:
-   View a dashboard of upcoming appointments.
-   Create new appointments.
-   Register new patients.
-   Search for existing patients.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database**: MongoDB
-   **Forms**: Formik + Yup
-   **State Management**: TanStack Query
-   **Testing**: Jest

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   MongoDB

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd plural-health
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file:
    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/plural-health
    ```

4.  **Seed Database**
    ```bash
    npx tsx scripts/seed.ts
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Testing

Run the unit tests for services and models:

```bash
npm test
```
