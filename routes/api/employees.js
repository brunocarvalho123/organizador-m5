const express = require('express');
const router = express.Router();
const fs = require('fs');

const employeesFile = './data/employees.json';

/**
 * @route   GET api/employees
 * @desc    Get All employees
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const employeesRaw = fs.readFileSync(employeesFile);
    const employees = JSON.parse(employeesRaw);
    if (!employees) throw Error('No employees');

    res.status(200).json(employees);
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
    const employeesRaw = fs.readFileSync(employeesFile);
    const employees = JSON.parse(employeesRaw);
    if (!employees) throw Error('No employees');
    const employee = employees.filter(emp => emp.id === Number(req.params.id))[0];
    if (!employee) throw Error('employee not found');

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
    const employeesRaw = fs.readFileSync(employeesFile);
    const employees = JSON.parse(employeesRaw);
    if (!employees) throw Error('No employees');

    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');
    if (employees.filter(emp => emp.id === Number(req.body.id)).length > 0) throw Error('employee already exists');

    employees.push(req.body);

    const payload = JSON.stringify(employees, null, 2);
    fs.writeFileSync(employeesFile, payload);
    res.status(200).json(req.body);
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