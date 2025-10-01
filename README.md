# EcoVibe Kenya — LPG Cylinder Tracking & Safety Assistant

**Overview**
EcoVibe Kenya is a prototype web application for tracking LPG cylinders, visualizing major LPG locations across Kenya, scanning QR/barcodes with the device camera, and interacting with an AI Safety Assistant (ChatGPT-style).

**Features**
- OpenStreetMap (Leaflet) visualization of Kenya + major LPG markers
- Simulated LPG cylinder inventory & distributor data
- QR & barcode scanner (html5-qrcode) that uses your camera
- ChatGPT-style AI assistant connected to an AI backend (OpenRouter by default)
- Dashboard KPIs and distribution chart (Chart.js)
- Dark / Light mode toggle (persisted in localStorage)
- Full frontend (index.html, style.css, script.js) and small Node backend (server.js)

---

## Getting started (local development with VS Code)

### Prerequisites
- Node.js (>=16)
- npm

### Install
1. Clone your repo / copy files into a project folder:


2. Copy `.env.example` to `.env` and fill your API key:


- By default the server uses **OpenRouter**. If you prefer OpenAI, set:
  ```
  AI_PROVIDER=openai
  OPENAI_API_KEY=your_openai_key
  OPENAI_MODEL=gpt-3.5-turbo
  ```

3. Install dependencies:

4. Start the server:


5. Open your browser to `http://localhost:3000`

---

## Notes & tips
- The QR scanner requires camera permissions. If using a laptop, choose the correct camera in browser prompts.
- The AI assistant sends chat messages to `/api/chat`. The backend proxies to OpenRouter/OpenAI — be mindful of token usage and quotas.
- Do **not** commit your `.env` or API keys to version control.
- Map tiles are from OpenStreetMap — usage is free for development. For heavy production usage, consider tile caching or a commercial provider.

---

## What’s next (suggestions)
1. Add authentication + role-based UI (admin/distributor/consumer).
2. Persist data in a database (MongoDB/Postgres).
3. Connect real IoT telemetry for cylinders (MQTT / HTTP).
4. Add PDF or CSV export for reports.
5. Containerize with Docker for deployment.

---

## License
MIT — feel free to use and modify for your hackathon project.

# EcoVibe
