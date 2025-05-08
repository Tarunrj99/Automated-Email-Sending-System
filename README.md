# 📧 Automated Email Sending System

Created by: **Tarun Saini**

---

## 🧩 Objective

The **Automated Email Sending System** automates professional email outreach, such as job applications or networking, by sending personalized HTML emails to contacts listed in a Google Sheet. It offers flexible configuration, multiple template support, and robust tracking for efficient communication.

**Technologies Used:**
- Google Apps Script for logic and Gmail integration
- GitHub for remote storage of configuration and HTML templates
- Google Sheets for managing recipient data

---

## 🚀 Key Features

| Feature                    | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| 🕒 Scheduled Sending       | Sends emails on specified days (e.g., Mon–Thu) within a configurable time window (e.g., 18:00–20:00), as Google Apps Script triggers run approximately hourly without precise start times  |
| 📅 Rate Limits             | Caps emails per day and per hourly run to comply with Gmail limits           |
| 🛠️ Flexible Configuration  | Supports remote (`config.json`) or local config overrides in the script      |
| ✉️ Multiple HTML Templates | Allows varied email content and subjects for different outreach goals        |
| 🧾 Status Tracking         | Updates Google Sheet with "Sent" status and timestamp                        |
| 🐢 Throttling              | Enforces a 1-minute gap between emails to avoid spam flags                   |
| 🧪 Test Mode               | Bypasses time/day restrictions for testing                                  |
| 🔒 Serverless & Secure     | Runs entirely on Google Apps Script using your Gmail account                 |
| 🪵 Detailed Logging        | Emoji-enhanced logs for debugging (controlled via `DEBUG_LOG`)              |
| 📧 CC Support              | Supports adding CC recipients from the Google Sheet                         |

---

## 🗂️ Repository Structure

```text
Automated-Email-Sending-System/
├── config/
│   └── config.json                # Remote configuration (limits, test mode, etc.)
├── templates/
│   └── *.html                     # HTML email templates (e.g., for sharing CVs)
├── scripts/
│   └── send-emails.gs            # Backup of main logic (also in Google Apps Script)
├── googleappscript/
│   ├── script.gs                 # Google Apps Script file
│   └── README.md                 # Detailed setup guide
└── README.md                     # ← You’re here!
```

---

## 🧠 How It Works

1. **Data Preparation**: Populate a Google Sheet tab (e.g., `Emails`) with recipient email addresses, optional CC addresses, template keys, and a "Ready" status. The tab name must match `SHEET_NAME_CELL` in the configuration.
2. **Automated Execution**: An hourly trigger runs the `sendExploreEmails` function, fetching configuration and templates from GitHub or using local defaults if unavailable.
3. **Email Sending**:
   - Filters rows where `Ready?` is `TRUE` and `Status` is not `Sent`.
   - Retrieves the specified HTML template (from multiple options) and extracts the subject via regex.
   - Sends emails with optional CC recipients using Gmail.
   - Updates the Google Sheet with `Sent` status and timestamp.
4. **Rate & Time Control**: Enforces daily/hourly limits, allowed days/hours, and a 1-minute gap between emails.

For detailed setup instructions, including Google Sheet tab configuration, template creation, and script setup, see the [googleappscript/README.md](https://github.com/Tarunrj99/Automated-Email-Sending-System/blob/main/googleappscript/README.md).

---

## 🔧 Configuration Overview

Configuration can be managed via `config/config.json` on GitHub or overridden locally in the script. Key settings include:

| Key                 | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| SHEET_NAME_CELL     | Google Sheet tab name (default: `Emails`)                                   |
| TEST_MODE           | If `true`, bypasses time/day checks for testing                             |
| DAILY_LIMIT         | Maximum emails per day (e.g., 20)                                           |
| HOURLY_LIMIT        | Maximum emails per hourly run (e.g., 6)                                     |
| EMAIL_GAP_MS        | Delay between emails in milliseconds (e.g., 60000 = 1 minute)               |
| ALLOWED_DAYS        | Days for sending (e.g., `[1, 2, 3, 4]` for Mon–Thu)                         |
| ALLOWED_TIME_START  | Start time for sending (e.g., `"18:00"` or `18` for 18:00)                  |
| ALLOWED_TIME_END    | End time for sending (e.g., `"20:00"` or `20` for 20:00)                  |
| DEBUG_LOG           | If `true`, enables detailed logging                                         |

---

## 📬 Gmail & Script Limits

| Limit Type                     | Value                                  |
|--------------------------------|----------------------------------------|
| Max runtime per execution      | 6 minutes                              |
| Gmail free account daily limit | ~100–150 emails per day                |
| Max delay between emails       | 1 minute (via `EMAIL_GAP_MS`)          |
| Emails per run (safe limit)    | ~6 emails (based on `HOURLY_LIMIT`)    |

> **Tip**: Distribute email sending across hourly runs to stay within limits.

---

## ✅ Best Practices

- Test with a small dataset before enabling production mode.
- Use varied templates for different outreach purposes (e.g., job roles, follow-ups).
- Ensure the Google Sheet tab name matches `SHEET_NAME_CELL`.
- Validate email and CC addresses in the Google Sheet.
- Schedule emails during mentioned hours (e.g., 6 PM – 8 PM, Mon–Thu).
- Monitor Gmail's sent folder and bounce notifications for issues.

---

## 🔐 Security & Privacy

- Runs within your Google account using Apps Script and Gmail.
- No external APIs or servers involved.
- Configuration/templates fetched securely from GitHub with local fallbacks.
- Transparent, editable logic in your Apps Script project.

---

## 👨‍💻 Author

**Tarun Saini**  
Senior Cloud/DevOps Engineer  
tarunrj99@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/tarunrj99)

---

## 📄 License

MIT License
