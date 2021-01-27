const express = require('express');
const router = express.Router();
const fs = require('fs');

const processesFile = './data/processes.json';
const processTemplateFile = './data/process_template.json';
const employeesFile = './data/employees.json';
const areasFile = './data/areas.json';

const getSuitableId = require('../../common/common_functions')

/**
 * @route   GET api/processes
 * @desc    Get All processes
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const processesRaw = fs.readFileSync(processesFile);
    const processes = JSON.parse(processesRaw);
    if (!processes) throw Error('No processes');

    res.status(200).json(processes);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   GET api/processes/:id
 * @desc    Get a process
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const processesRaw = fs.readFileSync(processesFile);
    const processes = JSON.parse(processesRaw);
    if (!processes) throw Error('No processes');

    const process = processes.filter(proc => proc.id === Number(req.params.id))[0];
    if (!process) throw Error('process not found');

    const employees = JSON.parse(fs.readFileSync(employeesFile));
    if (!employees) throw Error('No employees');

    // process.employees.rows = employees.filter(employee => process.employees.rows.includes(employee.id));
    process.employees.rows = employees.filter(employee => employee.processes.rows.includes(process.id));
    const employeeHeaders = process.employees.headers.map(header => header.id);
    employeeHeaders.push('id');

    process.employees.rows.forEach(employee => {
      Object.keys(employee).forEach(key => {
        if (!employeeHeaders.includes(key)) {
          delete employee.key;
        }
      });
    });

    const areas = JSON.parse(fs.readFileSync(areasFile));
    if (!areas) throw Error('No areas');
    // process.area = {id: process.area, name: areas.filter(area => process.area === area.id)[0].name}
    const proc_area = areas.filter(area => area.processes.rows.includes(process.id))[0];
    if (proc_area) process.area = {id: proc_area.id, name: proc_area.name};

    res.status(200).json(process);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
* @route   PUT api/processes/:id
* @desc    Updates An existing process
* @access  Public
*/
router.put('/:id', async (req, res) => {
  try {
    const processesRaw = fs.readFileSync(processesFile);
    let processes = JSON.parse(processesRaw);
    if (!processes) throw Error('No processes');

    if (processes.filter(proc => proc.id === Number(req.params.id)).length <= 0) throw Error('process not found');
    if (Number(req.body.id) !== Number(req.params.id)) throw Error('Cant update id');
    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');

    if (req.body.area.id !== undefined) {
      let areas = JSON.parse(fs.readFileSync(areasFile));
      if (!areas) throw Error('No areas');
      const proc_area = areas.filter(area => area.id === Number(req.body.area.id))[0];

      proc_area.processes.rows.filter(item => item !== Number(req.params.id));
      proc_area.processes.rows.push(Number(req.params.id));

      areas = areas.filter(are => are.id !== Number(proc_area.id));
      areas.push(proc_area);
      let payload = JSON.stringify(areas, null, 2);
      fs.writeFileSync(areasFile, payload);
      req.body.area = -1;
    }

    req.body.employees.rows = req.body.employees.rows.map(emp => emp.id);
    if (req.body.employees.rows.length > 0) {
      let employees = JSON.parse(fs.readFileSync(employeesFile));
      if (!employees) throw Error('No employees');
      let proc_employees = employees.filter(employee => req.body.employees.rows.includes(employee.id));

      proc_employees.forEach(employee => {
        employee.processes.rows.indexOf(Number(req.params.id)) === -1 ? employee.processes.rows.push(Number(req.params.id)) : console.log("");
      });

      employees = employees.filter(emp => !proc_employees.includes(emp.id));
      employees.concat(proc_employees);

      let payload = JSON.stringify(employees, null, 2);
      fs.writeFileSync(employeesFile, payload);
      req.body.employees.rows = [];
    }

    processes = processes.filter(proc => proc.id !== Number(req.params.id));
    processes.push(req.body);

    let payload = JSON.stringify(processes, null, 2);
    fs.writeFileSync(processesFile, payload);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
* @route   POST api/processes
* @desc    Create A process
* @access  Public
*/
router.post('/', async (req, res) => {
  try {
    const processes = JSON.parse(fs.readFileSync(processesFile));
    if (!processes) throw Error('No processes');

    let processTemplate = JSON.parse(fs.readFileSync(processTemplateFile));
    if (!processTemplate) throw Error('No processTemplate');

    if (!req.body.hasOwnProperty('name')) throw Error('name not defined');
    processTemplate.name = req.body.name;
    processTemplate.id = getSuitableId(processes);

    processes.push(processTemplate);

    const payload = JSON.stringify(processes, null, 2);
    fs.writeFileSync(processesFile, payload);
    res.status(200).json(processTemplate.id);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   DELETE api/processes/:id
 * @desc    Delete A process
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const processesRaw = fs.readFileSync(processesFile);
    const processes = JSON.parse(processesRaw);
    if (!processes) throw Error('No processes');

    if (processes.filter(proc => proc.id === Number(req.params.id)).length <= 0) throw Error('process not found');

    const payload = JSON.stringify(processes.filter(proc => proc.id !== Number(req.params.id)), null, 2);
    fs.writeFileSync(processesFile, payload);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;