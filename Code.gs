/**
 * GOOGLE APPS SCRIPT FOR KANAKIA PRIVAASA LEAD CAPTURE
 * Automatically maps incoming leads to the exact columns in your Google Sheet.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    // 1. Parse incoming data (JSON or Form URL-encoded)
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    // 2. Extract all values
    var timestamp = data.timestamp || data.Timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var fullName = data["Full Name"] || data.fullName || data.name || "";
    var mobileNumber = data["Mobile Number"] || data.mobileNumber || data.phone || data.mobile || "";
    var propertyInterest = data["Which property are you interested in?"] || data["Interested Property"] || data["Property Interest"] || data.propertyInterest || data.interest || "";
    var budget = data["What is your approximate budget?"] || data["Approximate Budget"] || data["Budget"] || data.budget || "";
    var timeline = data["When are you planning to purchase?"] || data["Purchase Timeline"] || data.purchaseTimeline || data.timeline || "";
    var configuration = data["What is your preferred configuration?"] || data["Preferred Configuration"] || data.preferredConfig || data.config || "";
    var message = data["Message"] || data.message || "";
    var leadSource = data["Lead Source"] || data.leadSource || data.source || "";

    // 3. Read your actual Google Sheet headers (Row 1)
    var lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      // If sheet has no headers, create them
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Mobile Number",
        "Which property are you interested in?",
        "What is your approximate budget?",
        "When are you planning to purchase?",
        "What is your preferred configuration?",
        "Message",
        "Lead Source"
      ]);
      lastCol = sheet.getLastColumn();
    }

    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // 4. Map each column by matching the header name in Row 1
    var row = headers.map(function(header) {
      var h = String(header).trim().toLowerCase();

      // Column: Timestamp
      if (h.indexOf("time") !== -1 || h.indexOf("date") !== -1) {
        return timestamp;
      }
      // Column: Full Name
      if (h.indexOf("name") !== -1) {
        return fullName;
      }
      // Column: Mobile Number
      if (h.indexOf("mobile") !== -1 || h.indexOf("phone") !== -1 || h.indexOf("contact") !== -1) {
        return mobileNumber;
      }
      // Column: Which property are you interested in?
      if (h.indexOf("property") !== -1 || h.indexOf("interest") !== -1) {
        return propertyInterest;
      }
      // Column: Approximate Budget / What is your approximate budget?
      if (h.indexOf("budget") !== -1) {
        return budget;
      }
      // Column: When are you planning to purchase? / Purchase Timeline
      if (h.indexOf("purchase") !== -1 || h.indexOf("when") !== -1 || h.indexOf("timeline") !== -1) {
        return timeline;
      }
      // Column: What is your preferred configuration? / Preferred Configuration
      if (h.indexOf("config") !== -1 || h.indexOf("preferred") !== -1) {
        return configuration;
      }
      // Column: Message / Requirements
      if (h.indexOf("message") !== -1 || h.indexOf("requirement") !== -1 || h.indexOf("note") !== -1) {
        return message;
      }
      // Column: Lead Source
      if (h.indexOf("source") !== -1) {
        return leadSource;
      }

      // Fallback: check exact key in data object
      return data[header] || "";
    });

    // 5. Append the row to Google Sheet
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Data saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return doPost(e);
}
