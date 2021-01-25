const express = require('express');
const router = express.Router();
const fs = require('fs');

const projectsFile = './data/projects.json';
const processesFile = './data/processes.json';
const ticketsFile = './data/tickets.json';
const employeesFile = './data/employees.json';
const areasFile = './data/areas.json';


/**
 * @route   GET api/tickets/:id
 * @desc    Get a ticket
 * @access  Public
 */
router.get('/:search_params', (req, res) => {
  try {
    const ticketsRaw = fs.readFileSync(ticketsFile);
    const tickets = JSON.parse(ticketsRaw).map(ticket => {return {url: '/ticket', type: 'Ticket', name: ticket.name, real_id: ticket.id};});
    if (!tickets) throw Error('No tickets');

    const processesRaw = fs.readFileSync(processesFile);
    const processes = JSON.parse(processesRaw).map(process => {return {url: '/process', type: 'Processo', name: process.name, real_id: process.id};});
    if (!processes) throw Error('No processes');

    const projectsRaw = fs.readFileSync(projectsFile);
    const projects = JSON.parse(projectsRaw).map(project => {return {url: '/project', type: 'Projeto', name: project.name, real_id: project.id};});
    if (!projects) throw Error('No projects');

    const areasRaw = fs.readFileSync(areasFile);
    const areas = JSON.parse(areasRaw).map(area => {return {url: '/area', type: 'Área', name: area.name, real_id: area.id};});
    if (!areas) throw Error('No areas');

    const employeesRaw = fs.readFileSync(employeesFile);
    const employees = JSON.parse(employeesRaw).map(employee => {return {url: '/employee', type: 'Colaborador', name: employee.name, real_id: employee.id};});
    if (!employees) throw Error('No employees');

    const items = tickets.concat(projects).concat(processes).concat(areas).concat(employees);

    const response = items.filter(item => item.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(req.params.search_params.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")));
    response.map((item,idx) => item.id = idx);

    console.log(response);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


module.exports = router;