# DeskPilot — IT Service Desk & Troubleshooting Simulator

**By Will Defontaine | Independent portfolio project | October 2026**

DeskPilot is a responsive, interactive **service desk simulation** that demonstrates the workflow an entry-level IT support analyst uses to receive, triage, troubleshoot, document, and resolve requests.

## What it does

- **Service desk overview:** count open, in-progress, resolved, and SLA-attention tickets.
- **Ticket queue:** search by name, subject, ID, and category; filter by workflow status and priority.
- **Ticket intake:** create a ticket with requestor, category, impact, urgency, and description.
- **Priority triage:** apply a visible impact × urgency matrix (P1–P4) and example SLA deadlines.
- **Ticket lifecycle:** progress a request, add time-stamped notes, require a resolution description, resolve, and reopen.
- **Runbooks:** six troubleshooting playbooks covering networks, access, hardware, software, collaboration, and managed mobile devices.
- **Insights:** examine issue mix and priority distribution.
- **CSV export:** export fictional tickets and activity history for analysis.
- **Persistence:** use browser `localStorage` so changes remain on that device until reset or storage is cleared.

## How to run it

1. Download the project ZIP and extract it.
2. Open **index.html** in any modern web browser. There is no installation step, login, or server required.
3. Select **Ticket queue** or **New ticket** to explore the workflow.

## Tech stack

- HTML5 / CSS3 / vanilla JavaScript
- Browser localStorage for local demo persistence
- Client-side event handling, state management, validation, search/filtering, export, accessible labels, and responsive design
