````markdown
# 🏠 BuyerTwin AI — Real Estate Decision Copilot

**BuyerTwin AI** is an end-to-end AI decision copilot that turns buyer profiles and behavioral signals into **lead prioritization, property recommendations, and personalized agent outreach**.

The platform helps real estate agents better understand buyer intent, identify serious leads, recommend relevant listings, and decide what action to take next.

---

## 🎯 Problem

Traditional CRM systems are effective at storing buyer information, but they do not always help agents understand:

- What a buyer actually cares about
- How actively a buyer is searching
- Which buyers should be prioritized
- Which listings best match a buyer's preferences
- What type of follow-up may be most relevant

Agents may therefore spend significant time reviewing leads manually, sending generic follow-ups, or overlooking high-intent buyers in busy pipelines.

---

## 💡 Solution

BuyerTwin AI combines:

- Buyer profile information
- Behavioral signals such as searches, clicks, saves, and inquiries
- ML-based scoring and ranking
- Property recommendation logic
- AI-generated summaries and outreach

These components are brought together into a workflow designed to help agents turn existing buyer data into more actionable insights.

---

## ✨ Key Features

- BuyerTwin profile generation
- Buyer scoring and prioritization
- Buyer readiness estimation
- Listing recommendation and ranking
- Personalized outreach generation
- Agent-focused workflow views
- Next-best-action support

---

## 🔄 How It Works

```text
Buyer Profile + Behavioral Signals
                │
                ▼
       BuyerTwin Generation
                │
                ▼
     Buyer Intent / Readiness
             Analysis
                │
                ▼
       ML-Based Scoring
          and Ranking
                │
        ┌───────┴───────┐
        ▼               ▼
Buyer Prioritization   Listing Matching
        │               │
        └───────┬───────┘
                ▼
      AI-Assisted Outreach
                │
                ▼
      Next-Best-Action View
```

At a high level:

1. Buyer profile data and activity signals are collected.
2. A BuyerTwin represents the buyer's preferences, behavior, and intent.
3. Buyer and listing information is processed through scoring and ranking logic.
4. Relevant listings and buyer priorities are surfaced.
5. AI-assisted summaries and personalized outreach are generated.
6. Agents use the resulting insights to decide what action to take next.

---

## 🏗️ Architecture

BuyerTwin AI is organized into three primary layers.

### Frontend

The frontend provides the user-facing experience for agents, including buyer information, workflow views, and recommendation screens.

**Technologies:**
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

The backend manages API orchestration, routing, persistence, and structured data flow between the application components.

**Technologies:**
- Python
- FastAPI
- PostgreSQL
- REST APIs

### AI / ML Layer

The AI and ML components support buyer scoring, ranking, recommendations, and personalized communication generation.

**Technologies:**
- XGBoost
- Python
- Groq API

---

## ⚙️ Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, HTML, CSS |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Machine Learning | XGBoost |
| AI Integration | Groq API |
| API Architecture | REST APIs |
| Development | Git, GitHub |

---

## 📁 Repository Structure

```text
BuyerTwin/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   ├── db/
│   ├── model/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── requirements.txt
│
└── README.md
```

---

## 👤 Example Use Case

Consider a real estate agent managing a large number of buyer leads.

Two buyers may have similar profile information, but their behavior can be very different.

One buyer may:

- Search frequently
- Save multiple properties
- Revisit listings
- Submit inquiries

Another may have similar stated preferences but very little recent activity.

BuyerTwin AI combines profile information with behavioral signals so the agent can better understand which buyer may require attention and which properties may be relevant.

The system can then support the agent with ranked insights and personalized outreach rather than requiring the entire process to be handled manually.

---

## 🔁 Core Workflow

```text
Agent
  │
  ▼
Buyer Information
  │
  ▼
Buyer Activity Analysis
  │
  ▼
BuyerTwin
  │
  ▼
Scoring & Ranking
  │
  ├──────────────► Buyer Prioritization
  │
  └──────────────► Property Recommendations
                         │
                         ▼
                 AI-Assisted Outreach
                         │
                         ▼
                  Agent Decision
```

A typical workflow is:

1. Agent accesses buyer information.
2. Buyer activity is analyzed.
3. BuyerTwin is generated.
4. Buyers are scored and prioritized.
5. Listings are ranked based on fit.
6. Personalized outreach is generated.
7. The agent receives information that can support the next action.

---

## 📈 Business Value

BuyerTwin AI explores how existing buyer data can be used more effectively instead of relying only on additional lead acquisition.

### Customer Pain

Real estate agents may experience:

- Time spent reviewing low-intent leads
- Generic follow-up communication
- Difficulty prioritizing large buyer pipelines
- High-intent buyers being overlooked
- Manual effort matching buyers with listings

### Value Created

BuyerTwin AI is designed to support:

- Better lead prioritization
- Faster identification of relevant buyers
- More relevant property recommendations
- More personalized communication
- More efficient use of existing lead data

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Narahari917/BuyerTwin.git
cd BuyerTwin
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Backend Setup

From the project root:

```bash
cd backend
python -m venv venv
```

Activate the environment.

**macOS / Linux:**

```bash
source venv/bin/activate
```

**Windows:**

```bash
venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI application using the project's configured entry point.

---

## 🔐 Environment Variables

Create a local `.env` file inside the backend directory and configure the required environment variables.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/buyertwin
GROQ_API_KEY=your_groq_api_key
```

> Never commit real API keys, passwords, database credentials, or `.env` files to the repository.

---

## 🔒 Security Notes

Environment-specific credentials should be stored locally using environment variables rather than hard-coded into application source files.

Before deploying the application in a production environment, additional safeguards should be considered, including:

- Authentication and authorization
- Secure secrets management
- Database access controls
- Input validation
- API rate limiting
- Logging and monitoring
- Secure handling of user information

---

## 🧠 Design Approach

BuyerTwin AI follows a simple idea:

```text
Observe → Understand → Rank → Recommend → Assist
```

### Observe

Collect buyer profile information and available behavioral signals.

### Understand

Represent buyer preferences, activity, and intent through the BuyerTwin workflow.

### Rank

Use scoring and ML-based logic to prioritize buyers and relevant listings.

### Recommend

Surface property matches based on the available buyer information.

### Assist

Generate personalized outreach and information that can help the agent decide what to do next.

The system is designed as a decision-support tool rather than a replacement for the agent's judgment.

---

## ⚠️ Project Scope

BuyerTwin AI was developed as a **hackathon prototype** to explore how AI, machine learning, behavioral data, and full-stack application development can support real estate agents.

It should therefore be viewed as a prototype rather than a production real estate CRM or automated decision-making system.

---

## 🔮 Future Improvements

- Deeper CRM integrations
- Real-time behavioral event ingestion
- Improved recommendation explainability
- Buyer readiness tracking over time
- Brokerage and team-level analytics
- More advanced recommendation models
- Improved agent feedback loops
- Stronger authentication and authorization
- Production monitoring and observability
- Tighter integration with real estate platforms

---

## 👥 Team

- Narahari Kommi
- Ajay Bingi
- Anvitha Nagireddy

---

## 💬 Elevator Pitch

> **BuyerTwin AI turns buyer behavior into ranked insights, better property matches, and personalized agent outreach.**
````
