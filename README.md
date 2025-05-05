# 📧 Automated Email Sending System

Created by: **Tarun Saini**  
Role: Senior DevOps Engineer

---

## 🧩 Objective

This system automates professional email outreach (e.g., job applications, networking) by sending personalized HTML emails to a list of contacts stored in a Google Sheet.  

It uses:
- Google Apps Script to run logic and send Gmail emails
- GitHub to store configuration and templates remotely
- A trigger system to schedule the sending automatically

---

## 🚀 Key Features

| Feature                      | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| ✅ Time window control       | Sends only during specific days & hours (e.g., Mon–Thu, 8am–12pm)           |
| ✅ Daily & hourly limits     | Limits how many emails go out per day/hour                                 |
| ✅ Config from GitHub        | Control behavior via remote `config.json`                                  |
| ✅ HTML templates            | Emails are beautifully designed using `.html` templates stored on GitHub   |
| ✅ Status tracking           | Updates the Google Sheet with "Sent" + timestamp after successful sending  |
| ✅ Throttling support        | Waits 1 minute between emails to avoid being flagged as spam               |
| ✅ Test mode                 | Allows testing anytime without restrictions                                |
| ✅ Fully serverless & safe   | Runs on your Gmail with Apps Script — no third-party tools or servers      |

---

## 🗂️ Repository Structure

```text
Automated-Email-Sending-System/
├── config/
│   └── config.json                # Remote configuration (limits, test mode, etc.)
├── templates/
│   ├── tarun-explore-devops-role-template.html
│   └── tarun-sharing-cv-for-devops-role-template.html
├── scripts/
│   └── send-emails.gs            # Backup of main logic (also in Google Apps Script)
├── googleappscript/
│   ├── script.gs                 # Google Apps Script file
│   └── README.md                 # Setup guide for Google Apps Script
└── README.md                     # ← You’re here!
```

## 🧠 How It Works

1. **User populates a Google Sheet** with email addresses and marks rows as "Ready"
2. **Apps Script is triggered** (manually or on a schedule)
3. Script:
   - Fetches config from GitHub (`config/config.json`)
   - Loads the sheet and filters eligible rows
   - Selects the correct email template (`templates/*.html`)
   - Sends HTML email via `GmailApp.sendEmail()`
   - Marks row as "Sent" and adds a timestamp
4. Respects all time/day/limit settings to avoid abuse

---

## 🧾 Google Sheet Format

**Sheet Name:** `Explore` (can be changed in config)

| S.N. | Email Address       | CC (Optional) | Template Key | Ready? | Status | Sent At             |
|------|---------------------|---------------|---------------|--------|--------|----------------------|
| 1    | hr@example.com      |               | template-1    | TRUE   | Sent   | 05/05/2025 09:12:00  |
| 2    | recruiter@xyz.com   |               | template-2    | TRUE   |        |                      |

- `Template Key`: Must match a key in the `final_templates` object (`template-1`, `template-2`, etc.)
- `Ready?`: Must be `TRUE` (case-insensitive) to be eligible
- `Status`: Will be updated to `"Sent"` once the email is sent
- `Sent At`: Timestamp of when the email was sent

---

## 🔧 Configuration via `config/config.json`

```json
{
  "SHEET_NAME": "Explore",
  "TEST_MODE": false,
  "DAILY_LIMIT": 25,
  "HOURLY_LIMIT": 5,
  "EMAIL_GAP_MS": 60000,
  "ALLOWED_DAYS": [1, 2, 3, 4],
  "ALLOWED_HOURS": [8, 9, 10, 11, 12],
  "DEBUG_LOG": true
}
```

| Key               | Description                                                                          |
|-------------------|--------------------------------------------------------------------------------------|
| SHEET_NAME        | Name of the tab in Google Sheet where email data is stored                           |
| TEST_MODE         | If true, disables time/day checks for testing purposes (email can be sent any time)  |
| DAILY_LIMIT       | Maximum number of emails to send per day                                             |
| HOURLY_LIMIT      | Maximum number of emails to send per hour                                            |
| EMAIL_GAP_MS      | Delay between emails in milliseconds (e.g., 60000 = 1 minute)                        |
| ALLOWED_DAYS      | Array of allowed days (0 = Sunday, 1 = Monday, ..., 6 = Saturday)                    |
| ALLOWED_HOURS     | Array of allowed hours (24-hour format) when emails can be sent                      |
| DEBUG_LOG         | If true, enables detailed logging for debugging purposes                             |

---

## 🛠️ How to Set Up

To get the automated email system running, follow these steps:

### 1. **Copy the Script**

   - Go to the `googleappscript/script.gs` file in this repository.
   - Copy the entire code into a new [Google Apps Script](https://script.google.com/) project.
   - In the Apps Script project, paste the script into the `Code.gs` file.

### 2. **Link to Google Sheet**

   - Open a new or existing Google Sheet.
   - In your Google Apps Script project, go to `Resources` → `Google Sheets API` and enable it if it's not already.
   - In the script, modify the `SHEET_NAME` variable to match the name of the sheet where you want to store your email data (e.g., `"Explore"`).

### 3. **Set Up Trigger**

   - Go to the `Triggers` page (clock icon) in Google Apps Script.
   - Click the `+ Add Trigger` button.
   - Set the function to run: `sendExploreEmails`.
   - Choose the event source: `Time-driven`.
   - Set the type to `Hour timer` and the interval to `Every 1 hour` (or adjust based on your preference).

### 4. **Configure the Script**

   You can configure the script by modifying the `config/config.json` file with the following variables:
   
   - **SHEET_NAME**: Name of the tab in Google Sheet where the email data will be stored.
   - **TEST_MODE**: Set to `true` for testing. Set to `false` when you're ready for production.
   - **DAILY_LIMIT**: Set the maximum number of emails to send per day.
   - **HOURLY_LIMIT**: Set the maximum number of emails to send per hour.
   - **EMAIL_GAP_MS**: Delay between emails in milliseconds (defaults to 1 minute).
   - **ALLOWED_DAYS**: Array of days when emails are allowed (e.g., `[1, 2, 3, 4]` for Monday to Thursday).
   - **ALLOWED_HOURS**: Array of hours when emails can be sent (e.g., `[8, 9, 10, 11, 12]` for 8 AM to 12 PM).

### 5. **Fill in the Google Sheet**

   Your Google Sheet should be structured as follows:

| S.N. | Email Address      | CC Address (Optional) | Template Key | Ready? | Status | Sent At    |
|------|--------------------|-----------------------|--------------|--------|--------|------------|
| 1    | hr@company.com      | recruiter@xyz.com     | template-1   | TRUE   |        |            |
| 2    | recruiter@abc.com   |                       | template-2   | TRUE   |        |            |

- **S.N.**: Serial number (for reference).
- **Email Address**: The email address where the email will be sent.
- **CC Address**: (Optional) Email addresses to be added in CC.
- **Template Key**: The template to be used (e.g., `template-1`).
- **Ready?**: Set to `TRUE` to allow sending for that row.
- **Status**: Automatically updates to `Sent` after sending.
- **Sent At**: Timestamp of when the email was sent.

---

## 🧪 Testing Tips

- To test the script, set `TEST_MODE = true` in the `config/config.json` file.
- Run the `sendExploreEmails()` function manually from the Apps Script editor.
- You can manually trigger the function by clicking the play button (`▶️`).
- Check the execution logs for detailed debugging output.
- After testing, set `TEST_MODE = false` to go live.

---

## 📬 Gmail & Script Limits

| Limit Type                     | Value                              |
|---------------------------------|------------------------------------|
| Max runtime per execution      | 6 minutes                         |
| Gmail free account daily limit | ~100–150 emails per day           |
| Max delay between emails       | 1 minute (due to `EMAIL_GAP_MS`)  |
| Emails per run (safe limit)    | ~6 emails (depending on Gmail limits) |

> 📝 Tip: If you need to send more emails, consider running the script hourly and spreading out the email sending.

---

## ✅ Best Practices

- Always test with `TEST_MODE = true` before going live.
- Keep email content professional and respectful.
- Ensure that your Google Sheet has accurate data, especially the "Ready?" and "Status" columns to avoid resending emails.
- Schedule emails only during working hours to avoid sending emails during non-business hours or weekends.
- Track performance (e.g., email open rates, bounces) through a CRM or separate tracking system.
- Use Google Drive links for resumes or additional documents in the email body.

---

## 🔐 Security & Privacy

- Emails are sent using your own Gmail account.
- No publishing, no external APIs — just Apps Script and your own data.
- All logic is transparent and runs in your account.

---

## 👨‍💻 Author

**Tarun Saini**  
Senior Cloud/DevOps Engineer  
🔗 [LinkedIn](https://www.linkedin.com/in/tarunrj99)

---

## 📄 License

MIT License
