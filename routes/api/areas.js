const express = require('express');
const moment = require('moment');
const router = express.Router();
const fs = require('fs');

const employeesFile = './data/employees.json';
const projectsFile = './data/projects.json';
const areasFile = './data/areas.json';
const processesFile = './data/processes.json';
const ticketsFile = './data/tickets.json';


/**
 * @route   GET api/areas
 * @desc    Get All areas
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const areasRaw = fs.readFileSync(areasFile);
    const areas = JSON.parse(areasRaw);
    if (!areas) throw Error('No areas');

    res.status(200).json(areas);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   GET api/areas/:id
 * @desc    Get an area
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const areasRaw = fs.readFileSync(areasFile);
    const areas = JSON.parse(areasRaw);
    if (!areas) throw Error('No areas');
    const area = areas.filter(are => are.id === Number(req.params.id))[0];
    if (!area) throw Error('area not found');

    if (area.projects.rows.length > 0) {
      const projects = JSON.parse(fs.readFileSync(projectsFile));
      if (!projects) throw Error('No projects');

      area.projects.rows = projects.filter(project => area.projects.rows.includes(project.id));
      const projectHeaders = area.projects.headers.map(header => header.id);
      projectHeaders.push('id');

      area.projects.rows.forEach(project => {
        project.progress = ((project.tasks.rows.filter(task => task.done).length / project.tasks.rows.length).toFixed(2) * 100)

        if (project.start_date && project.end_date) {
          const todayDate = new Date();
          const endDate = moment(project.end_date, "YYYY-MM-DD").toDate();

          if (todayDate.getTime() <= endDate.getTime() ) {
            project.daysLeft = Math.round((endDate.getTime() - todayDate.getTime()) / (1000 * 3600 * 24));
          } else {
            project.daysLeft = 0;
          }
        }
      });

      area.projects.rows.forEach(project => {
        Object.keys(project).forEach(key => {
          if (!projectHeaders.includes(key)) {
            delete project.key;
          }
        });
      });
    }
    if (area.processes.rows.length > 0) {
      const processes = JSON.parse(fs.readFileSync(processesFile));
      if (!processes) throw Error('No processes');

      area.processes.rows = processes.filter(process => area.processes.rows.includes(process.id));
      const processHeaders = area.processes.headers.map(header => header.id);
      processHeaders.push('id');

      area.processes.rows.forEach(process => {
        Object.keys(process).forEach(key => {
          if (!processHeaders.includes(key)) {
            delete process.key;
          }
        });
      });
    }
    if (area.tickets.rows.length > 0) {
      const tickets = JSON.parse(fs.readFileSync(ticketsFile));
      if (!tickets) throw Error('No tickets');

      area.tickets.rows = tickets.filter(ticket => area.tickets.rows.includes(ticket.id));
      const ticketHeaders = area.tickets.headers.map(header => header.id);
      ticketHeaders.push('id');

      area.tickets.rows.forEach(ticket => {
        Object.keys(ticket).forEach(key => {
          if (!ticketHeaders.includes(key)) {
            delete ticket.key;
          }
        });
      });
    }
    if (area.employees.rows.length > 0) {
      const employees = JSON.parse(fs.readFileSync(employeesFile));
      if (!employees) throw Error('No employees');

      area.employees.rows = employees.filter(employee => area.employees.rows.includes(employee.id));
      const employeeHeaders = area.employees.headers.map(header => header.id);
      employeeHeaders.push('id');

      area.employees.rows.forEach(area => {
        Object.keys(area).forEach(key => {
          if (!employeeHeaders.includes(key)) {
            delete area.key;
          }
        });
      });
    }

    res.status(200).json(area);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
* @route   PUT api/areas/:id
* @desc    Updates An existing area
* @access  Public
*/
router.put('/:id', async (req, res) => {
  try {
    const areasRaw = fs.readFileSync(areasFile);
    let areas = JSON.parse(areasRaw);
    if (!areas) throw Error('No areas');

    if (areas.filter(are => are.id === Number(req.params.id)).length <= 0) throw Error('area not found');
    if (Number(req.body.id) !== Number(req.params.id)) throw Error('Cant update id');
    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');

    req.body.employees.rows = req.body.employees.rows.map(employee => employee.id);
    req.body.projects.rows = req.body.projects.rows.map(project => project.id);
    req.body.tickets.rows = req.body.tickets.rows.map(ticket => ticket.id);
    req.body.processes.rows = req.body.processes.rows.map(process => process.id);

    areas = areas.filter(are => are.id !== Number(req.params.id));
    areas.push(req.body);

    let payload = JSON.stringify(areas, null, 2);
    fs.writeFileSync(areasFile, payload);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
* @route   POST api/areas
* @desc    Create A area
* @access  Public
*/
router.post('/', async (req, res) => {
  try {
    const areasRaw = fs.readFileSync(areasFile);
    const areas = JSON.parse(areasRaw);
    if (!areas) throw Error('No areas');

    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');
    if (areas.filter(are => are.id === Number(req.body.id)).length > 0) throw Error('area already exists');

    areas.push(req.body);

    const payload = JSON.stringify(areas, null, 2);
    fs.writeFileSync(areasFile, payload);
    res.status(200).json(req.body);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   DELETE api/areas/:id
 * @desc    Delete A area
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const areasRaw = fs.readFileSync(areasFile);
    const areas = JSON.parse(areasRaw);
    if (!areas) throw Error('No areas');

    if (areas.filter(are => are.id === Number(req.params.id)).length <= 0) throw Error('area not found');

    const payload = JSON.stringify(areas.filter(are => are.id !== Number(req.params.id)), null, 2);
    fs.writeFileSync(areasFile, payload);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;