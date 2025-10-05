# Mini-Trello (Kanban) App 📋

A simplified, full-stack, Trello-like Kanban application built with the MERN stack. It features real-time collaboration, allowing users to manage boards, lists, and cards with a modern, responsive interface. [cite_start]The goal of this project is to build a simplified Trello-like Kanban application with real-time collaboration. [cite: 2]

---

## ✨ Features

* **User Authentication**: Secure user registration and login using JWT.
* **Board Management**: Create, view, and delete boards.
* **Real-time Collaboration**: Changes like card creation and movement are broadcast to all connected users on the same board in real-time using **WebSockets (Socket.IO)**.
* **Kanban Board**:
    * Create, delete, and manage lists (columns).
    * Create, delete, and manage cards (tasks).
    * **Drag-and-Drop**: Smoothly reorder cards within a list or move them between lists.
* **Responsive UI**: A clean and modern user interface built with **Tailwind CSS**.

---

## 🛠️ Tech Stack

This project is a monorepo containing a separate frontend and backend.

* **Backend**:
    * **Node.js**: JavaScript runtime environment.
    * **Express**: Web framework for building the REST API.
    * **MongoDB**: NoSQL database for storing application data.
    * **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
    * **Socket.IO**: For real-time, bidirectional event-based communication.
    * **JSON Web Token (JWT)**: For securing API endpoints.

* **Frontend**:
    * **React**: JavaScript library for building user interfaces.
    * **Vite**: Next-generation frontend tooling for a fast development experience.
    * **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
    * **@hello-pangea/dnd**: A maintained fork of `react-beautiful-dnd` for drag-and-drop functionality.
    * **Axios**: For making HTTP requests to the backend API.
    * **React Router**: For client-side routing.
    * **Socket.IO Client**: To connect to the real-time server.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas account)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd mini-trello
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

### Environment Variables

You need to create a `.env` file in both the `server` and `client` directories.

1.  **Backend `.env` file:**
    Create a file named `.env` in the `server` directory (`/server/.env`) and add the following, replacing the placeholders:

    ```env
    PORT=5001
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=yourrandomjwtsecretkey
    ```

2.  **Frontend `.env` file:**
    Vite requires environment variables to be prefixed with `VITE_`. Create a file named `.env` in the `client` directory (`/client/.env`) and add the following:

    ```env
    VITE_API_URL=http://localhost:5001
    ```

### Running the Application

You will need two separate terminal windows to run both the backend and frontend servers concurrently.

1.  **Run the Backend Server:**
    * In your first terminal, navigate to the `server` directory:
        ```bash
        cd server
        npm start
        ```
    * The server should be running on `http://localhost:5001`.

2.  **Run the Frontend Development Server:**
    * In your second terminal, navigate to the `client` directory:
        ```bash
        cd client
        npm run dev
        ```
    * The frontend application should be accessible at `http://localhost:5173`.

---

## 📝 API Endpoints

A brief overview of the core API routes. All routes except `/api/users/login` and `/api/users/register` are protected.

| Method | Endpoint              | Description                                        |
| :----- | :-------------------- | :------------------------------------------------- |
| `POST` | `/api/users/register` | Register a new user.                               |
| `POST` | `/api/users/login`    | Log in a user and get a token.                     |
| `GET`  | `/api/users/profile`  | Get the profile of the logged-in user.             |
| `POST` | `/api/boards`         | Create a new board.                                |
| `GET`  | `/api/boards`         | Get all boards for the logged-in user.             |
| `GET`  | `/api/boards/:id`     | Get a single board with its lists and cards.       |
| `DELETE`| `/api/boards/:id`     | Delete a board and all its contents.               |
| `POST` | `/api/lists`          | Create a new list on a board.                      |
| `DELETE`| `/api/lists/:id`      | Delete a list and all its cards.                   |
| `POST` | `/api/cards`          | Create a new card in a list.                       |
| `PUT`  | `/api/cards/move`     | Move a card within or between lists.               |
| `DELETE`| `/api/cards/:id`      | Delete a card.                                     |
