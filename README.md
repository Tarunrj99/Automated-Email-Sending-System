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
