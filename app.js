// CIF Canada Work Time Tracker - JavaScript with Password Protection

// Password Configuration
const ADMIN_PASSWORD = '0000';
let isLoggedIn = localStorage.getItem('cifAdminLoggedIn') === 'true';

// Initialize data from localStorage
let workEntries = JSON.parse(localStorage.getItem('cifWorkEntries')) || [];
let selectedEmployee = null;

// Days of the week
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  checkLoginStatus();
  setDefaultWeekStart();
  setLast2WeeksCard();
  loadData();
  updateStatistics();
});

// Check login status
function checkLoginStatus() {
  if (isLoggedIn) {
    document.getElementById('logoutBtn').classList.remove('hidden');
  }
}

// Toggle Admin Panel with Password
function toggleAdminPanel() {
  const panel = document.getElementById('adminPanel');
  
  if (panel.classList.contains('hidden')) {
    if (!isLoggedIn) {
      const password = prompt('🔐 Enter Admin Password:');
      if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        localStorage.setItem('cifAdminLoggedIn', 'true');
        panel.classList.remove('hidden');
        document.getElementById('logoutBtn').classList.remove('hidden');
        alert('✅ Access granted!');
      } else {
        alert('❌ Wrong password!');
      }
    } else {
      panel.classList.remove('hidden');
    }
  } else {
    panel.classList.add('hidden');
  }
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    isLoggedIn = false;
    localStorage.removeItem('cifAdminLoggedIn');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    alert('👋 Logged out successfully!');
  }
}

// Select Employee
function selectEmployee(name) {
  selectedEmployee = name;
  
  document.querySelectorAll('.employee-btn').forEach(btn => {
    if (btn.dataset.employee === name) {
      btn.classList.add('bg-blue-500', 'text-white', 'border-blue-700');
      btn.classList.remove('hover:bg-blue-50');
    } else {
      btn.classList.remove('bg-blue-500', 'text-white', 'border-blue-700');
      btn.classList.add('hover:bg-blue-50');
    }
  });
  
  document.getElementById('selectedEmployeeDisplay').classList.remove('hidden');
  document.getElementById('selectedEmployeeName').textContent = name;
  document.getElementById('saveEmployeeName').textContent = name;
  document.getElementById('weeklyTimeEntry').classList.remove('hidden');
}

// Set default week start (current Monday)
function setDefaultWeekStart() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  
  document.getElementById('weekStartDate').value = monday.toISOString().split('T')[0];
  updateWeekDates();
}

// Update week dates based on selected Monday
function updateWeekDates() {
  const startDate = new Date(document.getElementById('weekStartDate').value + 'T00:00:00');
  
  daysOfWeek.forEach((day, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    document.getElementById(`date${day}`).textContent = dateStr;
  });
}

// Set last 2 weeks for stats card
function setLast2WeeksCard() {
  const today = new Date();
  const lastMonday = new Date(today);
  const day = lastMonday.getDay();
  const diff = lastMonday.getDate() - day + (day === 0 ? -6 : 1);
  lastMonday.setDate(diff - 7);
  
  document.getElementById('twoWeekStartCard').value = lastMonday.toISOString().split('T')[0];
  calculate2WeekStatsCard();
}

// Calculate 2-week statistics for the card
function calculate2WeekStatsCard() {
  const startDateStr = document.getElementById('twoWeekStartCard').value;
  
  if (!startDateStr) {
    return;
  }
  
  const startDate = new Date(startDateStr + 'T00:00:00');
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 13);
  
  const startDateOnly = startDateStr;
  const endDateStr = endDate.toISOString().split('T')[0];
  
  const twoWeekEntries = workEntries.filter(entry => {
    return entry.date >= startDateOnly && entry.date <= endDateStr;
  });
  
  const totalHours = twoWeekEntries.reduce((sum, entry) => sum + entry.hours, 0);
  
  document.getElementById('total2WeekHoursCard').textContent = totalHours.toFixed(2);
  
  const startFormatted = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endFormatted = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  document.getElementById('dateRangeDisplay').textContent = `${startFormatted} - ${endFormatted}`;
  
  const employees = ['Ali Hojeij', 'Layla', 'Ali Fadlallah', 'Khodor', 'Hadi', 'Ali Moussa'];
  const breakdownDiv = document.getElementById('employeeBreakdownCard');
  
  const breakdownHTML = employees.map(emp => {
    const empEntries = twoWeekEntries.filter(e => e.employee === emp);
    const empHours = empEntries.reduce((sum, e) => sum + e.hours, 0);
    const daysWorked = empEntries.length;
    
    return `
      <div class="bg-blue-50 rounded p-2 border border-blue-200">
        <p class="text-xs font-semibold text-gray-700">${emp}</p>
        <p class="text-lg font-bold text-blue-600">${empHours.toFixed(1)}h</p>
        <p class="text-xs text-gray-500">${daysWorked} days</p>
      </div>
    `;
  }).join('');
  
  breakdownDiv.innerHTML = breakdownHTML;
}

// Add weekly entry for selected employee
function addWeeklyEntry() {
  if (!selectedEmployee) {
    alert('⚠️ Please select an employee first!');
    return;
  }

  const startDate = new Date(document.getElementById('weekStartDate').value + 'T00:00:00');
  const project = document.getElementById('projectName').value;
  const notes = document.getElementById('notes').value;
  
  let entriesAdded = 0;
  let totalHours = 0;

  daysOfWeek.forEach((day, index) => {
    const startTime = document.getElementById(`start${day}`).value;
    const endTime = document.getElementById(`end${day}`).value;
    const pause = parseInt(document.getElementById(`pause${day}`).value) || 0;

    if (startTime && endTime) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];

      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffMinutes = (end - start) / 1000 / 60 - pause;
      const hours = (diffMinutes / 60).toFixed(2);

      if (diffMinutes > 0) {
        const entry = {
          id: Date.now() + index,
          employee: selectedEmployee,
          date: dateStr,
          startTime: startTime,
          endTime: endTime,
          pause: pause,
          hours: parseFloat(hours),
          project: project,
          notes: notes,
          timestamp: new Date().toISOString()
        };

        workEntries.push(entry);
        entriesAdded++;
        totalHours += parseFloat(hours);
      }
    }
  });

  if (entriesAdded === 0) {
    alert('⚠️ Please enter at least one day with start and end times!');
    return;
  }

  saveData();
  loadData();
  updateStatistics();
  calculate2WeekStatsCard();
  clearWeekForm();
  
  alert(`✅ ${entriesAdded} entries added for ${selectedEmployee}!\nTotal hours: ${totalHours.toFixed(2)}h`);
}

// Clear week form
function clearWeekForm() {
  daysOfWeek.forEach(day => {
    document.getElementById(`start${day}`).value = '';
    document.getElementById(`end${day}`).value = '';
    document.getElementById(`pause${day}`).value = '';
  });
  document.getElementById('projectName').value = '';
  document.getElementById('notes').value = '';
}

// Save data to localStorage
function saveData() {
  localStorage.setItem('cifWorkEntries', JSON.stringify(workEntries));
}

// Load and display data
function loadData() {
  const tbody = document.getElementById('entriesTable');
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
  if (!isLoggedIn) {
    alert('⚠️ Please login as admin to delete entries!');
    return;
  }
  
  if (confirm('Are you sure you want to delete this entry?')) {
    workEntries = workEntries.filter(e => e.id !== id);
    saveData();
    loadData();
    updateStatistics();
    calculate2WeekStatsCard();
    alert('✅ Entry deleted!');
  }
}

// Update statistics
function updateStatistics(data = workEntries) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthHours = data
    .filter(e => new Date(e.date) >= startOfMonth)
    .reduce((sum, e) => sum + e.hours, 0);

  document.getElementById('totalMonthHours').textContent = monthHours.toFixed(2);

  updateEmployeeSummary(data);
}

// Update employee summary
function updateEmployeeSummary(data = workEntries) {
  const employees = ['Ali Hojeij', 'Layla', 'Ali Fadlallah', 'Khodor', 'Hadi', 'Ali Moussa'];
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
  const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
  return date.toLocaleDateString('en-US', options);
}

// Export data as JSON
function exportData() {
  if (!isLoggedIn) {
    alert('⚠️ Please login as admin to export data!');
    return;
  }
  
  const dataStr = JSON.stringify(workEntries, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cif-canada-work-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  alert('✅ Data exported successfully!');
}

// Download Weekly Report
function downloadWeeklyReport() {
  if (!isLoggedIn) {
    alert('⚠️ Please login as admin to download reports!');
    return;
  }
  
  // Ask for week start date
  const weekStart = prompt('Enter week start date (YYYY-MM-DD):\nExample: 2025-01-06');
  
  if (!weekStart) {
    return;
  }
  
  const startDate = new Date(weekStart + 'T00:00:00');
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // 7 days (Mon-Sun)
  
  const startDateStr = weekStart;
  const endDateStr = endDate.toISOString().split('T')[0];
  
  // Filter entries for this week
  const weekEntries = workEntries.filter(entry => {
    return entry.date >= startDateStr && entry.date <= endDateStr;
  });
  
  if (weekEntries.length === 0) {
    alert('❌ No entries found for this week!');
    return;
  }
  
  // Generate HTML report
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CIF Canada - Weekly Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      background: #f5f5f5;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      background: #1e3a8a;
      color: white;
      padding: 20px;
      border-radius: 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .header p {
      margin: 5px 0 0 0;
      opacity: 0.9;
    }
    .summary {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary h2 {
      margin-top: 0;
      color: #1e3a8a;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    .summary-card {
      background: #eff6ff;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #3b82f6;
    }
    .summary-card h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #1e40af;
      text-transform: uppercase;
    }
    .summary-card .value {
      font-size: 24px;
      font-weight: bold;
      color: #1e3a8a;
    }
    .employee-section {
      background: white;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .employee-section h2 {
      margin-top: 0;
      color: #1e3a8a;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th {
      background: #1e3a8a;
      color: white;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:hover {
      background: #f9fafb;
    }
    .total-row {
      font-weight: bold;
      background: #eff6ff;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #6b7280;
      font-size: 12px;
    }
    @media print {
      body {
        margin: 0;
        background: white;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏢 CIF Canada</h1>
    <p>Weekly Work Report</p>
    <p>${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
  </div>
  
  <div class="summary">
    <h2>📊 Week Summary</h2>
    <div class="summary-grid">
`;
  
  // Calculate totals per employee
  const employees = ['Ali Hojeij', 'Layla', 'Ali Fadlallah', 'Khodor', 'Hadi', 'Ali Moussa'];
  const employeeData = {};
  let grandTotal = 0;
  
  employees.forEach(emp => {
    const empEntries = weekEntries.filter(e => e.employee === emp);
    const totalHours = empEntries.reduce((sum, e) => sum + e.hours, 0);
    employeeData[emp] = {
      entries: empEntries,
      total: totalHours,
      days: empEntries.length
    };
    grandTotal += totalHours;
  });
  
  // Add summary cards
  html += `
      <div class="summary-card">
        <h3>Total Hours (All Employees)</h3>
        <div class="value">${grandTotal.toFixed(2)}h</div>
      </div>
      <div class="summary-card">
        <h3>Total Days Worked</h3>
        <div class="value">${weekEntries.length}</div>
      </div>
      <div class="summary-card">
        <h3>Average Hours/Employee</h3>
        <div class="value">${(grandTotal / employees.length).toFixed(2)}h</div>
      </div>
    </div>
  </div>
`;
  
  // Add employee sections
  employees.forEach(emp => {
    const data = employeeData[emp];
    
    html += `
  <div class="employee-section">
    <h2>👤 ${emp}</h2>
    <p><strong>Total Hours:</strong> ${data.total.toFixed(2)}h | <strong>Days Worked:</strong> ${data.days}</p>
`;
    
    if (data.entries.length > 0) {
      html += `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Day</th>
          <th>Start</th>
          <th>End</th>
          <th>Pause</th>
          <th>Hours</th>
          <th>Project</th>
        </tr>
      </thead>
      <tbody>
`;
      
      data.entries.forEach(entry => {
        const date = new Date(entry.date + 'T00:00:00');
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        html += `
        <tr>
          <td>${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
          <td>${dayName}</td>
          <td>${entry.startTime}</td>
          <td>${entry.endTime}</td>
          <td>${entry.pause} min</td>
          <td><strong>${entry.hours.toFixed(2)}h</strong></td>
          <td>${entry.project || '-'}</td>
        </tr>
`;
      });
      
      html += `
        <tr class="total-row">
          <td colspan="5">TOTAL</td>
          <td><strong>${data.total.toFixed(2)}h</strong></td>
          <td></td>
        </tr>
      </tbody>
    </table>
`;
    } else {
      html += `<p style="color: #6b7280;">No entries for this week.</p>`;
    }
    
    html += `
  </div>
`;
  });
  
  html += `
  <div class="footer">
    <p>Generated: ${new Date().toLocaleString('en-US')}</p>
    <p>CIF Canada © 2025 - Work Time Tracking System</p>
  </div>
  
  <div class="no-print" style="text-align: center; margin: 30px 0;">
    <button onclick="window.print()" style="background: #1e3a8a; color: white; padding: 15px 30px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
      🖨️ Print Report
    </button>
  </div>
</body>
</html>
`;
  
  // Create and download HTML file
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CIF-Canada-Weekly-Report-${weekStart}.html`;
  link.click();
  URL.revokeObjectURL(url);
  
  alert('✅ Weekly report downloaded!\n\nOpen the HTML file in your browser to view and print.');
}

// Clear all data
function clearAllData() {
  if (!isLoggedIn) {
    alert('⚠️ Please login as admin to clear data!');
    return;
  }
  
  if (confirm('⚠️ Are you SURE you want to delete ALL work entries? This cannot be undone!')) {
    if (confirm('⚠️ FINAL WARNING: This will permanently delete all data!')) {
      workEntries = [];
      saveData();
      loadData();
      updateStatistics();
      calculate2WeekStatsCard();
      alert('✅ All data cleared!');
    }
  }
}
