# rate-it

## 1. System Prerequisites

### A. Install .NET 8.0 SDK

1. **Download the Installer:**
   - Go to the official [.NET 8 download page](https://dotnet.microsoft.com/en-us/download/dotnet/8.0).
   - Under “SDK,” select the Windows installer (typically the x64 version).

2. **Run the Installer:**
   - Execute the downloaded installer and follow the on-screen instructions.
   - After installation, open a Command Prompt or PowerShell and run:
     ```bash
     dotnet --version
     ```
     This should display the installed .NET version (e.g., `8.0.x`).

### B. Install Node.js (which includes npm)

1. **Download Node.js:**
   - Visit [https://nodejs.org](https://nodejs.org) and download the **LTS (Long Term Support)** version for Windows.

2. **Run the Installer:**
   - Run the Node.js installer and follow the prompts.
   - After installation, open a Command Prompt or PowerShell and verify by running:
     ```bash
     node --version
     npm --version
     ```
     Both commands should output version numbers.

### C. Install Git

1. **Download Git:**
   - Go to [https://git-scm.com/download/win](https://git-scm.com/download/win) and download the Git installer for Windows.

2. **Run the Installer:**
   - Follow the installer prompts.

---

## 2. Clone the Repository

   ```bash
   git clone https://github.com/Xinyu-bot/rate-it.git
   cd rate-it
   ```
   You should see two directories: `frontend` and `backend`.

---

## 3. Set Up the Backend (.NET 8.0 Web API)

On the first time (you might need to do this from an elevated Command Prompt/PowerShell):
```bash
cd backend
dotnet restore
dotnet dev-certs https --trust
dotnet run --launch-profile https
```

Otherwise:
```bash
cd backend
dotnet run --launch-profile https
```

---

## 4. Set Up the Frontend (React.js)
Start over a new terminal / split terminal in the project root:

On the first time:
```bash
cd frontend
npm install
npm start
```

Otherwise:
```bash
cd frontend
npm start
```

- Your default web browser should open at [http://localhost:3000](http://localhost:3000).

---

## 5. Working with the Projects

- **Backend API Testing:**
  - With the backend running, you can test it by visiting [https://localhost:7217/weatherforecast](https://localhost:7217/weatherforecast) in your browser. (You might have to bypass a security warning if using a self-signed certificate.)

- **Frontend-Backend Integration:**
  - The React application (running on port 3000) should be able to fetch data from the backend (configured via CORS to allow `http://localhost:3000`).

---