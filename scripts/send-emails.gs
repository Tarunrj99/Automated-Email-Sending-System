function sendExploreEmails() {
  const config = getConfig();

  const sheetName = SpreadsheetApp.getActiveSpreadsheet()
    .getRange(config.SHEET_NAME_CELL).getValue();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  if (!config.TEST_MODE && (!config.ALLOWED_DAYS.includes(currentDay) || !config.ALLOWED_HOURS.includes(currentHour))) {
    Logger.log("Outside allowed time or day.");
    return;
  }

  // Use config.DAILY_LIMIT, config.HOURLY_LIMIT, etc.
}
