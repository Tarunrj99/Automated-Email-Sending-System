# Google Apps Script for Automated Email Sending System

This directory contains the Google Apps Script code and setup instructions for the **Automated Email Sending System**. The script automates sending professional HTML emails based on data in a Google Sheet, with flexible configuration, multiple template support, and tracking.

---

## 📧 Overview

The script fetches email data from a Google Sheet tab, sends customized HTML emails using templates hosted on GitHub, and updates the tab with send status and timestamps. It supports CC recipients, dynamic subject extraction, local configuration overrides, and user-hosted templates.

### Key Features

- Sends emails on specified days (e.g., Mon–Thu) within a configurable time window (e.g., 19:00–20:00), as Google Apps Script triggers run approximately hourly without precise start times.
- Supports multiple HTML templates for varied content and subjects.
- Enforces daily/hourly limits with a 1-minute gap between emails.
- Tracks sent emails with status and timestamps in the Google Sheet.
- Allows local configuration overrides in the script.
- Supports templates hosted in user's own GitHub repository or the project's `templates/` directory.
- Provides emoji-enhanced logging for debugging.

---

## 🛠️ Setup Instructions

### 1. **Copy the Script**
- Open [Google Apps Script](https://script.google.com/) and create a new project.
- Copy the code from [`googleappscript/script.gs`](https://github.com/Tarunrj99/Automated-Email-Sending-System/blob/main/googleappscript/script.gs) in this repository.
- Paste it into the `Code.gs` file in your Apps Script project.

### 2. **Create and Configure the Google Sheet**
- Create a new Google Sheet or use an existing one.
- Create a tab named `Emails` (or as specified in `SHEET_NAME_CELL` in the configuration).
- Ensure the tab name matches `SHEET_NAME_CELL` in `defaultConfig.json` or `localConfig` (default: `Emails`).
- Structure the tab as follows:

| S.N. | Email Address                                 | CC (Optional) | Template Key | Ready? | Status | Sent At             |
|------|-----------------------------------------------|---------------|--------------|--------|--------|---------------------|
| 1    | [hr@company.com](mailto:hr@company.com)       | [cc@xyz.com](mailto:cc@xyz.com) | template-1   | TRUE   |        |                     |
| 2    | [recruiter@abc.com](mailto:recruiter@abc.com) |               | template-2   | TRUE   |        |                     |

- **S.N.**: Serial number for reference.
- **Email Address**: Recipient's email address.
- **CC (Optional)**: Comma-separated CC email addresses.
- **Template Key**: Identifier for the HTML template (e.g., `template-1`, `template-2`).
- **Ready?**: Set to `TRUE` (case-insensitive) to enable sending.
- **Status**: Updated to `Sent` after sending.
- **Sent At**: Timestamp in `dd/MM/yyyy HH:mm:ss` format.

- Enable the Google Sheets API in your Apps Script project (`Resources` → `Advanced Google services`) if prompted.
- Use Google Sheet filters to manage large recipient lists efficiently.

### 3. **Create HTML Templates**
- Create HTML files for your email templates with:
  - A subject defined within `<!-- SUBJECT -->` and `<!-- -->` tags.
  - A styled HTML body with inline CSS for consistent rendering.
- You can create multiple templates for different purposes (e.g., job applications, follow-ups) with unique `Template Key` values.
- **Storage Options**:
  1. **Your Own GitHub Repository**:
     - Create a public GitHub repository (e.g., `your-username/email-templates`).
     - Add your HTML template file (e.g., `share-cv-template.html`) to a directory (e.g., `templates/`).
     - Ensure the repository is public for the script to access the raw file.
     - Get the raw URL:
       - Navigate to the template file on GitHub.
       - Click the `Raw` button.
       - Copy the URL (e.g., `https://raw.githubusercontent.com/your-username/email-templates/main/templates/share-cv-template.html`).
     - Update the `final_templates` object in `script.gs` (see step 4).
  2. **Project's Templates Directory**:
     - Request to store your template in the `templates/` directory of [Tarunrj99/Automated-Email-Sending-System](https://github.com/Tarunrj99/Automated-Email-Sending-System).
     - Submit a pull request or contact the repository owner (Tarun Saini) via [LinkedIn](https://www.linkedin.com/in/tarunrj99) with your template file.
     - Once added, use the raw URL provided by the repository (e.g., `https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/your-template.html`).

**Example Template (`share-cv-template.html`):**

```html
<!-- SUBJECT -->
<!-- Sharing My CV for DevOps Engineer Role | Your Name -->
<!-- EMAIL BODY -->
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
  <p>Dear [Recipient's Name or Hiring Manager],</p>
  <p>I am excited to share my CV for the DevOps Engineer position at [Company Name]. With [X years] of experience in [relevant skills, e.g., cloud infrastructure, CI/CD pipelines], I am eager to contribute to your team.</p>
  <p>Please find my CV linked here: [Insert Google Drive link to CV]. I am available for an immediate start and would welcome the opportunity to discuss how my skills align with your needs.</p>
  <p>Thank you for your time and consideration. I look forward to hearing from you.</p>
  <p>Best regards,<br>Your Name<br>[Your Email] | [Your Phone] | [Your LinkedIn]</p>
</div>
```

- **Customization**: Replace placeholders (e.g., `[Your Name]`, `[Company Name]`) with specific details or keep generic.

### 4. **Configure the Script**

#### Update `final_templates`
- Add your template URLs to the `final_templates` object in the `sendExploreEmails` function in `script.gs`.
- For each template, specify a unique `Template Key` (e.g., `template-1`, `template-2`) and its raw GitHub URL.
- Example for two templates (you can add more as needed):

```javascript
const final_templates = {
  "template-1": "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/share-cv-template.html",
  "template-2": "https://raw.githubusercontent.com/your-username/email-templates/main/templates/follow-up-template.html"
};
```

- Ensure each `Template Key` matches the value used in the Google Sheet's `Template Key` column.
- You can create multiple templates by adding more entries to `final_templates` with unique keys and URLs.

#### Remote Configuration
- Update `config/defaultConfig.json` on GitHub with your settings:

```json
{
  "SHEET_NAME_CELL": "Emails",
  "TEST_MODE": false,
  "DAILY_LIMIT": 20,
  "HOURLY_LIMIT": 6,
  "EMAIL_GAP_MS": 60000,
  "ALLOWED_DAYS": [1, 2, 3, 4],
  "ALLOWED_TIME_START": "18:00",
  "ALLOWED_TIME_END": "20:00",
  "DEBUG_LOG": true
}
```

#### Local Configuration Override
- To override remote settings, set `USE_LOCAL_CONFIG = true` in `script.gs` and modify the `localConfig` object:

```javascript
const localConfig = {
  SHEET_NAME_CELL: "Emails",
  TEST_MODE: false,
  DAILY_LIMIT: 20,
  HOURLY_LIMIT: 6,
  EMAIL_GAP_MS: 60000,
  ALLOWED_DAYS: [1, 2, 3, 4],
  ALLOWED_TIME_START: "18:00",
  ALLOWED_TIME_END: "20:00",
  DEBUG_LOG: true
};
```

- **Configuration Fields**:
  - **SHEET_NAME_CELL**: Google Sheet tab name (default: `Emails`). Ensure the tab name matches this value.
  - **TEST_MODE**: Set to `true` for testing; `false` for production.
  - **DAILY_LIMIT**: Max emails per day (e.g., 20).
  - **HOURLY_LIMIT**: Max emails per hourly run (e.g., 6).
  - **EMAIL_GAP_MS**: Delay between emails (e.g., 60000ms = 1 minute).
  - **ALLOWED_DAYS**: Days for sending (e.g., `[1, 2, 3, 4]` for Mon–Thu).
  - **ALLOWED_TIME_START**: Start time for sending (e.g., `"18:00"` or `18` for 18:00). Specifies the earliest time emails can be sent.
  - **ALLOWED_TIME_END**: End time for sending (e.g., `"20:00"` or `20` for 20:00). Emails are sent up to and including this time (e.g., until 20:00:59).
  - **DEBUG_LOG**: Set to `true` for detailed logging.
- **Time Format**:
  - Use strings for precise times (e.g., `"18:00"`, `"9:15"`) in `HH:mm` format.
  - Use numbers for exact hours (e.g., `18`, `9`) to mean `18:00`, `9:00`.
  - Invalid formats or values (e.g., `"25:00"`, `"9:60"`) are logged and may skip time checks, so ensure correct inputs.
- If GitHub is inaccessible, the script falls back to `localConfig`.

#### Basic Script Structure
- After configuring templates and settings, your `script.gs` should look like this (simplified for clarity). See the full script at [`googleappscript/script.gs`](https://github.com/Tarunrj99/Automated-Email-Sending-System/blob/main/googleappscript/script.gs) for complete details.
- **Instructions for Modification**:
  - **Line: `USE_LOCAL_CONFIG`**: Set to `true` to use `localConfig` instead of `defaultConfig.json`.
  - **Line: `localConfig`**: Update values (e.g., `SHEET_NAME_CELL`, `DAILY_LIMIT`) if using local configuration.
  - **Line: `final_templates`**: Add your template URLs with unique `Template Key` values (e.g., `template-1`, `template-2`).

```javascript
let DEBUG_LOG = true;

function getConfiguration() {
  const CONFIG_URL = "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/config/defaultConfig.json";
  const USE_LOCAL_CONFIG = false; // Change to true to use localConfig

  const localConfig = {
    SHEET_NAME_CELL: "Emails", // Change tab name if needed
    TEST_MODE: false,
    DAILY_LIMIT: 20, // Adjust limits as needed
    HOURLY_LIMIT: 6,
    EMAIL_GAP_MS: 60000,
    ALLOWED_DAYS: [1, 2, 3, 4],
    ALLOWED_TIME_START: "18:00",
    ALLOWED_TIME_END: "20:00",
    DEBUG_LOG: true
  };

// Remananing Logic ...

function sendExploreEmails() {
  const final_templates = {
    "template-1": "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/share-cv-template.html", // Change to your template URL
    "template-2": "https://raw.githubusercontent.com/your-username/email-templates/main/templates/follow-up-template.html" // Add more templates as needed
  };

  // Remananing Logic will be same to process sheet data, fetch templates, send emails, and update sheet
  // (See full script for details)

```

### 5. **Set Up the Trigger**
- Run the `createTrigger` function **once** manually from the Apps Script editor to create an hourly trigger for `sendExploreEmails`.
- Verify the trigger in the `Triggers` page (⏰ icon). It should run `sendExploreEmails` every hour.
- Alternatively, set up manually:
  - Go to `Triggers` → `+ Add Trigger`.
  - Select `sendExploreEmails`, event source `Time-driven`, type `Hour timer`, interval `Every 1 hour`.
- To pause or stop, delete the trigger from the `Triggers` page.

---

## 🧪 Testing the Script
1. Set `TEST_MODE = true` in `defaultConfig.json` or `localConfig` to bypass time/day restrictions.
2. Add 2–3 test rows to the Google Sheet with valid email addresses, `Ready?` set to `TRUE`, and unique `Template Key` values.
3. Run the `sendExploreEmails` function manually from the Apps Script editor (▶️ button). Ensure you select `sendExploreEmails`, not other functions.
4. Check logs:
   - For manual runs: Go to `View` → `Logs` for emoji-enhanced debugging output.
   - For trigger-based runs: Go to `Executions` tab, select an execution, and view its logs.
5. Verify emails in Gmail's sent folder and Google Sheet updates (`Status` and `Sent At`).
6. Set `TEST_MODE = false` for production after successful testing.

---

## 📬 Gmail & Script Limits
| Limit Type                     | Value                                  |
|--------------------------------|----------------------------------------|
| Max runtime per execution      | 6 minutes                              |
| Gmail free account daily limit | ~100–150 emails per day                |
| Max delay between emails       | 1 minute (via `EMAIL_GAP_MS`)          |
| Emails per run (safe limit)    | ~6 emails (based on `HOURLY_LIMIT`)    |

> **Tip**: Run the script hourly to distribute email sending within limits.

---

## 🛠️ Troubleshooting
- **Emails not sending**:
  - Check Gmail's sent folder and logs (`View` → `Logs` for manual runs; `Executions` tab for trigger runs).
  - Verify email addresses are valid and `Ready?` is `TRUE`.
  - Ensure `Template Key` matches a key in `final_templates`.
  - Confirm the Google Sheet tab name matches `SHEET_NAME_CELL`.
  - Verify template URLs are accessible (public GitHub repository).
- **Gmail limits exceeded**:
  - Reduce `HOURLY_LIMIT` or spread sending across more hours.
  - Check Gmail's bounce notifications for issues.
  - Wait 24 hours for daily limit reset.
- **Trigger not running**:
  - Confirm the trigger exists in the `Triggers` page.
  - Check execution logs in the `Executions` tab for errors.
- **Template/config not loading**:
  - Verify GitHub URLs are accessible and files exist.
  - Ensure the repository is public if hosting your own templates.
  - Enable `USE_LOCAL_CONFIG` to use local settings as a fallback.
- **Bounced emails**:
  - Check Gmail's bounce notifications and remove invalid addresses.
- **Manual run errors**:
  - Ensure you run the `sendExploreEmails` function, not others (e.g., `createTrigger`).

---

## ✅ Best Practices
- Test with a small dataset (2–3 emails) and varied templates.
- Ensure the Google Sheet tab name matches `SHEET_NAME_CELL` in the configuration.
- Use professional, concise content with inline CSS in templates.
- Host templates in a public GitHub repository or request inclusion in the project's `templates/` directory.
- Validate email and CC addresses to avoid bounces.
- Include Google Drive links for CVs/documents in templates.
- Monitor logs (`Logs` for manual, `Executions` for triggers), Gmail's sent folder, and bounce notifications.
- Use Google Sheet filters to organize large recipient lists.
- Use a CRM or email tracking tool to monitor opens/responses.

---

## 📄 License
MIT License
