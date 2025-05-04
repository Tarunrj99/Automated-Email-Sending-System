function sendExploreEmail() {
  const url = "https://raw.githubusercontent.com/Tarunrj99/Automated-Email-Sending-System/refs/heads/main/templates/tarun-explore-devops-role-template.html";

  const template = getTemplateFromGitHub(url);

  const recipient = "someone@example.com";  // Replace or fetch dynamically
  const plainBody = "Hello, I am exploring DevOps/Cloud opportunities. Please view this in HTML format if supported.";

  GmailApp.sendEmail(recipient, template.subject, plainBody, {
    htmlBody: template.htmlBody
  });
}

function getTemplateFromGitHub(url) {
  const response = UrlFetchApp.fetch(url);
  const html = response.getContentText();

  const subjectMatch = html.match(/<!-- SUBJECT:\s*(.*?)\s*-->/i);
  const subject = subjectMatch ? subjectMatch[1] : "Exploring Opportunities";

  const cleanHtml = html.replace(/<!-- SUBJECT:.*?-->/i, '').trim();

  return {
    subject: subject,
    htmlBody: cleanHtml
  };
}
