/**
 * Student Records Registry — RESTful API Console Frontend (Redesigned)
 * Pure Vanilla JavaScript (ES6+) | Impeccable Operate Mode
 * Author: Aadesh Khande (PRN: 202401100090)
 */

(() => {
  // Application State
  const state = {
    records: [],
    meta: { total: 0, page: 1, limit: 15, totalPages: 1 },
    stats: { total: 0, avgCgpa: 0, byDepartment: [], byStatus: [] },
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
    activeInspectorTab: 'response',
    searchDebounceTimer: null,
    isCompactDensity: true,
  };

  // DOM Elements Cache
  const el = {
    // Telemetry & Metrics
    dbPip: document.getElementById('db-pip'),
    dbStatusText: document.getElementById('db-status-text'),
    telemetryPing: document.getElementById('telemetry-ping'),
    statTotalRecords: document.getElementById('stat-total-records'),
    statActiveSub: document.getElementById('stat-active-sub'),
    statAvgCgpa: document.getElementById('stat-avg-cgpa'),
    statHonorsSub: document.getElementById('stat-honors-sub'),
    statTopDept: document.getElementById('stat-top-dept'),
    statDeptSub: document.getElementById('stat-dept-sub'),
    statDbMode: document.getElementById('stat-db-mode'),
    
    // Header Actions
    btnShortcuts: document.getElementById('btn-shortcuts'),
    btnToggleInspector: document.getElementById('btn-toggle-inspector'),
    btnSeedData: document.getElementById('btn-seed-data'),
    btnOpenCreateModal: document.getElementById('btn-open-create-modal'),

    // Chips Nav
    deptChipsList: document.getElementById('dept-chips-list'),
    chipCountAll: document.getElementById('chip-count-all'),
    chipCountComp: document.getElementById('chip-count-comp'),
    chipCountIt: document.getElementById('chip-count-it'),
    chipCountAids: document.getElementById('chip-count-aids'),
    chipCountEntc: document.getElementById('chip-count-entc'),
    chipCountMech: document.getElementById('chip-count-mech'),

    // Toolbar
    searchInput: document.getElementById('search-input'),
    searchClear: document.getElementById('search-clear'),
    filterStatus: document.getElementById('filter-status'),
    sortBy: document.getElementById('sort-by'),
    sortOrderBtn: document.getElementById('sort-order-btn'),
    sortOrderText: document.getElementById('sort-order-text'),
    densityBtn: document.getElementById('density-btn'),
    densityText: document.getElementById('density-text'),
    btnExportJson: document.getElementById('btn-export-json'),

    // Table
    recordsTable: document.getElementById('records-table'),
    recordsTbody: document.getElementById('records-tbody'),
    recordMetaCount: document.getElementById('record-meta-count'),
    metaFilterIndicator: document.getElementById('meta-filter-indicator'),
    currentPage: document.getElementById('current-page'),
    totalPages: document.getElementById('total-pages'),
    footerTotalCount: document.getElementById('footer-total-count'),
    pageIndicator: document.getElementById('page-indicator'),
    btnPrevPage: document.getElementById('btn-prev-page'),
    btnNextPage: document.getElementById('btn-next-page'),

    // Workspace & Inspector
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

    // Shortcuts Modal
    shortcutsModal: document.getElementById('shortcuts-modal'),
    btnCloseShortcutsModal: document.getElementById('btn-close-shortcuts-modal'),
    btnDismissShortcuts: document.getElementById('btn-dismiss-shortcuts'),

    // Toast Container
    toastContainer: document.getElementById('toast-container'),
  };

  // Helper: Get Initials from Name
  function getInitials(name = '') {
    const parts = name.trim().split(/\s+/);
    if (!parts.length) return 'ST';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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

  // API Client with Timing & Inspector Logging
  async function apiRequest(endpoint, options = {}) {
    const startTime = performance.now();
    const method = options.method || 'GET';
    const baseUrl = window.location.origin;

    let curlCmd = `curl -X ${method} "${baseUrl}${endpoint}" -H "Accept: application/json"`;
    if (options.body) {
      curlCmd = `curl -X ${method} "${baseUrl}${endpoint}" \\\n  -H "Content-Type: application/json" \\\n  -d '${options.body}'`;
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
      el.telemetryPing.textContent = `${latency} ms`;

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
      el.telemetryPing.textContent = `Error`;
      updateInspector({
        method,
        endpoint,
        status: 0,
        statusText: 'Network / Connection Error',
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

  // Switch Inspector Tabs
  function setInspectorTab(tabName) {
    state.activeInspectorTab = tabName;
    document.querySelectorAll('.inspector-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    document.getElementById('tab-content-response').classList.toggle('hidden', tabName !== 'response');
    document.getElementById('tab-content-curl').classList.toggle('hidden', tabName !== 'curl');
    document.getElementById('tab-content-console').classList.toggle('hidden', tabName !== 'console');
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
        el.statDbMode.textContent = mode;
      } else {
        el.dbPip.className = 'status-pip warning';
        el.dbStatusText.textContent = 'DB: Standalone';
        el.statDbMode.textContent = 'Standalone Virtual';
      }

      if (statsRes && statsRes.success) {
        state.stats = statsRes.data;
        updateMetricStrip(statsRes.data);
      }
    } catch {
      el.dbPip.className = 'status-pip warning';
      el.dbStatusText.textContent = 'DB: Local';
    }
  }

  // Update Metric Overview Strip
  function updateMetricStrip(stats) {
    const total = stats.total || 0;
    const avgCgpa = stats.avgCgpa ? stats.avgCgpa.toFixed(2) : '0.00';
    el.statTotalRecords.textContent = total;
    el.statAvgCgpa.textContent = avgCgpa;

    // Active status count
    const activeEntry = (stats.byStatus || []).find((s) => s._id === 'Active');
    const activeCount = activeEntry ? activeEntry.count : 0;
    el.statActiveSub.textContent = `${activeCount} Active / ${total - activeCount} Other`;

    // Top Department
    if (stats.byDepartment && stats.byDepartment.length) {
      const sortedDepts = [...stats.byDepartment].sort((a, b) => b.count - a.count);
      const top = sortedDepts[0];
      el.statTopDept.textContent = top._id.replace(' Engineering', ' Engg');
      const pct = Math.round((top.count / total) * 100);
      el.statDeptSub.textContent = `${top.count} students (${pct}%)`;

      // Update Department chip count badges
      updateChipBadges(stats.byDepartment, total);
    } else {
      el.statTopDept.textContent = 'General';
      el.statDeptSub.textContent = 'None enrolled';
    }
  }

  // Update Department Chip Badges
  function updateChipBadges(byDept, total) {
    el.chipCountAll.textContent = total;

    const map = {};
    byDept.forEach((d) => (map[d._id] = d.count));

    el.chipCountComp.textContent = map['Computer Engineering'] || 0;
    el.chipCountIt.textContent = map['Information Technology'] || 0;
    el.chipCountAids.textContent = map['AI & Data Science'] || 0;
    el.chipCountEntc.textContent = map['Electronics & Telecommunication'] || 0;
    el.chipCountMech.textContent = map['Mechanical Engineering'] || 0;
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

    renderSkeletonRows();

    // Update filter indicator badge
    let activeFilters = [];
    if (state.filters.search) activeFilters.push(`"${state.filters.search}"`);
    if (state.filters.department !== 'All') activeFilters.push(state.filters.department);
    if (state.filters.status !== 'All') activeFilters.push(state.filters.status);
    el.metaFilterIndicator.textContent = activeFilters.length ? `Filtered: ${activeFilters.join(', ')}` : 'Filtered: None';

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

  // Render Shimmer Skeleton Rows while loading
  function renderSkeletonRows() {
    el.recordsTbody.innerHTML = Array(4)
      .fill(0)
      .map(
        () => `
        <tr class="skeleton-row">
          <td><div class="skeleton-box" style="width: 100px;"></div></td>
          <td><div class="skeleton-box" style="width: 180px;"></div></td>
          <td><div class="skeleton-box" style="width: 120px;"></div></td>
          <td><div class="skeleton-box" style="width: 40px;"></div></td>
          <td><div class="skeleton-box" style="width: 50px;"></div></td>
          <td><div class="skeleton-box" style="width: 70px;"></div></td>
          <td><div class="skeleton-box" style="width: 130px;"></div></td>
          <td><div class="skeleton-box" style="width: 110px;"></div></td>
        </tr>
      `
      )
      .join('');
  }

  // Render Table Rows
  function renderRecords() {
    const { records, meta } = state;

    el.recordMetaCount.textContent = `Showing ${records.length} of ${meta.total} records`;
    el.currentPage.textContent = meta.page;
    el.totalPages.textContent = meta.totalPages || 1;
    el.footerTotalCount.textContent = meta.total;
    el.pageIndicator.textContent = `${meta.page} / ${meta.totalPages || 1}`;
    el.btnPrevPage.disabled = meta.page <= 1;
    el.btnNextPage.disabled = meta.page >= meta.totalPages;

    // Count honors (≥ 9.0) in loaded records
    const honorsCount = records.filter(r => (Number(r.cgpa) || 0) >= 9.0).length;
    el.statHonorsSub.textContent = `${honorsCount} Honors (≥9.0)`;

    if (!records || records.length === 0) {
      el.recordsTbody.innerHTML = `
        <tr>
          <td colspan="8" class="td-empty">
            <div style="font-weight: 600; margin-bottom: 0.25rem;">No matching student records found</div>
            <div class="text-secondary" style="margin-bottom: 0.75rem;">Adjust your search or active department filters to view records.</div>
            <div>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-filters">Reset Filters</button>
              <button type="button" class="btn btn-primary btn-sm" id="btn-empty-seed" style="margin-left: 0.5rem;">Seed Sample Students</button>
            </div>
          </td>
        </tr>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
      const emptySeedBtn = document.getElementById('btn-empty-seed');
      if (emptySeedBtn) emptySeedBtn.addEventListener('click', seedSampleData);
      return;
    }

    el.recordsTbody.innerHTML = records
      .map((r) => {
        const statusClass = (r.enrollmentStatus || 'Active').toLowerCase().replace(/\s+/g, '-');
        const cgpaVal = Number(r.cgpa || 0);
        const isHonors = cgpaVal >= 9.0;
        const initials = getInitials(r.fullName);

        const courses = Array.isArray(r.courses) && r.courses.length
          ? r.courses.map((c) => `<span class="course-tag">${escapeHtml(c)}</span>`).join('')
          : '<span class="text-muted">None</span>';

        return `
          <tr data-id="${r._id || r.studentId}">
            <td class="prn-cell font-mono">
              <div class="prn-cell-wrap">
                <span>${escapeHtml(r.studentId)}</span>
                <button type="button" class="btn-copy-prn" title="Copy PRN" data-prn="${r.studentId}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </td>
            <td>
              <div class="student-info-cell">
                <div class="student-avatar">${initials}</div>
                <div class="student-meta">
                  <span class="student-name">${escapeHtml(r.fullName)}</span>
                  <span class="student-email">${escapeHtml(r.email)}</span>
                </div>
              </div>
            </td>
            <td><span class="badge-dept">${escapeHtml(r.department)}</span></td>
            <td class="font-mono">Sem ${r.semester}</td>
            <td>
              <div class="cgpa-cell">
                <span class="badge-cgpa ${isHonors ? 'honors' : ''}">${cgpaVal.toFixed(2)}</span>
              </div>
            </td>
            <td><span class="badge-status ${statusClass}">${escapeHtml(r.enrollmentStatus || 'Active')}</span></td>
            <td><div class="courses-pills">${courses}</div></td>
            <td class="td-actions">
              <button type="button" class="table-action-btn btn-view" title="Inspect Record in JSON Console" data-id="${r._id}">Inspect</button>
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
    el.filterStatus.value = 'All';

    // Update active chip
    document.querySelectorAll('.chip-item').forEach((c) => {
      c.classList.toggle('active', c.dataset.dept === 'All');
    });

    loadRecords();
  }

  // Seed sample data helper
  async function seedSampleData() {
    const { ok, data } = await apiRequest('/api/records/seed', { method: 'POST' });
    if (ok && data.success) {
      showToast(`Database seeded with ${data.count} student records!`, 'success');
      await loadRecords();
      await fetchHealthAndStats();
    }
  }

  // Export current records as JSON download
  function exportRecordsAsJson() {
    const jsonStr = JSON.stringify(state.records, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-records-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${state.records.length} records to JSON`);
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
            ? `Record ${payload.studentId} updated successfully`
            : `Record ${payload.studentId} created in database`,
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

  // Shortcuts Modal
  function openShortcutsModal() {
    el.shortcutsModal.classList.remove('hidden');
  }

  function closeShortcutsModal() {
    el.shortcutsModal.classList.add('hidden');
  }

  // Setup Event Listeners
  function initEventListeners() {
    // Shortcuts Modal
    el.btnShortcuts.addEventListener('click', openShortcutsModal);
    el.btnCloseShortcutsModal.addEventListener('click', closeShortcutsModal);
    el.btnDismissShortcuts.addEventListener('click', closeShortcutsModal);

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

    // Inspector Tab Switching
    document.querySelectorAll('.inspector-tab').forEach((tab) => {
      tab.addEventListener('click', () => setInspectorTab(tab.dataset.tab));
    });

    // Seed Data Action
    el.btnSeedData.addEventListener('click', async () => {
      if (confirm('Re-seed database with benchmark student academic records?')) {
        await seedSampleData();
      }
    });

    // Console REST Buttons
    document.querySelectorAll('.btn-console-call').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const api = btn.dataset.api;
        if (api === 'health') await apiRequest('/api/health');
        else if (api === 'stats') await apiRequest('/api/stats');
        else if (api === 'records') await apiRequest('/api/records?limit=5');
        else if (api === 'seed') await seedSampleData();
        setInspectorTab('response');
      });
    });

    // Export JSON
    el.btnExportJson.addEventListener('click', exportRecordsAsJson);

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

    // Density Toggle
    el.densityBtn.addEventListener('click', () => {
      state.isCompactDensity = !state.isCompactDensity;
      el.recordsTable.classList.toggle('compact', state.isCompactDensity);
      el.densityText.textContent = state.isCompactDensity ? 'Compact' : 'Normal';
      showToast(`Table density set to ${state.isCompactDensity ? 'Compact' : 'Normal'}`);
    });

    // Department Quick Chips Filter
    el.deptChipsList.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-item');
      if (!chip) return;

      document.querySelectorAll('.chip-item').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      state.filters.department = chip.dataset.dept;
      state.filters.page = 1;
      loadRecords();
    });

    // Search Input with Debounce & Clear
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
      el.searchInput.focus();
    });

    // Status Filter Dropdown
    el.filterStatus.addEventListener('change', (e) => {
      state.filters.status = e.target.value;
      state.filters.page = 1;
      loadRecords();
    });

    // Sort Column Dropdown
    el.sortBy.addEventListener('change', (e) => {
      state.filters.sortBy = e.target.value;
      loadRecords();
    });

    // Sort Order Toggle Button
    el.sortOrderBtn.addEventListener('click', () => {
      state.filters.order = state.filters.order === 'asc' ? 'desc' : 'asc';
      el.sortOrderText.textContent = state.filters.order === 'asc' ? 'Asc' : 'Desc';
      loadRecords();
    });

    // Pagination
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
      // Copy PRN
      const copyBtn = e.target.closest('.btn-copy-prn');
      if (copyBtn) {
        const prn = copyBtn.dataset.prn;
        navigator.clipboard.writeText(prn);
        showToast(`Copied ${prn} to clipboard`);
        return;
      }

      const viewBtn = e.target.closest('.btn-view');
      const editBtn = e.target.closest('.btn-edit');
      const deleteBtn = e.target.closest('.btn-delete');

      if (viewBtn) {
        const id = viewBtn.dataset.id;
        state.isInspectorOpen = true;
        el.workspaceGrid.classList.add('with-inspector');
        el.inspectorDrawer.classList.remove('hidden');
        setInspectorTab('response');
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

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't trigger hotkeys if typing in an input
      const isInputActive = ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName);

      if (e.key === 'Escape') {
        if (!el.recordModal.classList.contains('hidden')) closeRecordModal();
        else if (!el.deleteModal.classList.contains('hidden')) closeDeleteModal();
        else if (!el.shortcutsModal.classList.contains('hidden')) closeShortcutsModal();
        else if (el.searchInput.value) {
          el.searchInput.value = '';
          el.searchClear.classList.add('hidden');
          state.filters.search = '';
          loadRecords();
        }
        return;
      }

      if (!isInputActive) {
        if (e.key === '/' || (e.metaKey && e.key === 'k')) {
          e.preventDefault();
          el.searchInput.focus();
        } else if (e.key === 'n' || e.key === 'N') {
          e.preventDefault();
          openRecordModal(null);
        } else if (e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          el.btnToggleInspector.click();
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          el.densityBtn.click();
        } else if (e.key === '?') {
          e.preventDefault();
          openShortcutsModal();
        }
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
