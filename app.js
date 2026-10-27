/* DeskPilot — independent, client-side IT support simulator.
 * No server, no authentication, no real people, and no patient information.
 */
(() => {
  'use strict';
  const KEY = 'deskpilot-demo-v1';
  const MS_HOUR = 3600000;
  const SLA_HOURS = {P1:2,P2:8,P3:24,P4:72};
  const CATEGORIES = ['Network','Identity & Access','Hardware','Software','Collaboration','Mobile Devices'];
  const RUNBOOKS = {
    'Network': {icon:'◉', subtitle:'Wi-Fi, DNS, and remote connectivity', steps:[
      'Confirm the exact error, affected users, and whether the issue is intermittent or continuous.',
      'Check Wi-Fi / Ethernet status, airplane mode, network adapter, and link lights where applicable.',
      'Collect IP configuration with ipconfig /all; verify DHCP address, gateway, and DNS settings.',
      'Test local gateway, a known IP, and DNS resolution separately to isolate the failure.',
      'Reconnect to the approved network, reset the adapter if appropriate, and escalate broader outages.',
      'Verify the user can reach the expected resource and record tests, actions, and outcome.'
    ]},
    'Identity & Access': {icon:'◇',subtitle:'Accounts, permissions, and SSO',steps:[
      'Verify the requestor using the organization’s approved identity verification process.',
      'Clarify whether the failure is a password, account lock, MFA, permissions, or SSO issue.',
      'Check for known identity service interruptions and confirm whether other applications work.',
      'Validate account status and access entitlement using approved administrative procedures.',
      'Complete authorized remediation or route approval-dependent changes to the appropriate owner.',
      'Have the user sign in successfully and document changes without storing secrets.'
    ]},
    'Hardware': {icon:'▣',subtitle:'Endpoints, monitors, and peripherals',steps:[
      'Confirm symptoms, device model, asset tag, connections, and whether power is present.',
      'Check cables, power adapters, monitor input source, docking connections, and physical indicators.',
      'Isolate the problem using a known-good cable, port, peripheral, or power supply.',
      'Check Device Manager, firmware, system logs, and driver state when applicable.',
      'Repair, replace, or escalate in accordance with device lifecycle and warranty procedures.',
      'Test the full user workflow and record asset changes and root-cause evidence.'
    ]},
    'Software': {icon:'▧',subtitle:'Application errors and installation',steps:[
      'Capture the application version, exact error, user impact, and steps to reproduce.',
      'Confirm system requirements, licensing, permissions, and active service incidents.',
      'Try an approved restart or cache repair; test using the smallest safe change.',
      'Review application logs and compare behavior on another supported device if feasible.',
      'Apply an approved update, reinstall, or vendor-supported workaround.',
      'Confirm normal function with the requestor and document the resolution.'
    ]},
    'Collaboration': {icon:'◈',subtitle:'Mail, Teams, and shared productivity tools',steps:[
      'Identify whether the issue affects calling, meetings, email, calendars, or a shared resource.',
      'Check service health and whether the issue occurs in both browser and desktop clients.',
      'Verify microphone, speakers, camera, account sign-in, and application permissions.',
      'Test the network, device settings, and an alternate supported client where appropriate.',
      'Apply the documented fix, reconnect or update the client, and avoid deleting user data.',
      'Confirm a successful test call, message, or meeting with the user.'
    ]},
    'Mobile Devices': {icon:'▯',subtitle:'Managed phones and enrollment',steps:[
      'Confirm device ownership, OS version, assigned user, and approved enrollment state.',
      'Check network access, time settings, storage, and any management agent errors.',
      'Review the mobile management console using authorized administrative permissions.',
      'Validate corporate profile, device compliance, required apps, and registration status.',
      'Follow the approved enrollment or remediation flow; avoid erasing data without permission.',
      'Confirm access and basic functions with the end user before resolving.'
    ]}
  };
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const safe = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hoursAgo = n => new Date(Date.now()-n*MS_HOUR).toISOString();
  const items = [
    ['VPN connection fails after MFA','Jordan Lee','Network','P2','Open',2.1,'VPN authentication succeeds but remote network connection does not complete.'],
    ['Docking station not detecting monitors','Alex Rivera','Hardware','P3','In progress',6.5,'External monitors show no signal when connected through the laptop dock.'],
    ['Account locked after repeated sign-in','Taylor Morgan','Identity & Access','P2','Open',1.2,'Employee cannot access corporate apps due to an account lock message.'],
    ['Teams microphone unavailable','Sam Carter','Collaboration','P3','In progress',11,'Meeting participants cannot hear audio from this workstation.'],
    ['Laptop Wi-Fi disconnects randomly','Casey Bennett','Network','P3','Open',5.4,'Wireless connection drops a few times each hour on one laptop.'],
    ['iPhone management enrollment error','Jamie Chen','Mobile Devices','P2','Open',3.5,'Corporate iPhone cannot complete managed device registration.'],
    ['Approved application installation','Riley Adams','Software','P4','Open',12,'User needs the approved analytics application installed for work.'],
    ['Shared printer unavailable','Avery Brooks','Hardware','P3','Resolved',39,'Print jobs stayed in the queue on one floor.'],
    ['Outlook desktop sign-in loop','Drew Parker','Collaboration','P3','Resolved',45,'Outlook repeatedly asks the user to sign in.'],
    ['Missing access to shared folder','Morgan James','Identity & Access','P3','In progress',17,'Employee cannot open an assigned departmental drive.'],
    ['Slow Windows startup','Quinn Harper','Hardware','P4','Open',22,'Computer takes several minutes to reach the desktop.'],
    ['Browser-based app displays an error','Sydney Brooks','Software','P2','In progress',4.1,'Internal web application fails to load after authentication.'],
    ['Critical team network outage','Robin Ellis','Network','P1','Resolved',31,'A critical shared workflow was disrupted during a simulated outage.'],
    ['Mobile email will not sync','Peyton Green','Mobile Devices','P4','Resolved',84,'Mail stops updating on a managed mobile phone.']
  ];
  const CATEGORY_ICON = {'Network':'◉','Identity & Access':'◇','Hardware':'▣','Software':'▧','Collaboration':'◈','Mobile Devices':'▯'};
  function initialTickets(){ return items.map((x,i)=>{
    const [title,requester,category,priority,status,age,description]=x;
    const created=hoursAgo(age), id=`INC-${String(2401+i).padStart(4,'0')}`;
    const log=[{at:created,text:'Ticket submitted and classified.'}];
    if(status==='In progress')log.push({at:hoursAgo(Math.max(age-2,.2)),text:'Work started; troubleshooting in progress.'});
    if(status==='Resolved')log.push({at:hoursAgo(Math.max(age-3,.2)),text:'Issue resolved; user confirmation recorded for demo.'});
    return {id,title,requester,category,priority,status,impact:priority==='P1'?'High':priority==='P4'?'Low':'Medium',urgency:priority==='P1'?'High':priority==='P4'?'Low':'Medium',description,created,resolved:status==='Resolved'?hoursAgo(Math.max(age-3,.2)):null,logs:log};
  });}
  let tickets;
  try { const stored=JSON.parse(localStorage.getItem(KEY));tickets=Array.isArray(stored)&&stored.length?stored:initialTickets(); } catch {tickets=initialTickets();}
  let view='dashboard', filter='All', priorityFilter='All', query='',currentTicketId=null;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(tickets));}catch{toast('Browser storage unavailable; changes last until refresh.');}}
  function priorityFor(impact,urgency){const m={Low:{Low:'P4',Medium:'P3',High:'P2'},Medium:{Low:'P3',Medium:'P2',High:'P2'},High:{Low:'P2',Medium:'P1',High:'P1'}};return m[impact][urgency];}
  function fmtDate(value){return new Date(value).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}
  function relDate(value){const diff=Date.now()-new Date(value).getTime(),h=Math.max(0,Math.round(diff/MS_HOUR));return h<1?'Just now':h<24?`${h}h ago`:`${Math.floor(h/24)}d ago`;}
  function dueDate(ticket){return new Date(new Date(ticket.created).getTime()+SLA_HOURS[ticket.priority]*MS_HOUR);}
  function slaLabel(ticket){if(ticket.status==='Resolved')return 'Completed';const d=dueDate(ticket).getTime()-Date.now(),h=Math.ceil(Math.abs(d)/MS_HOUR);return d<0?`${h}h overdue`:d<MS_HOUR?'Due <1h':`${h}h left`;}
  function isAtRisk(t){return t.status!=='Resolved' && dueDate(t).getTime()-Date.now()<2*MS_HOUR;}
  function metrics(){let open=tickets.filter(t=>t.status==='Open').length,working=tickets.filter(t=>t.status==='In progress').length,resolved=tickets.filter(t=>t.status==='Resolved').length,atrisk=tickets.filter(isAtRisk).length;let h=tickets.filter(t=>t.resolved).map(t=>(new Date(t.resolved)-new Date(t.created))/MS_HOUR),avg=h.length?(h.reduce((a,b)=>a+b,0)/h.length).toFixed(1):'—';return{open,working,resolved,atrisk,avg};}
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast._timer);toast._timer=setTimeout(()=>el.classList.remove('show'),3500);}
  const statInfo=[['Open tickets','open','↗','Awaiting first action',''],['In progress','working','◷','Actively being worked','purple'],['SLA attention','atrisk','!','Due soon or overdue','orange'],['Resolved','resolved','✓','Completed requests','blue']];
  function statCards(){const m=metrics();return statInfo.map(([label,k,ic,note,style])=>`<article class="stat-card ${style}"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${ic}</span></div><div><div class="stat-value">${m[k]}</div><div class="stat-foot">${note}</div></div></article>`).join('');}
  function chartHtml(by,sort=0){const all=Object.entries(by);if(sort)all.sort((a,b)=>b[1]-a[1]);const max=Math.max(1,...all.map(x=>x[1]));return all.map(([k,n])=>`<div class="cat-bar"><div class="cat-name"><span>${safe(k)}</span><b>${n}</b></div><div class="track"><div class="bar-fill" style="width:${(n/max*100).toFixed(1)}%"></div></div></div>`).join('');}
  function categoryBars(){const by=Object.fromEntries(CATEGORIES.map(c=>[c,0]));tickets.forEach(t=>by[t.category]=(by[t.category]||0)+1);return chartHtml(by,1);}
  function showDashboard(){const active=tickets.filter(t=>t.status!=='Resolved').sort((a,b)=>Number(a.priority.slice(1))-Number(b.priority.slice(1))||new Date(a.created)-new Date(b.created)).slice(0,6);$('#stats-grid').innerHTML=statCards();$('#dashboard-ticket-list').innerHTML=active.map(t=>`<button type="button" class="ticket-item" data-id="${safe(t.id)}"><div class="ticket-symbol">${CATEGORY_ICON[t.category]||'▧'}</div><div class="ticket-main"><span class="ticket-id">${safe(t.id)} · ${safe(t.category)}</span><span class="ticket-name">${safe(t.title)}</span><div class="ticket-meta">${safe(t.requester)} · ${relDate(t.created)}</div></div><div class="ticket-item-right"><span class="priority-pill priority-${t.priority}">${t.priority} · ${priorityName(t.priority)}</span><span class="ticket-age">${slaLabel(t)}</span></div></button>`).join('') || '<div class="empty-state"><strong>Everything is resolved.</strong>No active tickets.</div>';$('#category-bars').innerHTML=categoryBars();}
  function priorityName(p){return ({P1:'Critical',P2:'High',P3:'Medium',P4:'Low'})[p]||'Medium';}
  function showTickets(){const result=tickets.filter(t=>(filter==='All'||t.status===filter)&&(priorityFilter==='All'||t.priority===priorityFilter)&&[t.title,t.id,t.requester,t.category].some(s=>s.toLowerCase().includes(query.toLowerCase()))).sort((a,b)=>Number(a.priority.slice(1))-Number(b.priority.slice(1))||new Date(b.created)-new Date(a.created));$('#full-ticket-list').innerHTML=result.map(t=>`<tr><td><span class="table-ticket-id">${safe(t.id)} · ${safe(t.requester)}</span><strong class="table-ticket">${safe(t.title)}</strong></td><td>${safe(t.category)}</td><td><span class="priority-pill priority-${t.priority}">${t.priority} · ${priorityName(t.priority)}</span></td><td><span class="status-pill status-${t.status.replaceAll(' ','-')}">${safe(t.status)}</span></td><td>${slaLabel(t)}</td><td><button class="table-open" data-id="${safe(t.id)}">Open ↗</button></td></tr>`).join('')||'<tr><td colspan="6"><div class="empty-state"><strong>No matching tickets.</strong>Try adjusting the search or filters.</div></td></tr>';$('#table-footer').textContent=`Showing ${result.length} of ${tickets.length} fictional support requests`;}
  function showKnowledge(){const label={Network:'NW',Hardware:'HW',Software:'SW',Collaboration:'CL','Identity & Access':'ID','Mobile Devices':'MD'};$('#knowledge-grid').innerHTML=CATEGORIES.map(c=>`<details class="knowledge-card"><summary><span class="kb-icon">${RUNBOOKS[c].icon}</span><span class="kb-heading"><strong>${safe(c)}</strong><small>${safe(RUNBOOKS[c].subtitle)}</small></span><span class="kb-arrow">›</span></summary><ol class="knowledge-steps">${RUNBOOKS[c].steps.map(s=>`<li>${safe(s)}</li>`).join('')}</ol></details>`).join('');}
  function showInsights(){const m=metrics();$('#insights-grid').innerHTML=statCards();$('#insights-category-bars').innerHTML=categoryBars();const ps={P1:0,P2:0,P3:0,P4:0};tickets.forEach(t=>ps[t.priority]++);$('#priority-bars').innerHTML=chartHtml(Object.fromEntries(Object.entries(ps).map(([k,v])=>[`${k} · ${priorityName(k)}`,v])));}
  const subtitles={dashboard:['Support that moves forward.','Triage, troubleshoot, document, and resolve — all in one simulated service desk.'],tickets:['Every issue, one clear queue.','Search, prioritize, work, and resolve fictional service desk requests.'],knowledge:['The right fix starts here.','Practical diagnostic playbooks for common end-user incidents.'],insights:['Turn service data into clarity.','Monitor ticket mix, priority, and workflow performance.']};
  function navigate(next){view=next;const name={dashboard:'Overview',tickets:'Ticket queue',knowledge:'Knowledge base',insights:'Insights'};$('#breadcrumb-current').textContent=name[next];$('#page-title').innerHTML=safe(subtitles[next][0].slice(0,-1))+'<span class="heading-period">.</span>';$('#page-subtitle').textContent=subtitles[next][1];$$('.app-view').forEach(el=>el.classList.toggle('hidden',el.id!==next+'-view'));$$('.nav-link').forEach(el=>{el.classList.toggle('active',el.dataset.view===next);el.setAttribute('aria-current',el.dataset.view===next?'page':'false');});render();window.scrollTo({top:0,behavior:'smooth'});}
  function render(){const m=metrics();$('#nav-count').textContent=m.open+m.working;if(view==='dashboard')showDashboard();if(view==='tickets')showTickets();if(view==='knowledge')showKnowledge();if(view==='insights')showInsights();}
  function newTicketOpen(){$('#new-ticket-modal').classList.remove('hidden');$('#new-ticket-form').elements.title.focus();}
  function newTicketClose(){$('#new-ticket-modal').classList.add('hidden');}
  function detailOpen(id){const t=tickets.find(x=>x.id===id);if(!t)return;currentTicketId=id;$('#drawer-title').textContent=t.title;const steps=RUNBOOKS[t.category]?.steps||RUNBOOKS.Software.steps;$('#drawer-body').innerHTML=`<div class="detail-badges"><span class="priority-pill priority-${t.priority}">${t.priority} · ${priorityName(t.priority)}</span><span class="status-pill status-${t.status.replaceAll(' ','-')}">${safe(t.status)}</span><span class="priority-pill priority-P4">${safe(t.id)}</span></div><div class="detail-grid"><div class="detail-card"><small>Requestor</small><strong>${safe(t.requester)}</strong></div><div class="detail-card"><small>Category</small><strong>${safe(t.category)}</strong></div><div class="detail-card"><small>Created</small><strong>${fmtDate(t.created)} · ${relDate(t.created)}</strong></div><div class="detail-card"><small>Example SLA target</small><strong>${slaLabel(t)} (${SLA_HOURS[t.priority]}h)</strong></div></div><section class="drawer-section"><h3>Issue description</h3><p>${safe(t.description)}</p></section><section class="drawer-section"><h3>Recommended diagnostic checklist</h3><ol class="runbook-list">${steps.map(s=>`<li>${safe(s)}</li>`).join('')}</ol></section><section class="drawer-section"><h3>Work notes / resolution</h3><div class="drawer-editor"><label class="drawer-label" for="work-note">Document what you tested and confirmed</label><textarea id="work-note" placeholder="E.g. Verified connectivity, reconnected to approved Wi-Fi profile, confirmed browser access with user."></textarea></div><div class="action-row"><button type="button" id="save-work-note" class="secondary-button">＋ Save work note</button>${t.status==='Open'?'<button type="button" id="start-work" class="secondary-button outline-green">Start work</button>':''}${t.status!=='Resolved'?'<button type="button" id="resolve-ticket" class="primary-button">✓ Resolve ticket</button>':'<button type="button" id="reopen-ticket" class="secondary-button outline-green">↻ Reopen ticket</button>'}</div></section><section class="drawer-section"><h3>Activity log</h3><div class="notes-list">${[...t.logs].reverse().map(n=>`<div class="note"><small>${fmtDate(n.at)} · ${new Date(n.at).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</small><p>${safe(n.text)}</p></div>`).join('')}</div></section>`;$('#ticket-drawer-backdrop').classList.remove('hidden');$('#close-drawer').focus();}
  function detailClose(){currentTicketId=null;$('#ticket-drawer-backdrop').classList.add('hidden');}
  function recordEvent(t,message){t.logs.push({at:new Date().toISOString(),text:message});save();render();detailOpen(t.id);}
  function exportCsv(){const headers=['Ticket ID','Summary','Requestor','Category','Priority','Impact','Urgency','Status','Created','Resolved','SLA target','Description','Work notes'];const csv=[headers,...tickets.map(t=>[t.id,t.title,t.requester,t.category,t.priority,t.impact,t.urgency,t.status,t.created,t.resolved||'',dueDate(t).toISOString(),t.description,t.logs.map(l=>`${l.at}: ${l.text}`).join(' | ')])].map(row=>row.map(c=>'"'+String(c).replaceAll('"','""')+'"').join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='deskpilot_demo_tickets.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('CSV exported — includes simulated tickets only.');}
  $$('#primary-nav .nav-link').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.view)));
  document.addEventListener('click',e=>{const ticketBtn=e.target.closest('[data-id]');if(ticketBtn){detailOpen(ticketBtn.dataset.id);return;}const goBtn=e.target.closest('[data-go]');if(goBtn){navigate(goBtn.dataset.go);}});
  $('#create-ticket-top').addEventListener('click',newTicketOpen);
  $('#close-create').addEventListener('click',newTicketClose);
  $('#new-ticket-modal').addEventListener('click',e=>{if(e.target.id==='new-ticket-modal')newTicketClose();});
  $('#new-ticket-form').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const title=String(f.get('title')||'').trim(),requester=String(f.get('requester')||'').trim(),description=String(f.get('description')||'').trim();if(!title||!requester||!description){toast('Complete all required fields.');return;}const impact=f.get('impact'),urgency=f.get('urgency'),priority=priorityFor(impact,urgency);const next=Math.max(2414,...tickets.map(t=>Number(t.id.split('-')[1])||0))+1;const t={id:`INC-${next}`,title,requester,category:f.get('category'),impact,urgency,description,priority,status:'Open',created:new Date().toISOString(),resolved:null,logs:[{at:new Date().toISOString(),text:'Ticket created. Priority automatically calculated from impact and urgency.'}]};tickets.unshift(t);save();e.currentTarget.reset();newTicketClose();navigate('tickets');toast(`${t.id} created as ${priority}.`);detailOpen(t.id);});
  $('#ticket-filters').addEventListener('click',e=>{const b=e.target.closest('[data-filter]');if(!b)return;filter=b.dataset.filter;$$('.filter-tab').forEach(el=>el.classList.toggle('active',el===b));showTickets();});
  $('#ticket-search').addEventListener('input',e=>{query=e.target.value;showTickets();});
  $('#priority-filter').addEventListener('change',e=>{priorityFilter=e.target.value;showTickets();});
  $('#close-drawer').addEventListener('click',detailClose);
  $('#ticket-drawer-backdrop').addEventListener('click',e=>{if(e.target.id==='ticket-drawer-backdrop')detailClose();});
  $('#drawer-body').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!currentTicketId)return;const t=tickets.find(x=>x.id===currentTicketId);if(!t)return;const note=$('#work-note')?.value.trim()||'';
    if(b.id==='save-work-note'){if(!note){toast('Write a troubleshooting note first.');return;}recordEvent(t,note);toast('Work note saved.');}
    if(b.id==='start-work'){t.status='In progress';recordEvent(t,'Moved to In progress.');toast('Ticket now in progress.');}
    if(b.id==='resolve-ticket'){if(!note){toast('Describe the fix and verification before resolving.');return;}t.status='Resolved';t.resolved=new Date().toISOString();recordEvent(t,'RESOLUTION: '+note);toast('Ticket resolved and documented.');}
    if(b.id==='reopen-ticket'){t.status='Open';t.resolved=null;recordEvent(t,'Ticket reopened for additional investigation.');toast('Ticket reopened.');}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){newTicketClose();detailClose();}});
  $('#export-csv').addEventListener('click',exportCsv);
  $('#reset-demo').addEventListener('click',()=>{if(!confirm('Reset to the original fictional ticket data? Your local changes will be discarded.'))return;tickets=initialTickets();save();render();detailClose();toast('Demo data restored.');});
  render();
})();