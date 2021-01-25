const express = require('express');
const router = express.Router();
const fs = require('fs');

const ticketsFile = './data/tickets.json';
const ticketTemplateFile = './data/ticket_template.json';
const employeesFile = './data/employees.json';
const areasFile = './data/areas.json';

const getSuitableId = require('../../common/common_functions')

/**
 * @route   GET api/tickets
 * @desc    Get All tickets
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const ticketsRaw = fs.readFileSync(ticketsFile);
    const tickets = JSON.parse(ticketsRaw);
    if (!tickets) throw Error('No tickets');

    res.status(200).json(tickets);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   GET api/tickets/:id
 * @desc    Get a ticket
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const ticketsRaw = fs.readFileSync(ticketsFile);
    const tickets = JSON.parse(ticketsRaw);
    if (!tickets) throw Error('No tickets');

    const ticket = tickets.filter(tick => tick.id === Number(req.params.id))[0];
    if (!ticket) throw Error('ticket not found');

    if (ticket.employees.rows.length > 0) {
      const employees = JSON.parse(fs.readFileSync(employeesFile));
      if (!employees) throw Error('No employees');

      ticket.employees.rows = employees.filter(employee => ticket.employees.rows.includes(employee.id));
      const employeeHeaders = ticket.employees.headers.map(header => header.id);
      employeeHeaders.push('id');

      ticket.employees.rows.forEach(employee => {
        Object.keys(employee).forEach(key => {
          if (!employeeHeaders.includes(key)) {
            delete employee.key;
          }
        });
      });
    }

    if (ticket.area !== undefined && ticket.area !== -1) {
      const areas = JSON.parse(fs.readFileSync(areasFile));
      if (!areas) throw Error('No areas');
      ticket.area = {id: ticket.area, name: areas.filter(area => ticket.area === area.id)[0].name}
    }

    res.status(200).json(ticket);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
* @route   PUT api/tickets/:id
* @desc    Updates An existing ticket
* @access  Public
*/
router.put('/:id', async (req, res) => {
  try {
    const ticketsRaw = fs.readFileSync(ticketsFile);
    let tickets = JSON.parse(ticketsRaw);
    if (!tickets) throw Error('No tickets');

    if (tickets.filter(tick => tick.id === Number(req.params.id)).length <= 0) throw Error('ticket not found');
    if (Number(req.body.id) !== Number(req.params.id)) throw Error('Cant update id');
    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');

    req.body.area = req.body.area.id;
    req.body.employees.rows = req.body.employees.rows.map(emp => emp.id);

    tickets = tickets.filter(tick => tick.id !== Number(req.params.id));
    tickets.push(req.body);

    let payload = JSON.stringify(tickets, null, 2);
    fs.writeFileSync(ticketsFile, payload);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
* @route   POST api/tickets
* @desc    Create A ticket
* @access  Public
*/
router.post('/', async (req, res) => {
  try {
    const tickets = JSON.parse(fs.readFileSync(ticketsFile));
    if (!tickets) throw Error('No tickets');

    let ticketTemplate = JSON.parse(fs.readFileSync(ticketTemplateFile));
    if (!ticketTemplate) throw Error('No ticketTemplate');

    if (!req.body.hasOwnProperty('name')) throw Error('name not defined');
    ticketTemplate.name = req.body.name;
    if (req.body.employee !== undefined) ticketTemplate.employees.rows = [req.body.employee];
    ticketTemplate.id = getSuitableId(tickets);

    tickets.push(ticketTemplate);

    const payload = JSON.stringify(tickets, null, 2);
    fs.writeFileSync(ticketsFile, payload);
    res.status(200).json(ticketTemplate.id);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   DELETE api/tickets/:id
 * @desc    Delete A ticket
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const ticketsRaw = fs.readFileSync(ticketsFile);
    const tickets = JSON.parse(ticketsRaw);
    if (!tickets) throw Error('No tickets');

    if (tickets.filter(tick => tick.id === Number(req.params.id)).length <= 0) throw Error('ticket not found');

    const payload = JSON.stringify(tickets.filter(tick => tick.id !== Number(req.params.id)), null, 2);
    fs.writeFileSync(ticketsFile, payload);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;