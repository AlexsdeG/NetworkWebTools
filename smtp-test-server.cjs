/**
 * SMTP Test Server
 * Listens for incoming mail and parses content for verification.
 * Install
 * npm install smtp-server mailparser
 * 
 * Usage
 * node smtp-test-server.cjs
 */

const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require("mailparser").simpleParser;

/**
 * Enhanced SMTP Test Server
 * Listens for incoming mail and parses content for verification.
 */
const server = new SMTPServer({
  authOptional: true,
  disabledCommands: ['AUTH', 'STARTTLS'], // Force plain text for easy testing
  banner: "Welcome to Private SMTP Test Server",
  
  onConnect(session, callback) {
    console.log(`[CONN] Connection from: ${session.remoteAddress}`);
    return callback(); 
  },

  onMailFrom(address, session, callback) {
    console.log(`[FROM] ${address.address}`);
    return callback();
  },

  onData(stream, session, callback) {
    simpleParser(stream, (err, parsed) => {
      if (err) {
        console.error("[ERROR] Parser Error:", err);
      } else {
        console.log("\n" + "=".repeat(30));
        console.log("--- NEW EMAIL RECEIVED ---");
        console.log(`Date:    ${new Date().toLocaleString()}`);
        console.log(`From:    ${parsed.from?.text || 'Unknown'}`);
        console.log(`To:      ${parsed.to?.text || 'Unknown'}`);
        console.log(`Subject: ${parsed.subject || '(No Subject)'}`);
        console.log("-".repeat(30));
        console.log("Body:");
        console.log(parsed.text || parsed.html || '(Empty Body)');
        console.log("=".repeat(30) + "\n");
      }
      callback();
    });
  }
});

const PORT = 25;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SMTP Test Server is globally listening on Port ${PORT}...`);
  console.log("Press Ctrl+C to stop.");
});
