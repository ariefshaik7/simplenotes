# SimpleNotes: A Simple Note-Taking Application

**SimpleNotes** is a simple note-taking application. It provides a clean, two-pane interface for organizing notes, with a sidebar for listing notes and a main content area featuring a rich text editor. The application is built with a React frontend, a Flask (Python) backend, and a PostgreSQL database, with secure user authentication using JSON Web Tokens (JWT).

## Features

* **Secure User Authentication:** Users can register and log in to a private, secure account. Sessions are managed with JWT.
    
* **Private Note-Taking:** All notes are tied to the logged-in user, ensuring privacy.
    
* **Two-Pane Layout:** A familiar and intuitive interface with a list of notes on the left and a dedicated editor on the right.
    
* **Rich Text Editor:** Powered by the modern **Lexical** editor from Meta, allowing for formatted text (bold, italics, lists, etc.).
    
* **Full CRUD Functionality:** Users can Create, Read, Update, and Delete their notes.
    
* **Manual Save/Edit:** Users have full control over when to enter "edit" mode and save their changes.
    
* **RESTful API:** A robust backend API built with Flask handles all data operations and business logic.
    

---

## Tech Stack & Architecture

This application uses a classic three-tier architecture:

* **Presentation Tier (Frontend):**
    
    * [React.js](https://reactjs.org/)
        
    * [Lexical](https://lexical.dev/) Rich Text Editor
        
    * [React Router](https://reactrouter.com/) for page navigation.
        
    * [Axios](https://axios-http.com/) for API requests.
        
* **Application Tier (Backend):**
    
    * [Python 3](https://www.python.org/)
        
    * [Flask](https://flask.palletsprojects.com/) as the web framework.
        
    * [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) as the Object-Relational Mapper (ORM).
        
    * [Flask-Bcrypt](https://flask-bcrypt.readthedocs.io/) for password hashing.
        
    * [PyJWT](https://pyjwt.readthedocs.io/) for generating and validating JSON Web Tokens.
        
* **Data Tier (Database):**
    
    * [PostgreSQL](https://www.postgresql.org/)
        

```bash
+------------------+          +-----------------------+          +-----------------------+
|  React Frontend  |  <-----> |   Flask Backend API   |  <-----> | PostgreSQL Database   |
| (localhost:3000) |          |   (localhost:5001)    |          |                       |
+------------------+          +-----------------------+          +-----------------------+
```

---
## Running the Application
    
### Run via Docker 
    
    
    docker compose up --build




---

## Local Setup Instructions

Follow these steps carefully to get the application running on your local machine.

### Prerequisites

Make sure you have the following software installed on your system:

* [Git](https://git-scm.com/)
    
* [Node.js and npm](https://nodejs.org/en/download/) (v18 or higher recommended)
    
* [Python 3 and Pip](https://www.python.org/downloads/) (v3.8 or higher)
    
* [PostgreSQL Server](https://www.postgresql.org/download/)
    

### 1\. Clone the Repository


```bash
git clone https://github.com/your-username/simplenotes.git
cd simplenotes
```

### 2\. Database Setup

1. Make sure your PostgreSQL server is running.
    
2. Connect to PostgreSQL and create the database for this project.
    
    SQL
    
    ```bash
    -- Using the psql command-line tool
    CREATE DATABASE simplenotes;
    ```
    
    The `users` and `notes` tables will be created automatically by the backend server on its first run.
    

### 3\. Backend Setup

1. Navigate to the `backend` directory.
    
    
    
    ```bash
    cd backend
    ```
    
2. Create and activate a Python virtual environment.
    
    * **On macOS/Linux:**
        
        
        
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
        
    * **On Windows:**
        
        
        
        ```bash
        python -m venv venv
        .\venv\Scripts\activate
        ```
        
3. Install the required Python packages.
    
    
    
    ```bash
    pip install Flask Flask-SQLAlchemy psycopg2-binary Flask-Bcrypt PyJWT Flask-Cors
    ```
    
    *(Optional but recommended: create a* `requirements.txt` file for the project by running `pip freeze > requirements.txt`)
    
4. Configure Environment Variables
    
    This is the most important step. You must provide your database credentials to the application.
    
    * Open the `backend/app.py` file.
        
    * **Locate the configuration section** and replace the placeholder values for `SECRET_KEY` and `SQLALCHEMY_DATABASE_URI`.
        
    
    Python
    
    ```bash
    # File: backend/app.py
    
    # --- Configuration ---
    app.config['SECRET_KEY'] = 'a-very-secure-secret-key-that-you-must-change' # Replace with your own secret
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://your_username:your_password@localhost/simplenotes' # UPDATE THIS!
    ```
    
    For example, if your PostgreSQL username is postgres and your password is admin123, the line should be:
    
    app.config\['SQLALCHEMY\_DATABASE\_URI'\] = 'postgresql://postgres:admin123@localhost/simplenotes'
    

### 4\. Frontend Setup

1. Navigate to the `frontend` directory from the project root.
    
    
    
    ```bash
    cd ../frontend
    ```
    
2. Install all the required npm packages. This might take a few minutes.
    
    
    
    ```bash
    npm install
    ```
    

---

## Running the Application

To run the application, you need **two separate terminals**.

### Terminal 1: Start the Backend Server



```bash
# Navigate to the backend directory
cd simplenotes/backend

# Make sure your virtual environment is activated
source venv/bin/activate

# Run the Flask server
python app.py
```

Your backend API is now running and listening for requests on `http://localhost:5001`.

### Terminal 2: Start the Frontend Application



```bash
# Navigate to the frontend directory
cd simplenotes/frontend

# Run the React development server
npm start
```

This will automatically open your default web browser to `http://localhost:3000`. You can now register a new user, log in, and start using the application!

---

## API Endpoints

The backend server provides the following RESTful API endpoints. All `/api/notes` routes require a valid JWT to be sent in the `x-access-token` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/register` | Register a new user. |
| `POST` | `/api/login` | Log in a user and receive an authentication token. |
| `GET` | `/api/notes` | Get a summary list of all notes for the user. |
| `POST` | `/api/notes` | Create a new, blank note. |
| `GET` | `/api/notes/<int:id>` | Get the full content of a single note. |
| `PUT` | `/api/notes/<int:id>` | Update a note's title and/or content. |
| `DELETE` | `/api/notes/<int:id>` | Delete a note by its ID. |



---
![simplenotes](/assets/images/login.png)

---
![simplenotes](/assets/images/home.png)

---
![simplenotes](/assets/images/tasks.png)

---