const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const projects = require("./routes/api/projects");
const processes = require("./routes/api/processes");
const tickets = require("./routes/api/tickets");
const areas = require("./routes/api/areas");
const employees = require("./routes/api/employees");

const app = express();

const path = require("path");

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Use Routes
app.use('/api/projects', projects);
app.use('/api/processes', processes);
app.use('/api/tickets', tickets);
app.use('/api/employees', employees);
app.use('/api/areas', areas);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/dist'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});