# 🏢 CIF Canada - Work Time Tracker

Live employee work time tracking system for CIF Canada with real-time updates on GitHub Pages.

## 🌟 Features

✅ **Real-time tracking** - Add work entries instantly
✅ **6 Employees** - Ali, Layla, Ali Fadlallah, Khodor, Hadi, Manager
✅ **Automatic calculations** - Hours worked, weekly/monthly totals
✅ **Filter & Search** - By employee, date range
✅ **Statistics Dashboard** - Week/month summaries, employee totals
✅ **Data Export** - Download as JSON
✅ **Responsive Design** - Works on desktop, tablet, mobile
✅ **Always Online** - Hosted on GitHub Pages (free!)
✅ **No Server Needed** - Data stored in browser localStorage

---

## 🚀 Setup on GitHub Pages (5 Minutes)

### Step 1: Create GitHub Repository

1. **Go to GitHub.com** and login
2. Click **"New Repository"** (green button)
3. Repository settings:
   - Name: `cif-canada-tracker` (or any name you want)
   - Description: `CIF Canada Work Time Tracker`
   - ✅ Public
   - ✅ Add a README file
4. Click **"Create repository"**

### Step 2: Upload Files

1. In your new repository, click **"Add file"** → **"Upload files"**
2. Drag and drop these files:
   - `index.html`
   - `app.js`
3. Click **"Commit changes"**

### Step 3: Enable GitHub Pages

1. Go to repository **Settings**
2. Scroll down to **"Pages"** (left sidebar)
3. Under **"Source"**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **"Save"**
5. Wait 1-2 minutes

### Step 4: Access Your Site

Your site will be live at:
```
https://YOUR-USERNAME.github.io/cif-canada-tracker/
```

Example:
```
https://johnsmith.github.io/cif-canada-tracker/
```

**Done!** 🎉

---

## 📖 How to Use

### Adding Work Entries:

1. **Open your site** (the GitHub Pages URL)
2. Click **"🔐 Admin Panel"** button
3. Fill in the form:
   - Employee: Select name
   - Date: Pick date
   - Start Time: e.g., 09:00
   - End Time: e.g., 17:00
   - Pause: e.g., 30 (minutes)
   - Project: Optional
   - Notes: Optional
4. Click **"➕ Add Entry"**
5. Entry appears in table below!

### Viewing Data:

- **All entries** shown in table
- **Filter by employee** using dropdown
- **Filter by date range** using date pickers
- **See statistics** in cards at top
- **View employee summaries** at bottom

### Managing Data:

- **Delete entry**: Click 🗑️ button on any row
- **Export data**: Click "📥 Export JSON" to download backup
- **Clear all**: Click "🗑️ Clear All" (use carefully!)

---

## 🎯 Employee List

1. **Ali**
2. **Layla**
3. **Ali Fadlallah**
4. **Khodor**
5. **Hadi**
6. **Manager**

---

## 💾 Data Storage

**Important:** Data is stored in **browser's localStorage**

### What this means:

✅ **Pros:**
- No server needed (free!)
- Instant updates
- No database setup
- Works offline after first load

⚠️ **Cons:**
- Data is per-browser (Chrome on Computer A ≠ Chrome on Computer B)
- Clearing browser data = losing work entries
- Each person has their own copy

### Solutions:

**Option 1: Single Computer** (Recommended for small teams)
- Use one dedicated computer for data entry
- Everyone adds entries on that computer
- Bookmark the GitHub Pages URL

**Option 2: Export/Import**
- Export data as JSON regularly
- Share JSON file with team
- Import on other computers (requires adding import feature)

**Option 3: Upgrade to Backend** (Advanced)
- Use Firebase, Supabase, or similar
- Shared database for all users
- I can help set this up if needed!

---

## 📊 Features Explained

### Statistics Cards

**Total Hours This Week**
- Monday to Sunday of current week
- Sums all employees

**Total Hours This Month**
- From 1st of month to today
- All employees combined

**Total Employees**
- Always shows 6 (CIF Canada team)

### Employee Summary

Shows for each employee:
- Total hours worked (all time)
- Number of entries

### Filter Options

**By Employee**: See only one person's entries
**Date Range**: From/To dates
**Reset**: Clear all filters

---

## 🔐 Security Note

Currently, **anyone with the URL can add/delete entries**.

### To Add Password Protection:

Add this to `app.js` (I can provide code):
```javascript
// Simple password check
function toggleAdminPanel() {
  const password = prompt('Enter admin password:');
  if (password === 'CIF2025') {
    // Show admin panel
  }
}
```

Want me to add this? Let me know!

---

## 🎨 Customization

### Change Company Name

In `index.html`, find:
```html
<h1 class="text-3xl font-bold text-center">🏢 CIF Canada</h1>
```

Change to your company name.

### Change Colors

In `index.html`, change Tailwind classes:
- `bg-blue-900` → `bg-red-900` (header color)
- `bg-blue-600` → `bg-green-600` (button color)

### Add More Employees

In `app.js` and `index.html`, find:
```javascript
const employees = ['Ali', 'Layla', 'Ali Fadlallah', 'Khodor', 'Hadi', 'Manager'];
```

Add more names to the array.

---

## 📱 Mobile Friendly

The site works perfectly on:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile phones

Responsive design adjusts automatically!

---

## 🔄 Updating the Site

To make changes:

1. Edit `index.html` or `app.js` on your computer
2. Go to GitHub repository
3. Click file name → Edit (pencil icon)
4. Paste new code
5. Click "Commit changes"
6. Site updates automatically in 1-2 minutes!

---

## 📥 Export Data Format

Exported JSON looks like:
```json
[
  {
    "id": 1704067200000,
    "employee": "Ali",
    "date": "2025-01-10",
    "startTime": "09:00",
    "endTime": "17:00",
    "pause": 30,
    "hours": 7.5,
    "project": "Website Development",
    "notes": "Completed homepage",
    "timestamp": "2025-01-10T14:30:00.000Z"
  }
]
```

---

## 🆘 Troubleshooting

**Problem: Site not loading**
- Check GitHub Pages is enabled
- Wait 2-3 minutes after enabling
- Clear browser cache

**Problem: Data disappears**
- Don't clear browser data
- Export regularly as backup
- Consider upgrading to backend

**Problem: Can't add entries**
- Check all required fields filled
- End time must be after start time
- Try refreshing page

**Problem: GitHub Pages URL not working**
- Check Settings → Pages is enabled
- Verify branch is set to `main`
- URL format: `https://USERNAME.github.io/REPO-NAME/`

---

## 🚀 Future Enhancements

Want to add these features? Let me know!

- 🔐 Password protection for admin panel
- 📧 Email reports (weekly/monthly)
- 📊 Charts and graphs
- 💾 Cloud backup (Firebase/Supabase)
- 📱 Mobile app version
- 🖨️ Print-friendly reports
- 📅 Calendar view
- ⏰ Overtime tracking
- 💰 Payroll calculations
- 👥 User accounts (multi-user with permissions)

---

## 📞 Support

For questions or issues:
1. Check this README
2. Look at code comments
3. Test on different browser

---

## ✅ Checklist

- [ ] Create GitHub repository
- [ ] Upload index.html and app.js
- [ ] Enable GitHub Pages
- [ ] Wait 2 minutes
- [ ] Access site URL
- [ ] Add first work entry
- [ ] Test filtering
- [ ] Export data (backup)
- [ ] Bookmark URL
- [ ] Share URL with team

---

## 🎉 You're All Set!

Your CIF Canada work time tracker is now:
- ✅ Live on the internet
- ✅ Accessible 24/7
- ✅ Free forever (GitHub Pages)
- ✅ Easy to use
- ✅ Mobile friendly

**Enjoy!** 🚀

---

**Version:** 1.0  
**Last Updated:** January 2025  
**Company:** CIF Canada  
**Employees:** 6
