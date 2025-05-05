# Google Apps Script for Automated Email Sending System

This directory contains the Google Apps Script code that powers the **Automated Email Sending System**. The script fetches email data from a Google Sheet, sends customized emails using templates, and logs the sent emails' status and timestamps.

## 📧 Overview

The script helps automate sending professional emails to HRs, recruiters, or any specified recipients based on data stored in a Google Sheet. The system is highly configurable, with limits on how many emails can be sent per day and hour, and when emails are allowed to be sent.

### Key Features

- Sends emails only on specific days and times.
- Uses custom templates for email body.
- Enforces daily and hourly email limits.
- Logs the status and time after sending each email.
- Works directly with your Google Sheet and Gmail account.

---

## 🛠️ How to Set Up

### 1. **Copy the Script into Google Apps Script**
   
   - Open [Google Apps Script](https://script.google.com/) and create a new project.
   - Copy the entire script from `googleappscript/script.gs` in this repository.
   - Paste the code into the `Code.gs` file in your Apps Script project.

### 2. **Link to Google Sheet**

   - Open or create a Google Sheet where you want to store email data.
   - Ensure that the Google Apps Script project is connected to this Google Sheet by configuring the `SHEET_NAME` variable in the script to the name of the sheet where email data will be stored (e.g., `"Explore"`).

### 3. **Configure the Script**

   Modify the `config/config.json` file in the repository to set your preferred configuration:

   - **SHEET_NAME**: Set the name of the Google Sheet tab.
   - **TEST_MODE**: Set to `true` for testing. Set to `false` when ready to send emails live.
   - **DAILY_LIMIT**: Maximum number of emails to send per day.
   - **HOURLY_LIMIT**: Maximum number of emails to send per hour.
   - **EMAIL_GAP_MS**: Delay between emails in milliseconds (default is 1 minute).
   - **ALLOWED_DAYS**: Array of days when emails are allowed to be sent (e.g., `[1, 2, 3, 4]` for Monday to Thursday).
   - **ALLOWED_HOURS**: Array of hours during which emails can be sent (e.g., `[8, 9, 10, 11, 12]` for 8 AM to 12 PM).

### 4. **Set Up Trigger for Automation**

   - In Google Apps Script, go to the `Triggers` section (⏰ icon).
   - Click `+ Add Trigger`.
   - Set the function to run: `sendExploreEmails`.
   - Choose the event source: `Time-driven`.
   - Set the type: `Hour timer`.
   - Set the interval to `Every 1 hour` (or adjust based on your preference).

### 5. **Fill in the Google Sheet**

   Your Google Sheet should have the following columns:

| S.N. | Email Address      | CC Address (Optional) | Template Key | Ready? | Status | Sent At    |
|------|--------------------|-----------------------|--------------|--------|--------|------------|
| 1    | hr@company.com      | recruiter@xyz.com     | template-1   | TRUE   |        |            |
| 2    | recruiter@abc.com   |                       | template-2   | TRUE   |        |            |

- **S.N.**: Serial number (for reference).
- **Email Address**: The email address to send to.
- **CC Address**: (Optional) CC email addresses.
- **Template Key**: Select from the templates available in the script (e.g., `template-1`).
- **Ready?**: Set to `TRUE` to enable sending for that row.
- **Status**: This field will automatically update to `Sent` once the email is sent.
- **Sent At**: The timestamp of when the email was sent.

---

## 🧪 Testing the Script

Before going live, it's a good idea to test the script to ensure it works correctly.

1. Set `TEST_MODE = true` in `config/config.json`.
2. Run the `sendExploreEmails()` function manually from the Apps Script editor.
3. Check the execution logs for debugging information and confirm emails are being sent as expected.
4. After successful testing, set `TEST_MODE = false` to begin the production run.

---

## 📬 Gmail & Script Limits

Be mindful of the following limits when running the script:

| Limit Type                     | Value                              |
|---------------------------------|------------------------------------|
| Max runtime per execution      | 6 minutes                         |
| Gmail free account daily limit | ~100–150 emails per day           |
| Max delay between emails       | 1 minute (due to `EMAIL_GAP_MS`)  |
| Emails per run (safe limit)    | ~6 emails per execution           |

> **Tip:** If you need to send more emails, consider running the script hourly to spread out the sending process.

---

## ✅ Best Practices

- Test the script with `TEST_MODE = true` before going live.
- Ensure the "Ready?" and "Status" columns in the Google Sheet are set up properly to prevent unwanted emails.
- Set the script to send emails during working hours and avoid weekends or non-business hours.
- Share resumes or documents via Google Drive links inside the email body.
- Monitor and track email performance, such as open rates or bounce rates, to optimize the process.

---

## 📄 License

MIT License (or specify another license if applicable)
