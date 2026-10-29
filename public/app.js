/**
 * Student Records Registry — RESTful API Console Frontend
 * Pure Vanilla JavaScript (ES6+) | Impeccable Operate Mode
 */

(() => {
  // Application State
  const state = {
    records: [],
    meta: { total: 0, page: 1, limit: 15, totalPages: 1 },
    filters: {
      search: '',
      department: 'All',
      status: 'All',
      sortBy: 'createdAt',
      order: 'desc',
      page: 1,
      limit: 15,
    },
    editingRecordId: null,
    deletingRecord: null,
    isInspectorOpen: false,
    searchDebounceTimer: null,
  };

  // DOM Elements Cache
  const el = {
    // Telemetry
    dbPip: document.getElementById('db-pip'),
    dbStatusText: document.getElementById('db-status-text'),
    telemetryCount: document.getElementById('telemetry-count'),
    telemetryCgpa: document.getElementById('telemetry-cgpa'),
    
    // Header Actions
    btnToggleInspector: document.getElementById('btn-toggle-inspector'),
    btnSeedData: document.getElementById('btn-seed-data'),
    btnOpenCreateModal: document.getElementById('btn-open-create-modal'),

    // Toolbar
    searchInput: document.getElementById('search-input'),
    searchClear: document.getElementById('search-clear'),
    filterDept: document.getElementById('filter-dept'),
    filterStatus: document.getElementById('filter-status'),
    sortBy: document.getElementById('sort-by'),
    sortOrderBtn: document.getElementById('sort-order-btn'),
    sortOrderText: document.getElementById('sort-order-text'),

    // Table
    recordsTbody: document.getElementById('records-tbody'),
    recordMetaCount: document.getElementById('record-meta-count'),
    currentPage: document.getElementById('current-page'),
    totalPages: document.getElementById('total-pages'),
    btnPrevPage: document.getElementById('btn-prev-page'),
    btnNextPage: document.getElementById('btn-next-page'),

    // Layout & Inspector
    workspaceGrid: document.getElementById('workspace-grid'),
    inspectorDrawer: document.getElementById('inspector-drawer'),
    btnCloseInspector: document.getElementById('btn-close-inspector'),
    inspectorStatusBadge: document.getElementById('inspector-status-badge'),
    inspectorEndpoint: document.getElementById('inspector-endpoint'),
    inspectorLatency: document.getElementById('inspector-latency'),
    inspectorTime: document.getElementById('inspector-time'),
    jsonViewer: document.getElementById('json-viewer'),
    curlViewer: document.getElementById('curl-viewer'),
    btnCopyJson: document.getElementById('btn-copy-json'),
    btnCopyCurl: document.getElementById('btn-copy-curl'),

    // Record Modal
    recordModal: document.getElementById('record-modal'),
    modalTitle: document.getElementById('modal-title'),
    recordForm: document.getElementById('record-form'),
    formRecordId: document.getElementById('form-record-id'),
    inputStudentId: document.getElementById('input-studentId'),
    inputFullName: document.getElementById('input-fullName'),
    inputEmail: document.getElementById('input-email'),
    inputDepartment: document.getElementById('input-department'),
    inputSemester: document.getElementById('input-semester'),
    inputCgpa: document.getElementById('input-cgpa'),
    inputStatus: document.getElementById('input-status'),
    inputCourses: document.getElementById('input-courses'),
    inputRemarks: document.getElementById('input-remarks'),
    btnCancelModal: document.getElementById('btn-cancel-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),

    // Delete Modal
    deleteModal: document.getElementById('delete-modal'),
    deletePrnDisplay: document.getElementById('delete-prn-display'),
    btnCancelDelete: document.getElementById('btn-cancel-delete'),
    btnConfirmDelete: document.getElementById('btn-confirm-delete'),
    btnCloseDeleteModal: document.getElementById('btn-close-delete-modal'),

    // Toast Container
    toastContainer: document.getElementById('toast-container'),
  };

  // API Client with Timing & Inspector Logging
  async function apiRequest(endpoint, options = {}) {
    const startTime = performance.now();
    const method = options.method || 'GET';
    const url = endpoint.startsWith('http') ? endpoint : endpoint;

    let curlCmd = `curl -X ${method} "${window.location.origin}${endpoint}"`;
    if (options.body) {
      curlCmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${options.body}'`;
    }

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });

      const latency = Math.round(performance.now() - startTime);
      const data = await response.json().catch(() => null);

      // Log into live inspector
      updateInspector({
        method,
        endpoint,
        status: response.status,
        statusText: response.statusText,
        latency,
        data,
        curl: curlCmd,
      });

      return { ok: response.ok, status: response.status, data };
    } catch (err) {
      const latency = Math.round(performance.now() - startTime);
      updateInspector({
        method,
        endpoint,
        status: 0,
        statusText: 'Network / CORS Error',
        latency,
        data: { error: err.message },
        curl: curlCmd,
      });
      throw err;
    }
  }

  // Update Live API Inspector
  function updateInspector({ method, endpoint, status, statusText, latency, data, curl }) {
    if (!el.inspectorDrawer) return;

    el.inspectorEndpoint.textContent = `${method} ${endpoint}`;
    el.inspectorLatency.textContent = `${latency}ms`;
    el.inspectorTime.textContent = new Date().toLocaleTimeString();

    // Status Badge
    el.inspectorStatusBadge.textContent = `${status} ${statusText || ''}`.trim();
    if (status >= 200 && status < 300) {
      el.inspectorStatusBadge.className = 'badge badge-mono';
    } else {
      el.inspectorStatusBadge.className = 'badge badge-mono error';
    }

    // JSON Viewer
    el.jsonViewer.innerHTML = `<code>${escapeHtml(JSON.stringify(data, null, 2))}</code>`;
    el.curlViewer.innerHTML = `<code>${escapeHtml(curl)}</code>`;
  }

  // Escape HTML helper
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Toast Notification System
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success'
      ? `<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg class="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `${icon}<span>${escapeHtml(message)}</span>`;
    el.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }

  // Fetch Telemetry & Database Health
  async function fetchHealthAndStats() {
    try {
      const [healthRes, statsRes] = await Promise.all([
        fetch('/api/health').then(r => r.json()).catch(() => null),
        fetch('/api/stats').then(r => r.json()).catch(() => null),
      ]);

      if (healthRes && healthRes.success) {
        const mode = healthRes.database?.mode || 'Connected';
        el.dbPip.className = 'status-pip live';
        el.dbStatusText.textContent = `DB: ${mode}`;
      } else {
        el.dbPip.className = 'status-pip warning';
        el.dbStatusText.textContent = 'DB: Standalone';
      }

      if (statsRes && statsRes.success) {
        el.telemetryCount.textContent = statsRes.data.total ?? 0;
        el.telemetryCgpa.textContent = (statsRes.data.avgCgpa ?? 0).toFixed(2);
      }
    } catch {
      el.dbPip.className = 'status-pip warning';
      el.dbStatusText.textContent = 'DB: Local';
    }
  }

  // Fetch & Render Records
  async function loadRecords() {
    const params = new URLSearchParams({
      search: state.filters.search,
      department: state.filters.department,
      status: state.filters.status,
      sortBy: state.filters.sortBy,
      order: state.filters.order,
      page: state.filters.page,
      limit: state.filters.limit,
    });

    el.recordsTbody.innerHTML = `<tr><td colspan="8" class="td-empty">Querying database records...</td></tr>`;

    try {
      const { ok, data } = await apiRequest(`/api/records?${params.toString()}`);

      if (ok && data.success) {
        state.records = data.data || [];
        state.meta = data.meta || { total: state.records.length, page: 1, limit: 15, totalPages: 1 };
        renderRecords();
      } else {
        el.recordsTbody.innerHTML = `<tr><td colspan="8" class="td-empty text-danger">Failed to fetch records: ${data?.message || 'Unknown error'}</td></tr>`;
      }
    } catch (err) {
      el.recordsTbody.innerHTML = `<tr><td colspan="8" class="td-empty">Error loading records: ${err.message}</td></tr>`;
    }
  }

  // Render Table Rows
  function renderRecords() {
    const { records, meta } = state;

    el.recordMetaCount.textContent = `Showing ${records.length} of ${meta.total} records`;
    el.currentPage.textContent = meta.page;
    el.totalPages.textContent = meta.totalPages || 1;
    el.btnPrevPage.disabled = meta.page <= 1;
    el.btnNextPage.disabled = meta.page >= meta.totalPages;

    if (!records || records.length === 0) {
      el.recordsTbody.innerHTML = `
        <tr>
          <td colspan="8" class="td-empty">
            No records matched your search/filter criteria.
            <div style="margin-top: 0.5rem;">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-filters">Reset Filters</button>
            </div>
          </td>
        </tr>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
      return;
    }

    el.recordsTbody.innerHTML = records
      .map((r) => {
        const statusClass = (r.enrollmentStatus || 'Active').toLowerCase().replace(' ', '-');
        const courses = Array.isArray(r.courses) && r.courses.length
          ? r.courses.map(c => `<span class="course-tag">${escapeHtml(c)}</span>`).join('')
          : '<span class="text-dim">None</span>';

        return `
          <tr data-id="${r._id || r.studentId}">
            <td class="prn-cell font-mono">${escapeHtml(r.studentId)}</td>
            <td>
              <div class="student-info">
                <span class="student-name">${escapeHtml(r.fullName)}</span>
                <span class="student-email">${escapeHtml(r.email)}</span>
              </div>
            </td>
            <td><span class="badge-dept">${escapeHtml(r.department)}</span></td>
            <td class="font-mono">Sem ${r.semester}</td>
            <td><span class="badge-cgpa">${Number(r.cgpa || 0).toFixed(2)}</span></td>
            <td><span class="badge-status ${statusClass}">${escapeHtml(r.enrollmentStatus || 'Active')}</span></td>
            <td><div class="courses-pills">${courses}</div></td>
            <td class="td-actions">
              <button type="button" class="table-action-btn btn-view" title="Inspect Record in JSON Console" data-id="${r._id}">View</button>
              <button type="button" class="table-action-btn btn-edit" title="Edit Record" data-id="${r._id}">Edit</button>
              <button type="button" class="table-action-btn btn-delete" title="Delete Record" data-id="${r._id}" data-prn="${r.studentId}">Delete</button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  // Clear Filter Inputs
  function resetFilters() {
    state.filters.search = '';
    state.filters.department = 'All';
    state.filters.status = 'All';
    state.filters.page = 1;

    el.searchInput.value = '';
    el.searchClear.classList.add('hidden');
    el.filterDept.value = 'All';
    el.filterStatus.value = 'All';

    loadRecords();
  }

  // Open Modal for Create or Edit
  function openRecordModal(record = null) {
    clearFormErrors();
    if (record) {
      state.editingRecordId = record._id || record.studentId;
      el.modalTitle.textContent = `Edit Record — ${record.studentId}`;
      el.formRecordId.value = state.editingRecordId;
      el.inputStudentId.value = record.studentId || '';
      el.inputStudentId.readOnly = true; // Lock PRN on edit
      el.inputFullName.value = record.fullName || '';
      el.inputEmail.value = record.email || '';
      el.inputDepartment.value = record.department || '';
      el.inputSemester.value = record.semester || 1;
      el.inputCgpa.value = record.cgpa !== undefined ? record.cgpa : '';
      el.inputStatus.value = record.enrollmentStatus || 'Active';
      el.inputCourses.value = Array.isArray(record.courses) ? record.courses.join(', ') : '';
      el.inputRemarks.value = record.remarks || '';
    } else {
      state.editingRecordId = null;
      el.modalTitle.textContent = 'Create New Student Record';
      el.formRecordId.value = '';
      el.recordForm.reset();
      el.inputStudentId.readOnly = false;
      el.inputSemester.value = 5;
      el.inputStatus.value = 'Active';
    }
    el.recordModal.classList.remove('hidden');
    (record ? el.inputFullName : el.inputStudentId).focus();
  }

  function closeRecordModal() {
    el.recordModal.classList.add('hidden');
    state.editingRecordId = null;
    clearFormErrors();
  }

  function clearFormErrors() {
    document.querySelectorAll('.field-error').forEach((e) => (e.textContent = ''));
    document.querySelectorAll('.input-control, .select-control').forEach((e) => e.classList.remove('error'));
  }

  function displayFormErrors(errors = []) {
    clearFormErrors();
    errors.forEach(({ field, message }) => {
      const errEl = document.getElementById(`err-${field}`);
      const inputEl = document.getElementById(`input-${field}`);
      if (errEl) errEl.textContent = message;
      if (inputEl) inputEl.classList.add('error');
    });
  }

  // Handle Form Submission (POST / PUT)
  async function handleFormSubmit(e) {
    e.preventDefault();
    clearFormErrors();

    const coursesArray = el.inputCourses.value
      .split(',')
      .map((c) => c.trim().toUpperCase())
      .filter((c) => c.length > 0);

    const payload = {
      studentId: el.inputStudentId.value.trim().toUpperCase(),
      fullName: el.inputFullName.value.trim(),
      email: el.inputEmail.value.trim().toLowerCase(),
      department: el.inputDepartment.value,
      semester: parseInt(el.inputSemester.value, 10),
      cgpa: parseFloat(el.inputCgpa.value),
      enrollmentStatus: el.inputStatus.value,
      courses: coursesArray.length ? coursesArray : ['WT-301'],
      remarks: el.inputRemarks.value.trim() || 'Good academic standing',
    };

    const isEdit = Boolean(state.editingRecordId);
    const endpoint = isEdit ? `/api/records/${state.editingRecordId}` : '/api/records';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const { ok, status, data } = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (ok && data.success) {
        showToast(
          isEdit
            ? `Student ${payload.studentId} updated successfully`
            : `Student ${payload.studentId} created in database`,
          'success'
        );
        closeRecordModal();
        await loadRecords();
        await fetchHealthAndStats();
      } else if (status === 400 && data.errors) {
        displayFormErrors(data.errors);
        showToast('Please fix the validation errors in the form', 'error');
      } else {
        showToast(data?.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast(`Network error: ${err.message}`, 'error');
    }
  }

  // Delete Record Handling
  function openDeleteModal(id, prn) {
    state.deletingRecord = { id, prn };
    el.deletePrnDisplay.textContent = prn;
    el.deleteModal.classList.remove('hidden');
  }

  function closeDeleteModal() {
    el.deleteModal.classList.add('hidden');
    state.deletingRecord = null;
  }

  async function confirmDeleteRecord() {
    if (!state.deletingRecord) return;
    const { id, prn } = state.deletingRecord;

    try {
      const { ok, data } = await apiRequest(`/api/records/${id}`, {
        method: 'DELETE',
      });

      if (ok && data.success) {
        showToast(`Record ${prn} permanently deleted from database`, 'success');
        closeDeleteModal();
        await loadRecords();
        await fetchHealthAndStats();
      } else {
        showToast(data?.message || 'Failed to delete record', 'error');
      }
    } catch (err) {
      showToast(`Error deleting record: ${err.message}`, 'error');
    }
  }

  // Setup Event Listeners
  function initEventListeners() {
    // Inspector Toggle
    el.btnToggleInspector.addEventListener('click', () => {
      state.isInspectorOpen = !state.isInspectorOpen;
      el.workspaceGrid.classList.toggle('with-inspector', state.isInspectorOpen);
      el.inspectorDrawer.classList.toggle('hidden', !state.isInspectorOpen);
    });

    el.btnCloseInspector.addEventListener('click', () => {
      state.isInspectorOpen = false;
      el.workspaceGrid.classList.remove('with-inspector');
      el.inspectorDrawer.classList.add('hidden');
    });

    // Seed Data
    el.btnSeedData.addEventListener('click', async () => {
      if (confirm('Reset and re-seed database with benchmark student records?')) {
        const { ok, data } = await apiRequest('/api/records/seed', { method: 'POST' });
        if (ok && data.success) {
          showToast(`Database seeded with ${data.count} student records!`, 'success');
          await loadRecords();
          await fetchHealthAndStats();
        }
      }
    });

    // Quick Test Endpoint Chips in Inspector
    document.querySelectorAll('.btn-chip').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const api = btn.dataset.api;
        if (api === 'health') await apiRequest('/api/health');
        else if (api === 'stats') await apiRequest('/api/stats');
        else if (api === 'records') await apiRequest('/api/records?limit=5');
      });
    });

    // Copy JSON / cURL
    el.btnCopyJson.addEventListener('click', () => {
      const code = el.jsonViewer.textContent;
      navigator.clipboard.writeText(code);
      showToast('JSON payload copied to clipboard');
    });

    el.btnCopyCurl.addEventListener('click', () => {
      const code = el.curlViewer.textContent;
      navigator.clipboard.writeText(code);
      showToast('cURL command copied to clipboard');
    });

    // Search Input with Debounce
    el.searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      el.searchClear.classList.toggle('hidden', val.length === 0);
      clearTimeout(state.searchDebounceTimer);
      state.searchDebounceTimer = setTimeout(() => {
        state.filters.search = val;
        state.filters.page = 1;
        loadRecords();
      }, 200);
    });

    el.searchClear.addEventListener('click', () => {
      el.searchInput.value = '';
      el.searchClear.classList.add('hidden');
      state.filters.search = '';
      state.filters.page = 1;
      loadRecords();
    });

    // Department Filter
    el.filterDept.addEventListener('change', (e) => {
      state.filters.department = e.target.value;
      state.filters.page = 1;
      loadRecords();
    });

    // Status Filter
    el.filterStatus.addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      state.filters.page = 1;
      loadRecords();
    });

    // Sort By Column
    el.sortBy.addEventListener('change', (e) => {
      state.filters.sortBy = e.target.value;
      loadRecords();
    });

    // Sort Order Toggle
    el.sortOrderBtn.addEventListener('click', () => {
      state.filters.order = state.filters.order === 'asc' ? 'desc' : 'asc';
      el.sortOrderText.textContent = state.filters.order === 'asc' ? 'Asc' : 'Desc';
      loadRecords();
    });

    // Pagination Controls
    el.btnPrevPage.addEventListener('click', () => {
      if (state.filters.page > 1) {
        state.filters.page--;
        loadRecords();
      }
    });

    el.btnNextPage.addEventListener('click', () => {
      if (state.filters.page < state.meta.totalPages) {
        state.filters.page++;
        loadRecords();
      }
    });

    // Table Actions (Delegated)
    el.recordsTbody.addEventListener('click', async (e) => {
      const viewBtn = e.target.closest('.btn-view');
      const editBtn = e.target.closest('.btn-edit');
      const deleteBtn = e.target.closest('.btn-delete');

      if (viewBtn) {
        const id = viewBtn.dataset.id;
        state.isInspectorOpen = true;
        el.workspaceGrid.classList.add('with-inspector');
        el.inspectorDrawer.classList.remove('hidden');
        await apiRequest(`/api/records/${id}`);
      } else if (editBtn) {
        const id = editBtn.dataset.id;
        const record = state.records.find((r) => r._id === id);
        if (record) openRecordModal(record);
      } else if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        const prn = deleteBtn.dataset.prn;
        openDeleteModal(id, prn);
      }
    });

    // Modals
    el.btnOpenCreateModal.addEventListener('click', () => openRecordModal(null));
    el.btnCancelModal.addEventListener('click', closeRecordModal);
    el.btnCloseModal.addEventListener('click', closeRecordModal);
    el.recordForm.addEventListener('submit', handleFormSubmit);

    el.btnCancelDelete.addEventListener('click', closeDeleteModal);
    el.btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
    el.btnConfirmDelete.addEventListener('click', confirmDeleteRecord);

    // Keyboard Shortcuts (Esc to close modal)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!el.recordModal.classList.contains('hidden')) closeRecordModal();
        if (!el.deleteModal.classList.contains('hidden')) closeDeleteModal();
      }
    });
  }

  // Boot Application
  async function init() {
    initEventListeners();
    await fetchHealthAndStats();
    await loadRecords();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
