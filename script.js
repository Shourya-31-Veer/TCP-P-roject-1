// Basic interactivity scaffolding for the dashboard.
// Placeholder data for demonstration.
const sampleData = [
  { id: 1, name: "आदिवासी जल संरक्षण", scheme: "वन अधिकार", district: "जिला 1", status: "प्रगति पर", expense: 1250000, date: "2025-07-10" },
  { id: 2, name: "समुदाय स्वास्थ्य शिविर", scheme: "स्वास्थ्य पहल", district: "जिला 2", status: "पूर्ण", expense: 540000, date: "2025-06-28" },
  { id: 3, name: "छात्रवृत्ति सहायता 2025", scheme: "शिक्षा सहायता", district: "जिला 3", status: "लंबित", expense: 230000, date: "2025-08-01" },
  { id: 4, name: "कृषि प्रशिक्षण बैच 1", scheme: "वन अधिकार", district: "जिला 2", status: "प्रगति पर", expense: 365000, date: "2025-07-21" },
  { id: 5, name: "महिला स्व-सहायता समूह", scheme: "स्वास्थ्य पहल", district: "जिला 1", status: "पूर्ण", expense: 770000, date: "2025-05-12" },
  { id: 6, name: "पोषण जागरूकता", scheme: "स्वास्थ्य पहल", district: "जिला 2", status: "प्रगति पर", expense: 150000, date: "2025-06-05" },
  { id: 7, name: "वन उत्पाद मूल्य संवर्धन", scheme: "वन अधिकार", district: "जिला 3", status: "लंबित", expense: 480000, date: "2025-07-14" },
  { id: 8, name: "ई-लर्निंग केंद्र स्थापना", scheme: "शिक्षा सहायता", district: "जिला 1", status: "प्रगति पर", expense: 910000, date: "2025-07-30" },
  { id: 9, name: "खाद्य सुरक्षा सर्वेक्षण", scheme: "स्वास्थ्य पहल", district: "जिला 3", status: "पूर्ण", expense: 210000, date: "2025-04-19" },
  { id: 10, name: "सूक्ष्म सिंचाई परियोजना", scheme: "वन अधिकार", district: "जिला 1", status: "प्रगति पर", expense: 1345000, date: "2025-06-17" },
  { id: 11, name: "छात्रावास उन्नयन", scheme: "शिक्षा सहायता", district: "जिला 2", status: "प्रगति पर", expense: 820000, date: "2025-07-08" }
];

const state = {
  currentSort: { key: null, direction: null },
  density: 'comfortable',
  page: 1,
  pageSize: 10,
  filteredData: [...sampleData]
};

const tableBody = document.getElementById('dataBody');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');
const pageSizeSelect = document.getElementById('pageSize');
const densitySelect = document.getElementById('densitySelect');

function formatNumber(n) {
  return n.toLocaleString('en-IN');
}

function statusBadge(status) {
  switch (status) {
    case "पूर्ण": return '<span class="badge success">पूर्ण</span>';
    case "प्रगति पर": return '<span class="badge">प्रगति</span>';
    case "लंबित": return '<span class="badge pending">लंबित</span>';
    default: return status;
  }
}

function renderTable() {
  const start = (state.page - 1) * state.pageSize;
  const pageData = state.filteredData.slice(start, start + state.pageSize);

  tableBody.innerHTML = pageData.map(row => `
    <tr>
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>${row.scheme}</td>
      <td>${row.district}</td>
      <td>${statusBadge(row.status)}</td>
      <td style="text-align:right;">${formatNumber(row.expense)}</td>
      <td>${row.date}</td>
      <td>
        <div class="action-inline">
          <button aria-label="देखें ${row.name}">देखें</button>
          <button aria-label="संपादित करें ${row.name}">संपादित</button>
        </div>
      </td>
    </tr>
  `).join('');

  const totalPages = Math.max(1, Math.ceil(state.filteredData.length / state.pageSize));
  currentPageEl.textContent = state.page;
  totalPagesEl.textContent = totalPages;
  updatePaginationButtons(totalPages);
}

function updatePaginationButtons(totalPages) {
  const pag = document.querySelector('.pagination');
  const buttons = pag.querySelectorAll('.page-btn');
  const [first, prev, next, last] = buttons;
  first.disabled = prev.disabled = state.page === 1;
  next.disabled = last.disabled = state.page === totalPages;
}

function sortData(key, type) {
  if (state.currentSort.key === key) {
    state.currentSort.direction = state.currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    state.currentSort.key = key;
    state.currentSort.direction = 'asc';
  }
  const dir = state.currentSort.direction === 'asc' ? 1 : -1;
  state.filteredData.sort((a, b) => {
    let va = a[key];
    let vb = b[key];
    if (type === 'number') {
      va = Number(va);
      vb = Number(vb);
    } else {
      va = (va ?? '').toString().localeCompare ? va.toString() : va;
      vb = (vb ?? '').toString().localeCompare ? vb.toString() : vb;
    }
    return va < vb ? -1 * dir : va > vb ? 1 * dir : 0;
  });
  updateSortIndicators();
  renderTable();
}

function updateSortIndicators() {
  document.querySelectorAll('th[data-sort]').forEach(th => {
    if (th.dataset.sort === state.currentSort.key) {
      th.setAttribute('data-direction', state.currentSort.direction);
    } else {
      th.removeAttribute('data-direction');
    }
  });
}

document.querySelectorAll('th[data-sort]').forEach(th => {
  th.addEventListener('click', () => {
    sortData(th.dataset.sort, th.dataset.sort === 'number' ? 'number' : 'text');
  });
});

document.getElementById('filterForm').addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const scheme = fd.get('scheme');
  const district = fd.get('district');
  const block = fd.get('block'); // Not used in sample; would filter real data
  const status = fd.get('status');
  const fy = fd.get('fy');
  const keyword = (fd.get('keyword') || '').trim().toLowerCase();

  state.filteredData = sampleData.filter(r => {
    return (!scheme || r.scheme === scheme)
      && (!district || r.district === district)
      && (!status || r.status === status)
      && (!keyword || r.name.toLowerCase().includes(keyword));
  });
  state.page = 1;
  renderTable();
});

document.getElementById('filterForm').addEventListener('reset', e => {
  setTimeout(() => {
    state.filteredData = [...sampleData];
    state.page = 1;
    renderTable();
  }, 0);
});

pageSizeSelect.addEventListener('change', () => {
  state.pageSize = Number(pageSizeSelect.value);
  state.page = 1;
  renderTable();
});

document.querySelectorAll('.pagination .page-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const totalPages = Math.ceil(state.filteredData.length / state.pageSize);
    switch (btn.getAttribute('aria-label')) {
      case 'पहला': state.page = 1; break;
      case 'पिछला': if (state.page > 1) state.page--; break;
      case 'अगला': if (state.page < totalPages) state.page++; break;
      case 'अंतिम': state.page = totalPages; break;
    }
    renderTable();
  });
});

// Density
densitySelect.addEventListener('change', () => {
  document.documentElement.dataset.density = densitySelect.value === 'compact' ? 'compact' : 'comfortable';
});

// User menu toggle
const userBtn = document.querySelector('.user-btn');
const userDropdown = document.querySelector('.user-dropdown');

userBtn.addEventListener('click', e => {
  const expanded = userBtn.getAttribute('aria-expanded') === 'true';
  userBtn.setAttribute('aria-expanded', String(!expanded));
  userDropdown.classList.toggle('open', !expanded);
});

document.addEventListener('click', e => {
  if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
    userBtn.setAttribute('aria-expanded', 'false');
    userDropdown.classList.remove('open');
  }
});

// Keyboard accessibility for dropdown
userBtn.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') {
    userDropdown.classList.add('open');
    userBtn.setAttribute('aria-expanded', 'true');
    const first = userDropdown.querySelector('li button');
    first && first.focus();
    e.preventDefault();
  }
});

userDropdown.addEventListener('keydown', e => {
  const items = [...userDropdown.querySelectorAll('li button')];
  const idx = items.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') {
    const next = items[idx + 1] || items[0];
    next.focus();
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    const prev = items[idx - 1] || items[items.length - 1];
    prev.focus();
    e.preventDefault();
  } else if (e.key === 'Escape') {
    userBtn.focus();
    userBtn.click();
  }
});

// Collapse filters
const collapseBtn = document.querySelector('.collapse-btn');
const filterBody = document.getElementById('filterBody');
collapseBtn.addEventListener('click', () => {
  const expanded = collapseBtn.getAttribute('aria-expanded') === 'true';
  collapseBtn.setAttribute('aria-expanded', String(!expanded));
  filterBody.style.display = expanded ? 'none' : '';
});

// Print & Export placeholders
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  // Simple CSV export of visible data
  const headers = ["क्रम","परियोजना नाम","योजना","ज़िला","स्थिति","व्यय","अद्यतन तिथि"];
  const csvRows = [headers.join(',')];
  state.filteredData.forEach(r => {
    csvRows.push([r.id, r.name, r.scheme, r.district, r.status, r.expense, r.date].map(v => `"${v}"`).join(','));
  });
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'projects.csv';
  a.click();
  URL.revokeObjectURL(a.href);
});

// Add new work (modal placeholder)
document.getElementById('addNewBtn').addEventListener('click', () => {
  alert('नया कार्य फ़ॉर्म (डिज़ाइन प्रोटोटाइप) - यहाँ मॉडल खुलेगा।');
});

// Ripple position for button after effect
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('pointerdown', e => {
    const rect = btn.getBoundingClientRect();
    btn.style.setProperty('--x', (e.clientX - rect.left) + 'px');
    btn.style.setProperty('--y', (e.clientY - rect.top) + 'px');
  });
});

// Mobile sidebar toggle (simulate via header pseudo element click)
function setupMobileMenu() {
  if (window.matchMedia('(max-width: 560px)').matches) {
    const header = document.querySelector('.header');
    header.addEventListener('click', e => {
      if (e.target === header || e.target === header.firstChild) {
        const sidebar = document.querySelector('.sidebar');
        const open = sidebar.classList.toggle('open');
        document.body.classList.toggle('menu-open', open);
        header.classList.toggle('menu-active', open);
      }
    });
  }
}

setupMobileMenu();
window.addEventListener('resize', setupMobileMenu);

renderTable();
