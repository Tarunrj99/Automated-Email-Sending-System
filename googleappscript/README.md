# 📤 Google Apps Script for Automated Email Sending

This directory contains the main Google Apps Script file (`script.gs`) used to automatically send emails from Google Sheets using pre-configured templates, schedules, and limits.

---

## 📌 Objective

This script is designed to:
- Fetch data from a Google Sheet
- Send emails to marked rows (based on "Ready?" column)
- Use different HTML email templates
- Respect hourly and daily sending limits
- Update the sheet with email status and timestamp

---

## 🧰 How to Set Up

### 1. 📄 Add Script to Google Apps Script

1. Open [Google Apps Script](https://script.google.com).
2. Create a new project.
3. Add a file named `script.gs`.
4. Copy the code from [`googleappscript/script.gs`](./script.gs) and paste it.

---

### 2. 🧪 Configure Settings in `config.json`

The script loads its configuration from a remote JSON file. Example config:

```json
{
  "SHEET_NAME_CELL": "Explore",
  "TEST_MODE": true,
  "DAILY_LIMIT": 25,
  "HOURLY_LIMIT": 5,
  "EMAIL_GAP_MS": 60000,
  "ALLOWED_DAYS": [1, 2, 3, 4],
  "ALLOWED_HOURS": [8, 9, 10, 11, 12],
  "DEBUG_LOG": true
}
