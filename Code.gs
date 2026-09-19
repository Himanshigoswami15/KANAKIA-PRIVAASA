/**
 * GOOGLE APPS SCRIPT FOR KANAKIA PRIVAASA LEAD CAPTURE
 * Automatically maps incoming leads to the 'Leads' sheet in Google Sheets.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Select the 'Leads' tab, or fallback to the active sheet
    var sheet = ss.getSheetByName("Leads") || ss.getActiveSheet();
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

    // 2. Extract values from form submission
    var timestamp = data.timestamp || data["Timestamp"] || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    var fullName = data["Full Name"] || data.fullName || data.name || "";
    var mobileNumber = data["Mobile Number"] || data.mobileNumber || data.phone || data.mobile || "";
    var propertyInterest = data["Which property are you interested in?"] || data["Interested Property"] || data["Property Interest"] || data.propertyInterest || data.interest || "";
    var budget = data["What is your approximate budget?"] || data["Approximate Budget"] || data["Budget"] || data.budget || "";
    var timeline = data["When are you planning to purchase?"] || data["Purchase Timeline"] || data.purchaseTimeline || data.timeline || "";
    var configuration = data["What is your preferred configuration?"] || data["Preferred Configuration"] || data.preferredConfig || data.config || "";
    var message = data["Message"] || data.message || "";
    var leadStatus = "New"; // Default status for new enquiries
    var leadSource = data["Lead Source"] || data.leadSource || data.source || "Website";

    // 3. Read Row 1 Headers
    var lastCol = Math.max(sheet.getLastColumn(), 1);
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // If headers are empty, create the correct headers automatically
    if (!headers || headers.length === 0 || !headers[0]) {
      headers = [
        "Timestamp",
        "Full Name",
        "Mobile Number",
        "Interested Property",
        "Approximate Budget",
        "Purchase Timeline",
        "Preferred Configuration",
        "Message",
        "Lead Status",
        "Lead Source"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    // 4. Map each column by inspecting header title
    var row = headers.map(function(header) {
      var h = String(header).trim().toLowerCase();

      // Column A: Timestamp
      if (h.indexOf("time") !== -1 || h.indexOf("date") !== -1) {
        return timestamp;
      }
      // Column B: Full Name
      if (h.indexOf("name") !== -1) {
        return fullName;
      }
      // Column C: Mobile Number
      if (h.indexOf("mobile") !== -1 || h.indexOf("phone") !== -1 || h.indexOf("contact") !== -1) {
        return mobileNumber;
      }
      // Column D: Interested Property
      if (h.indexOf("property") !== -1 || (h.indexOf("interest") !== -1 && h.indexOf("budget") === -1)) {
        return propertyInterest;
      }
      // Column E: Approximate Budget
      if (h.indexOf("budget") !== -1) {
        return budget;
      }
      // Column F: Purchase Timeline
      if (h.indexOf("timeline") !== -1 || h.indexOf("purchase") !== -1 || h.indexOf("when") !== -1) {
        return timeline;
      }
      // Column G: Preferred Configuration
      if (h.indexOf("config") !== -1 || h.indexOf("preferred") !== -1) {
        return configuration;
      }
      // Column H: Message / Requirements
      if (h.indexOf("message") !== -1 || h.indexOf("requirement") !== -1 || h.indexOf("note") !== -1) {
        return message;
      }
      // Column I: Lead Status
      if (h.indexOf("status") !== -1) {
        return leadStatus;
      }
      // Column J: Lead Source
      if (h.indexOf("source") !== -1) {
        return leadSource;
      }

      // Exact match fallback
      return data[header] || "";
    });

    // 5. Append new row to the sheet
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
