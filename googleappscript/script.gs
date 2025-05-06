let DEBUG_LOG = true; // Default to true — will be overridden by config

function getConfiguration() {
  const CONFIG_URL = "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/config/config.json";
  const USE_LOCAL_CONFIG = false; // Set to true to override remote config

  const localConfig = {
    SHEET_NAME_CELL: "Emails",
    TEST_MODE: false, // Set to false for real-time use
    DAILY_LIMIT: 25, // Max emails per day
    HOURLY_LIMIT: 5, // Max emails based on per hour run
    EMAIL_GAP_MS: 60 * 1000, // 1 minute gape in milliseconds
    ALLOWED_DAYS: [1, 2, 3, 4], // Mon–Thu
    ALLOWED_HOUR_START: 9, // 9 AM to ...
    ALLOWED_HOUR_END: 12, // till 12 PM
    DEBUG_LOG: true
  };

  if (USE_LOCAL_CONFIG) {
    log("Using local configuration.");
    return localConfig;
  }

  try {
    const response = UrlFetchApp.fetch(CONFIG_URL, { muteHttpExceptions: true });
    const statusCode = response.getResponseCode();
    if (statusCode === 200) {
      log("Configuration fetched successfully.");
      return JSON.parse(response.getContentText());
    } else {
      log(`Failed to fetch configuration. HTTP Status: ${statusCode}`);
      return localConfig;
    }
  } catch (error) {
    log(`Error fetching configuration: ${error.message}`);
    return localConfig;
  }
}

function getEmailTemplate() {
  const TEMPLATE_URL = "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/tarun-explore-devops-role-template.html";

  try {
    const response = UrlFetchApp.fetch(TEMPLATE_URL, { muteHttpExceptions: true });
    const statusCode = response.getResponseCode();
    if (statusCode === 200) {
      log("Email template fetched successfully.");
      return response.getContentText();
    } else {
      log(`Failed to fetch email template. HTTP Status: ${statusCode}`);
      return "<p>Could not load email template.</p>";
    }
  } catch (error) {
    log(`Error fetching email template: ${error.message}`);
    return "<p>Could not load email template.</p>";
  }
}

function getMainScript() {
  const SCRIPT_URL = "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/scripts/send-emails.gs";

  try {
    const response = UrlFetchApp.fetch(SCRIPT_URL, { muteHttpExceptions: true });
    const statusCode = response.getResponseCode();
    if (statusCode === 200) {
      log("Main script fetched successfully.");
      return response.getContentText();
    } else {
      log(`Failed to fetch main script. HTTP Status: ${statusCode}`);
      return "";
    }
  } catch (error) {
    log(`Error fetching main script: ${error.message}`);
    return "";
  }
}

function sendExploreEmails() {
  log("⏳ Starting sendExploreEmails...");

  // Hardcoded template URLs
  const final_templates = {
    "template-1": "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/tarun-explore-devops-role-template.html",
    "template-2": "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/tarun-sharing-cv-for-devops-role-template.html",
    "template-3": "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/tarun-sharing-cv-for-senior-devops-role-template.html",
    "template-4": "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/tarun-sharing-cv-for-cloud-role-template.html",
    "template-5": "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/tarun-sharing-cv-for-senior-cloud-role-template.html"
  };

  let config;
  try {
    config = getConfiguration();
    DEBUG_LOG = config.DEBUG_LOG ?? true;
    log("✅ Configuration fetched successfully.");
    log("🔍 Config content: " + JSON.stringify(config));
  } catch (e) {
    Logger.log("❌ Failed to load config: " + e);
    return;
  }

  const {
    SHEET_NAME_CELL,
    TEST_MODE,
    DAILY_LIMIT,
    HOURLY_LIMIT,
    EMAIL_GAP_MS,
    ALLOWED_DAYS,
    ALLOWED_HOUR_START,
    ALLOWED_HOUR_END
  } = config;

  const SHEET_NAME = SHEET_NAME_CELL;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    log("❌ Sheet not found: " + SHEET_NAME);
    return;
  }

  log("✅ Sheet loaded. Proceeding with data.");
  const data = sheet.getDataRange().getValues();
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  if (!TEST_MODE && (currentHour < ALLOWED_HOUR_START || currentHour > ALLOWED_HOUR_END)) {
    log(`⛔ Exiting: Current hour (${currentHour}) is outside allowed range.`);
    return;
  }
  if (!TEST_MODE && !ALLOWED_DAYS.includes(currentDay)) {
    log(`⛔ Exiting: Today (day ${currentDay}) is not an allowed day.`);
    return;
  }

  let sentThisRun = 0;
  let dailyCount = 0;
  let hourlyCount = 0;

  // Count already sent emails
  for (let i = 1; i < data.length; i++) {
    const sentAt = data[i][6];
    if (sentAt) {
      const sentDate = new Date(sentAt);
      if (!isNaN(sentDate.getTime())) {
        if (isSameDay(sentDate, now)) dailyCount++;
        if (isSameHour(sentDate, now)) hourlyCount++;
      }
    }
  }

  log(`📈 Sent today: ${dailyCount}, this hour: ${hourlyCount}`);

  for (let i = 1; i < data.length; i++) {
    if (sentThisRun >= HOURLY_LIMIT || dailyCount >= DAILY_LIMIT || hourlyCount >= HOURLY_LIMIT) {
      log("🚫 Limit reached. Stopping.");
      break;
    }

    //if (sentThisRun >= HOURLY_LIMIT || dailyCount >= DAILY_LIMIT || hourlyCount >= HOURLY_LIMIT) {
    //  log("🚫 Limit reached. Stopping.");
    //  break;
    //}

    const email = data[i][1];
    const cc = data[i][2];
    const templateKey = data[i][3];
    const ready = data[i][4];
    const status = data[i][5];

    log(`🔁 Row ${i + 1} | Email: ${email} | Template: ${templateKey} | Ready: ${ready} | Status: ${status}`);

    if (status === "Sent" || !email || !(ready === true || ready === "TRUE")) {
      log(`⚠️ Skipping row ${i + 1}`);
      continue;
    }

    if (!final_templates.hasOwnProperty(templateKey)) {
      log(`⚠️ Invalid template key in row ${i + 1}: ${templateKey}`);
      continue;
    }

    let htmlBody;
    try {
      const response = UrlFetchApp.fetch(final_templates[templateKey]);
      if (response.getResponseCode() !== 200) throw new Error("Template fetch failed");
      htmlBody = response.getContentText();
    } catch (e) {
      log(`❌ Failed to load template ${templateKey} for row ${i + 1}: ${e}`);
      continue;
    }

    const subject = extractSubjectFromTemplate(htmlBody);
    const plainBody = "Hello, I am exploring opportunities in DevOps/Cloud. Please view the HTML version if available.";

    try {
      const mailOptions = {
        htmlBody: htmlBody
      };
      if (cc && cc.toString().trim() !== "") {
        mailOptions.cc = cc;
      }

      GmailApp.sendEmail(email, subject, plainBody, mailOptions);

      const timeStamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
      sheet.getRange(i + 1, 6).setValue("Sent");
      sheet.getRange(i + 1, 7).setValue(timeStamp);

      log(`✅ Email sent to ${email} with ${templateKey} at ${timeStamp}`);

      sentThisRun++;
      dailyCount++;
      hourlyCount++;

      if (sentThisRun < HOURLY_LIMIT && i < data.length - 1) {
        log("⏱ Sleeping before next email...");
        Utilities.sleep(EMAIL_GAP_MS);
      }
    } catch (e) {
      log(`❌ Failed sending to ${email}: ${e}`);
    }
  }

  log(`✅ Finished. Emails sent this run: ${sentThisRun}`);
}

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

function isSameHour(date1, date2) {
  return isSameDay(date1, date2) && date1.getHours() === date2.getHours();
}

function extractSubjectFromTemplate(templateContent) {
  const matches = templateContent.match(/<!--\s*SUBJECT\s*-->\s*\n*<!--\s*(.*?)\s*-->/i);
  return matches ? matches[1].trim() : "No Subject Found";
}

function log(message) {
  if (DEBUG_LOG) Logger.log(message);
}

// This function is only run ONCE manually to create the trigger
function createTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const exists = triggers.some(t => t.getHandlerFunction() === "sendExploreEmails");

  if (!exists) {
    ScriptApp.newTrigger("sendExploreEmails")
      .timeBased()
      .everyHours(1)
      .create();
    Logger.log("✅ Trigger created successfully.");
  } else {
    Logger.log("⚠️ Trigger already exists. No new trigger created.");
  }
}

