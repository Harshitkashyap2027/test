const companyServices = {
  employee: {
    title: 'Employee Service',
    stats: [
      { label: 'Assigned Tasks', value: '128 Open' },
      { label: 'Attendance Rate', value: '96.4%' },
      { label: 'Payroll Cycle', value: 'On Schedule' },
      { label: 'Review Completion', value: '84%' }
    ],
    modules: [
      {
        title: 'Dashboard',
        section: 'Work overview',
        description: 'Consolidated view of day-to-day operational progress and individual responsibility focus.',
        tags: ['Realtime', 'Productivity']
      },
      {
        title: 'Tasks',
        section: 'Assigned work',
        description: 'Assignment intake, prioritization, dependency map, and due-date escalation board.',
        tags: ['Assignments', 'Workflow']
      },
      {
        title: 'Attendance',
        section: 'Check-in',
        description: 'Daily check-in, shift summary, and leave visibility with policy-safe guardrails.',
        tags: ['Check-in', 'Leave']
      },
      {
        title: 'Salary',
        section: 'Payslip',
        description: 'Payslip access and monthly salary breakups with tax and compliance snapshots.',
        tags: ['Payroll', 'Finance']
      },
      {
        title: 'Performance',
        section: 'Reviews',
        description: 'Quarterly review goals, manager feedback loops, and contribution scoring.',
        tags: ['KPIs', 'Feedback']
      },
      {
        title: 'Career Path',
        section: 'Growth',
        description: 'Role progression recommendations tied to upskilling milestones and review outcomes.',
        tags: ['Growth', 'Learning']
      },
      {
        title: 'Profile',
        section: 'Info',
        description: 'Personal info, emergency contacts, skills profile, and compliance acknowledgements.',
        tags: ['Identity', 'Self-Service']
      }
    ]
  },
  hr: {
    title: 'HR Service',
    stats: [
      { label: 'Active Requisitions', value: '22 Roles' },
      { label: 'Candidates in Pipeline', value: '346' },
      { label: 'Onboarding Progress', value: '71%' },
      { label: 'Policy Sign-Off', value: '98%' }
    ],
    modules: [
      {
        title: 'Dashboard',
        section: 'HR overview',
        description: 'Human resources command board for staffing health, compliance, and cycle planning.',
        tags: ['HR Ops', 'Insights']
      },
      {
        title: 'Recruitment',
        section: 'Hiring',
        description: 'Job opening setup, recruiter workflows, and panel collaboration with SLA tracking.',
        tags: ['Hiring', 'Sourcing']
      },
      {
        title: 'Candidate Pipeline',
        section: 'Applicants',
        description: 'Application stages from screening through offer with interview signal scoring.',
        tags: ['ATS', 'Screening']
      },
      {
        title: 'Onboarding',
        section: 'New hires',
        description: 'Structured day-0 to day-90 onboarding plans, document tracking, and buddy assignment.',
        tags: ['Onboarding', 'Lifecycle']
      },
      {
        title: 'Policies',
        section: 'Rules',
        description: 'Policy center for handbook updates, acceptance logs, and compliance alerts.',
        tags: ['Compliance', 'Policy']
      }
    ]
  },
  department: {
    title: 'Department Service',
    stats: [
      { label: 'Departments', value: '18' },
      { label: 'Team Members', value: '524' },
      { label: 'Allocation Efficiency', value: '91%' },
      { label: 'Dept KPI Score', value: '8.7 / 10' }
    ],
    modules: [
      {
        title: 'Dashboard',
        section: 'Dept overview',
        description: 'Department-level work health and strategic objective alignment dashboard.',
        tags: ['Overview', 'Strategy']
      },
      {
        title: 'Team Management',
        section: 'Members',
        description: 'Structure teams, assign leads, and monitor team availability by workstream.',
        tags: ['Teams', 'Org Design']
      },
      {
        title: 'Task Allocation',
        section: 'Work',
        description: 'Balance workloads and route tasks by skills, capacity, and department objectives.',
        tags: ['Allocation', 'Capacity']
      },
      {
        title: 'Performance',
        section: 'Dept metrics',
        description: 'Department scorecards for throughput, quality, and SLA adherence.',
        tags: ['Scorecards', 'Metrics']
      }
    ]
  },
  admin: {
    title: 'Admin Service',
    stats: [
      { label: 'Total Workforce', value: '1,248' },
      { label: 'Monthly Payroll', value: '$3.8M' },
      { label: 'Live Projects', value: '63' },
      { label: 'Training Completion', value: '76%' }
    ],
    modules: [
      {
        title: 'Workforce',
        section: 'Employee Management',
        description: 'Employee records lifecycle with cross-departmental governance and controls.',
        tags: ['Records', 'Governance']
      },
      {
        title: 'Departments',
        section: 'Structure',
        description: 'Organization mapping, hierarchy updates, and department ownership settings.',
        tags: ['Org Chart', 'Structure']
      },
      {
        title: 'Finance Payroll',
        section: 'Salary',
        description: 'Salary cycles, variable components, and exception queues for finance approval.',
        tags: ['Payroll', 'Approvals']
      },
      {
        title: 'Expense Tracking',
        section: 'Costs',
        description: 'Department and project-level cost visibility with anomaly monitoring.',
        tags: ['Expenses', 'Cost Control']
      },
      {
        title: 'Productivity Projects',
        section: 'Management',
        description: 'Project rollout workspace with milestones, blockers, and team accountability.',
        tags: ['Projects', 'Delivery']
      },
      {
        title: 'OKR/KPI',
        section: 'Goals',
        description: 'Objective progress board with KR confidence signals and department ownership.',
        tags: ['OKR', 'KPI']
      },
      {
        title: 'Performance Reviews',
        section: 'Evaluation',
        description: 'Performance cycle setup, calibration, and manager-executive review workflow.',
        tags: ['Evaluation', 'People Ops']
      },
      {
        title: 'Growth',
        section: 'Training Portal',
        description: 'Learning map for role-specific curriculum and certification-driven promotion lanes.',
        tags: ['L&D', 'Training']
      }
    ]
  },
  'company-admin': {
    title: '3D Company Admin',
    stats: [
      { label: 'Assets Tracked', value: '9,420' },
      { label: 'Leave Compliance', value: '97.2%' },
      { label: 'Hiring Cycle Time', value: '14 Days' },
      { label: 'Review Health', value: '89%' }
    ],
    modules: [
      {
        title: 'Employees',
        section: 'Staff records',
        description: 'Master staff records and lifecycle states with secure access controls.',
        tags: ['Employees', 'Profiles']
      },
      {
        title: 'Departments',
        section: 'Org structure',
        description: 'Interactive organization model that tracks ownership, span, and responsibilities.',
        tags: ['Hierarchy', 'Organization']
      },
      {
        title: 'HR Management',
        section: 'Hiring',
        description: 'Hiring demand planning, recruiter assignment, and conversion performance analytics.',
        tags: ['Hiring', 'Planning']
      },
      {
        title: 'Recruitment Pipeline',
        section: 'Candidates',
        description: 'Candidate funnel with response SLA alerts and interview outcome intelligence.',
        tags: ['Pipeline', 'Talent']
      },
      {
        title: 'Payroll',
        section: 'Salary system',
        description: 'Payroll engine orchestration with compensation change governance and audits.',
        tags: ['Salary', 'Compensation']
      },
      {
        title: 'Attendance & Leaves',
        section: 'Work tracking',
        description: 'Attendance streams, geo-check-in, leave balances, and policy rule automations.',
        tags: ['Attendance', 'Leaves']
      },
      {
        title: 'Projects & Tasks',
        section: 'Work management',
        description: 'Unified tasking board for execution cadence and blocker escalation.',
        tags: ['Projects', 'Tasks']
      },
      {
        title: 'Performance Reviews',
        section: 'Evaluation',
        description: 'Continuous evaluation architecture with rubric consistency and calibration.',
        tags: ['Performance', 'Reviews']
      },
      {
        title: 'OKR/KPI Tracking',
        section: 'Goals',
        description: 'Goal tracking matrix linked to teams, business outcomes, and reporting cadence.',
        tags: ['Goals', 'KPIs']
      },
      {
        title: 'Assets',
        section: 'Equipment tracking',
        description: 'Asset inventory controls with assignment history and maintenance states.',
        tags: ['Assets', 'Inventory']
      },
      {
        title: 'Expenses',
        section: 'Financial tracking',
        description: 'Operational spending insights with budget thresholds and reimbursement queues.',
        tags: ['Finance', 'Expenses']
      },
      {
        title: 'Training Portal',
        section: 'Learning',
        description: 'Capability-building platform for internal academies and certification journeys.',
        tags: ['Learning', 'Upskilling']
      }
    ]
  }
};

const timelineSeed = [
  { time: '2 mins ago', text: 'Attendance sync completed for 1,248 employees.' },
  { time: '10 mins ago', text: 'Payroll pre-check generated 8 exception flags for review.' },
  { time: '24 mins ago', text: 'Recruitment pipeline moved 14 candidates to final round.' },
  { time: '52 mins ago', text: 'Department KPI snapshot refreshed from analytics dataset.' },
  { time: '1 hr ago', text: 'Training portal assigned role-based course packs to 62 users.' }
];

const activeServiceTitle = document.getElementById('activeServiceTitle');
const statsGrid = document.getElementById('statsGrid');
const moduleList = document.getElementById('moduleList');
const moduleCardTemplate = document.getElementById('moduleCardTemplate');
const serviceSearch = document.getElementById('serviceSearch');
const activityTimeline = document.getElementById('activityTimeline');
const refreshBtn = document.getElementById('refreshBtn');

let currentService = 'employee';
let currentQuery = '';

const setActiveTab = () => {
  document.querySelectorAll('.service-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.service === currentService);
  });
};

const renderStats = (stats) => {
  statsGrid.innerHTML = '';
  stats.forEach((stat) => {
    const card = document.createElement('article');
    card.className = 'stat-card';
    card.innerHTML = `<h4>${stat.label}</h4><p>${stat.value}</p>`;
    statsGrid.appendChild(card);
  });
};

const renderModules = (modules) => {
  moduleList.innerHTML = '';
  const filteredModules = modules.filter((module) => {
    const haystack = `${module.title} ${module.section} ${module.description} ${module.tags.join(' ')}`.toLowerCase();
    return haystack.includes(currentQuery.toLowerCase());
  });

  filteredModules.forEach((module) => {
    const fragment = moduleCardTemplate.content.cloneNode(true);
    fragment.querySelector('h4').textContent = module.title;
    fragment.querySelector('.badge').textContent = module.section;
    fragment.querySelector('.module-desc').textContent = module.description;

    const metaContainer = fragment.querySelector('.module-meta');
    module.tags.forEach((tag) => {
      const chip = document.createElement('span');
      chip.className = 'meta-chip';
      chip.textContent = tag;
      metaContainer.appendChild(chip);
    });

    fragment.querySelector('.module-open-btn').addEventListener('click', () => {
      window.alert(`Opening ${module.title} in ${companyServices[currentService].title}`);
    });

    moduleList.appendChild(fragment);
  });

  if (!filteredModules.length) {
    const emptyState = document.createElement('article');
    emptyState.className = 'module-card';
    emptyState.innerHTML = '<h4>No modules found</h4><p class="module-desc">Try a broader search term like "Payroll" or "Dashboard".</p>';
    moduleList.appendChild(emptyState);
  }
};

const renderTimeline = () => {
  activityTimeline.innerHTML = '';
  timelineSeed.forEach((entry) => {
    const item = document.createElement('li');
    item.innerHTML = `<time>${entry.time}</time>${entry.text}`;
    activityTimeline.appendChild(item);
  });
};

const renderService = () => {
  const data = companyServices[currentService];
  activeServiceTitle.textContent = data.title;
  setActiveTab();
  renderStats(data.stats);
  renderModules(data.modules);
  renderTimeline();
};

document.querySelectorAll('.service-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    currentService = tab.dataset.service;
    currentQuery = '';
    serviceSearch.value = '';
    renderService();
  });
});

serviceSearch.addEventListener('input', (event) => {
  currentQuery = event.target.value.trim();
  renderModules(companyServices[currentService].modules);
});

refreshBtn.addEventListener('click', () => {
  refreshBtn.disabled = true;
  refreshBtn.textContent = 'Refreshing...';
  setTimeout(() => {
    refreshBtn.disabled = false;
    refreshBtn.textContent = 'Refresh';
    renderService();
  }, 500);
});

renderService();
