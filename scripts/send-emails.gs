function sendExploreEmails(config, template) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.SHEET_NAME_CELL);
  const data = sheet.getDataRange().getValues();

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  // Time check unless in test mode
  if (
    !config.TEST_MODE &&
    (!config.ALLOWED_DAYS.includes(currentDay) ||
      currentHour < config.ALLOWED_HOUR_START ||
      currentHour > config.ALLOWED_HOUR_END)
  ) {
    Logger.log(`Outside allowed time or day. Hour: ${currentHour}`);
    return;
  }

  let sentThisRun = 0;
  let dailyCount = 0;
  let hourlyCount = 0;

  // Track how many sent today (based on "Sent At" column)
  for (let i = 1; i < data.length; i++) {
    const sentAt = data[i][6];
    if (sentAt instanceof Date) {
      const sentDate = new Date(sentAt);
      if (isSameDay(sentDate, now)) dailyCount++;
      if (isSameHour(sentDate, now)) hourlyCount++;
    }
  }

  for (let i = 1; i < data.length; i++) {
    if (sentThisRun >= config.HOURLY_LIMIT || dailyCount >= config.DAILY_LIMIT || hourlyCount >= config.HOURLY_LIMIT) {
      Logger.log("Hourly or daily limit reached.");
      break;
    }

    const email = data[i][1];
    const ready = data[i][2];
    const status = data[i][3];

    if (status === "Sent" || !email || ready !== true) continue;

    const subject = "Exploring DevOps/Cloud Engineer Roles | 5+ Yrs | Tarun Saini | Immediate Joiner";
    const plainBody = "Hello, I am exploring opportunities in DevOps/Cloud. Please view the HTML version if available.";

    GmailApp.sendEmail(email, subject, plainBody, {
      htmlBody: template
    });

    // Format time: dd/MM/yyyy HH:mm:ss
    const timeStamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
    sheet.getRange(i + 1, 4).setValue("Sent");
    sheet.getRange(i + 1, 5).setValue(timeStamp);

    Logger.log(`Sent to ${email} at ${timeStamp}`);

    sentThisRun++;
    dailyCount++;
    hourlyCount++;

    // Wait before sending the next email
    if (sentThisRun < config.HOURLY_LIMIT && i < data.length - 1) {
      Utilities.sleep(config.EMAIL_GAP_MS);
    }
  }
}

// Helper to compare dates
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

function isSameHour(date1, date2) {
  return isSameDay(date1, date2) && date1.getHours() === date2.getHours();
}
