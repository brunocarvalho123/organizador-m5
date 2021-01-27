const express = require('express');
const moment = require('moment');
const router = express.Router();
const fs = require('fs');

const employeesFile = './data/employees.json';
const employeeTemplateFile = './data/employee_template.json';
const projectsFile = './data/projects.json';
const areasFile = './data/areas.json';
const processesFile = './data/processes.json';
const ticketsFile = './data/tickets.json';

const getSuitableId = require('../../common/common_functions')

/**
 * @route   GET api/employees
 * @desc    Get All employees
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile));
    if (!employees) throw Error('No employees');

    res.status(200).json(employees.sort((a, b) => a.id - b.id));
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   GET api/employees/:id
 * @desc    Get an employee
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile));
    if (!employees) throw Error('No employees');

    const employee = employees.filter(emp => emp.id === Number(req.params.id))[0];
    if (!employee) throw Error('employee not found');

    if (employee.projects.rows.length > 0) {
      const projects = JSON.parse(fs.readFileSync(projectsFile));
      if (!projects) throw Error('No projects');

      employee.projects.rows = projects.filter(project => employee.projects.rows.includes(project.id));
      const projectHeaders = employee.projects.headers.map(header => header.id);
      projectHeaders.push('id');

      employee.projects.rows.forEach(project => {
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

      employee.projects.rows.forEach(project => {
        Object.keys(project).forEach(key => {
          if (!projectHeaders.includes(key)) {
            delete project.key;
          }
        });
      });
    }
    if (employee.processes.rows.length > 0) {
      const processes = JSON.parse(fs.readFileSync(processesFile));
      if (!processes) throw Error('No processes');

      employee.processes.rows = processes.filter(process => employee.processes.rows.includes(process.id));
      const processHeaders = employee.processes.headers.map(header => header.id);
      processHeaders.push('id');

      employee.processes.rows.forEach(process => {
        process.nErrors = process.errors.rows.length;
      });

      employee.processes.rows.forEach(process => {
        Object.keys(process).forEach(key => {
          if (!processHeaders.includes(key)) {
            delete process.key;
          }
        });
      });
    }
    if (employee.tickets.rows.length > 0) {
      const tickets = JSON.parse(fs.readFileSync(ticketsFile));
      if (!tickets) throw Error('No tickets');

      employee.tickets.rows = tickets.filter(ticket => employee.tickets.rows.includes(ticket.id));
      const ticketHeaders = employee.tickets.headers.map(header => header.id);
      ticketHeaders.push('id');

      employee.tickets.rows.forEach(ticket => {
        Object.keys(ticket).forEach(key => {
          if (!ticketHeaders.includes(key)) {
            delete ticket.key;
          }
        });
      });
    }
    if (employee.areas.rows.length > 0) {
      const areas = JSON.parse(fs.readFileSync(areasFile));
      if (!areas) throw Error('No areas');

      employee.areas.rows = areas.filter(area => employee.areas.rows.includes(area.id));
      const areaHeaders = employee.areas.headers.map(header => header.id);
      areaHeaders.push('id');

      employee.areas.rows.forEach(area => {
        Object.keys(area).forEach(key => {
          if (!areaHeaders.includes(key)) {
            delete area.key;
          }
        });
      });
    }

    res.status(200).json(employee);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
* @route   PUT api/employees/:id
* @desc    Updates An existing employee
* @access  Public
*/
router.put('/:id', async (req, res) => {
  try {
    const employeesRaw = fs.readFileSync(employeesFile);
    let employees = JSON.parse(employeesRaw);
    if (!employees) throw Error('No employees');

    if (employees.filter(emp => emp.id === Number(req.params.id)).length <= 0) throw Error('employee not found');
    if (Number(req.body.id) !== Number(req.params.id)) throw Error('Cant update id');
    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');

    req.body.projects.rows = req.body.projects.rows.map(project => project.id);
    req.body.tickets.rows = req.body.tickets.rows.map(ticket => ticket.id);
    req.body.processes.rows = req.body.processes.rows.map(process => process.id);

    req.body.areas.rows = req.body.areas.rows.map(area => area.id);
    if (req.body.areas.rows.length > 0) {
      let areas = JSON.parse(fs.readFileSync(areasFile));
      if (!areas) throw Error('No areas');
      let emp_areas = areas.filter(area => req.body.areas.rows.includes(area.id));

      emp_areas.forEach(area => {
        area.employees.rows.indexOf(Number(req.params.id)) === -1 ? area.employees.rows.push(Number(req.params.id)) : console.log("");
      });

      areas = areas.filter(emp => !emp_areas.includes(emp.id));
      areas.concat(emp_areas);

      let payload = JSON.stringify(areas, null, 2);
      fs.writeFileSync(areasFile, payload);
    }

    employees = employees.filter(emp => emp.id !== Number(req.params.id));
    employees.push(req.body);

    let payload = JSON.stringify(employees, null, 2);
    fs.writeFileSync(employeesFile, payload);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
* @route   POST api/employees
* @desc    Create A employee
* @access  Public
*/
router.post('/', async (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(employeesFile));
    if (!employees) throw Error('No employees');

    let employeeTemplate = JSON.parse(fs.readFileSync(employeeTemplateFile));
    if (!employeeTemplate) throw Error('No employeeTemplate');

    if (!req.body.hasOwnProperty('name') && !req.body.name) throw Error('name not defined');
    employeeTemplate.name = req.body.name;
    employeeTemplate.id = getSuitableId(employees);

    employees.push(employeeTemplate);

    const payload = JSON.stringify(employees, null, 2);
    fs.writeFileSync(employeesFile, payload);
    res.status(200).json(employeeTemplate.id);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   DELETE api/employees/:id
 * @desc    Delete A employee
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const employeesRaw = fs.readFileSync(employeesFile);
    const employees = JSON.parse(employeesRaw);
    if (!employees) throw Error('No employees');

    if (employees.filter(emp => emp.id === Number(req.params.id)).length <= 0) throw Error('employee not found');

    const payload = JSON.stringify(employees.filter(emp => emp.id !== Number(req.params.id)), null, 2);
    fs.writeFileSync(employeesFile, payload);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;