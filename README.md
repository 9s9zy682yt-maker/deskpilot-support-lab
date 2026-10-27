# DeskPilot — IT Service Desk & Troubleshooting Simulator

**By Will Defontaine | Independent portfolio project | October 2026**

DeskPilot is a responsive, interactive **service desk simulation** that demonstrates the workflow an entry-level IT support analyst uses to receive, triage, troubleshoot, document, and resolve requests.

**Important:** This project contains only **fictional tickets, fictional employees, and generalized runbooks**. It is not a real ticketing system, does not connect to ServiceNow or any company network, and is not affiliated with Wellstar Health System. The project uses no patient information or employer internal data. All records exist only in the viewer's browser.

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

To serve via a local web server (optional):

```bash
python -m http.server 8000
```

Then open http://localhost:8000/ .

## How to publish as a website (GitHub Pages)

1. Create a new public GitHub repository named `deskpilot-support-lab`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root (include this README and screenshot if you wish).
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select **main**, folder **/(root)**, and save.
5. After GitHub confirms deployment, your site URL should follow the pattern `https://YOUR-USERNAME.github.io/deskpilot-support-lab/`. Replace `YOUR-USERNAME` with your actual GitHub handle; the URL is not live until you publish.
6. Add the published site link to your LinkedIn Projects section under **Add media → Add a link** and/or your Featured section.

## Tech stack

- HTML5 / CSS3 / vanilla JavaScript
- Browser localStorage for local demo persistence
- Client-side event handling, state management, validation, search/filtering, export, accessible labels, and responsive design
- Zero dependencies and no backend

## Suggested discussion for interviews

> "I built an independent IT service desk simulator to demonstrate the incident workflow I saw in hands-on IT support: request intake, impact/urgency classification, ticket queues, guided diagnostics, work notes, resolution confirmation, and reporting. I designed the user interface and implemented the logic in HTML, CSS, and JavaScript. The data is synthetic, and the app runs completely in the browser."

## Potential next steps

- Add a Node/Express backend with authentication and role-based access.
- Build SQL tables for tickets, users, notes, and SLA policies.
- Add automated tests and deploy a full-stack version.
- Build accessibility and keyboard-interaction improvements.

## Files

- `index.html` — accessible page structure and UI
- `styles.css` — responsive design
- `app.js` — application state, sample tickets, priority rules, work notes, and export
- `screenshot.png` — preview image for your LinkedIn project media
- `LinkedIn_Project_Copy.txt` — ready-to-paste project description and profile copy