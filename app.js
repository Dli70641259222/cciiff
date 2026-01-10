// CIF Canada Work Time Tracker - JavaScript

// Initialize data from localStorage
let workEntries = JSON.parse(localStorage.getItem('cifWorkEntries')) || [];

// Set today's date by default
document.addEventListener('DOMContentLoaded', function() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('workDate').value = today;
  loadData();
  updateStatistics();
});

// Toggle Admin Panel
function toggleAdminPanel() {
  const panel = document.getElementById('adminPanel');
  panel.classList.toggle('hidden');
}

// Add new work entry
function addEntry() {
  const employee = document.getElementById('employeeName').value;
  const date = document.getElementById('workDate').value;
  const startTime = document.getElementById('startTime').value;
  const endTime = document.getElementById('endTime').value;
  const pause = parseInt(document.getElementById('pauseTime').value) || 0;
  const project = document.getElementById('projectName').value;
  const notes = document.getElementById('notes').value;

  // Validation
  if (!date || !startTime || !endTime) {
    alert('⚠️ Please fill in Date, Start Time, and End Time!');
    return;
  }

  // Calculate hours worked
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMinutes = (end - start) / 1000 / 60 - pause;
  const hours = (diffMinutes / 60).toFixed(2);

  if (diffMinutes < 0) {
    alert('⚠️ End time must be after start time!');
    return;
  }

  // Create entry
  const entry = {
    id: Date.now(),
    employee: employee,
    date: date,
    startTime: startTime,
    endTime: endTime,
    pause: pause,
    hours: parseFloat(hours),
    project: project,
    notes: notes,
    timestamp: new Date().toISOString()
  };

  // Add to array
  workEntries.push(entry);
  
  // Save to localStorage
  saveData();
  
  // Reload display
  loadData();
  updateStatistics();
  
  // Clear form
  clearForm();
  
  alert('✅ Entry added successfully!');
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('cifWorkEntries', JSON.stringify(workEntries));
}

// Load and display data
function loadData() {
  const tbody = document.getElementById('entriesTable');
  
  // Sort by date (newest first)
  const sorted = [...workEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-8 text-center text-gray-500">No entries yet. Add your first work entry!</td></tr>';
    return;
  }

  tbody.innerHTML = sorted.map(entry => `
    <tr class="hover:bg-gray-50 fade-in">
      <td class="px-6 py-4 whitespace-nowrap text-sm">${formatDate(entry.date)}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          ${entry.employee}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">${entry.startTime}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">${entry.endTime}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">${entry.pause} min</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          ${entry.hours}h
        </span>
      </td>
      <td class="px-6 py-4 text-sm">${entry.project || '-'}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${entry.notes || '-'}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="deleteEntry(${entry.id})" class="text-red-600 hover:text-red-800 font-semibold">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');
}

// Filter data
function filterData() {
  const filterEmp = document.getElementById('filterEmployee').value;
  const filterFrom = document.getElementById('filterFromDate').value;
  const filterTo = document.getElementById('filterToDate').value;

  let filtered = workEntries;

  if (filterEmp) {
    filtered = filtered.filter(e => e.employee === filterEmp);
  }

  if (filterFrom) {
    filtered = filtered.filter(e => e.date >= filterFrom);
  }

  if (filterTo) {
    filtered = filtered.filter(e => e.date <= filterTo);
  }

  // Display filtered data
  const tbody = document.getElementById('entriesTable');
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="px-6 py-8 text-center text-gray-500">No entries match your filters.</td></tr>';
    return;
  }

  tbody.innerHTML = sorted.map(entry => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap text-sm">${formatDate(entry.date)}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          ${entry.employee}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">${entry.startTime}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">${entry.endTime}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">${entry.pause} min</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          ${entry.hours}h
        </span>
      </td>
      <td class="px-6 py-4 text-sm">${entry.project || '-'}</td>
      <td class="px-6 py-4 text-sm text-gray-600">${entry.notes || '-'}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="deleteEntry(${entry.id})" class="text-red-600 hover:text-red-800 font-semibold">
          🗑️
        </button>
      </td>
    </tr>
  `).join('');

  updateStatistics(filtered);
}

// Reset filters
function resetFilters() {
  document.getElementById('filterEmployee').value = '';
  document.getElementById('filterFromDate').value = '';
  document.getElementById('filterToDate').value = '';
  loadData();
  updateStatistics();
}

// Delete entry
function deleteEntry(id) {
  if (confirm('Are you sure you want to delete this entry?')) {
    workEntries = workEntries.filter(e => e.id !== id);
    saveData();
    loadData();
    updateStatistics();
    alert('✅ Entry deleted!');
  }
}

// Clear form
function clearForm() {
  document.getElementById('startTime').value = '';
  document.getElementById('endTime').value = '';
  document.getElementById('pauseTime').value = '';
  document.getElementById('projectName').value = '';
  document.getElementById('notes').value = '';
}

// Update statistics
function updateStatistics(data = workEntries) {
  const now = new Date();
  
  // Get start of this week (Monday)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Get start of this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Calculate totals
  const weekHours = data
    .filter(e => new Date(e.date) >= startOfWeek)
    .reduce((sum, e) => sum + e.hours, 0);

  const monthHours = data
    .filter(e => new Date(e.date) >= startOfMonth)
    .reduce((sum, e) => sum + e.hours, 0);

  document.getElementById('totalWeekHours').textContent = weekHours.toFixed(2);
  document.getElementById('totalMonthHours').textContent = monthHours.toFixed(2);

  // Update employee summary
  updateEmployeeSummary(data);
}

// Update employee summary
function updateEmployeeSummary(data = workEntries) {
  const employees = ['Ali', 'Layla', 'Ali Fadlallah', 'Khodor', 'Hadi', 'Manager'];
  const summary = document.getElementById('employeeSummary');

  const summaryHTML = employees.map(emp => {
    const empEntries = data.filter(e => e.employee === emp);
    const totalHours = empEntries.reduce((sum, e) => sum + e.hours, 0);
    const entryCount = empEntries.length;

    return `
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <h3 class="font-bold text-lg text-blue-900">${emp}</h3>
        <div class="mt-2 space-y-1">
          <p class="text-sm text-gray-700">Total Hours: <span class="font-bold text-blue-600">${totalHours.toFixed(2)}h</span></p>
          <p class="text-sm text-gray-700">Entries: <span class="font-bold">${entryCount}</span></p>
        </div>
      </div>
    `;
  }).join('');

  summary.innerHTML = summaryHTML;
}

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Export data as JSON
function exportData() {
  const dataStr = JSON.stringify(workEntries, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cif-canada-work-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  alert('✅ Data exported successfully!');
}

// Clear all data
function clearAllData() {
  if (confirm('⚠️ Are you SURE you want to delete ALL work entries? This cannot be undone!')) {
    if (confirm('⚠️ FINAL WARNING: This will permanently delete all data!')) {
      workEntries = [];
      saveData();
      loadData();
      updateStatistics();
      alert('✅ All data cleared!');
    }
  }
}
