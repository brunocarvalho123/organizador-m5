const express = require('express');
const router = express.Router();
const fs = require('fs');

const projectsFile = './data/projects.json';
const employeesFile = './data/employees.json';
const areasFile = './data/areas.json';

/**
 * @route   GET api/projects
 * @desc    Get All projects
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const projectsRaw = fs.readFileSync(projectsFile);
    const projects = JSON.parse(projectsRaw);
    if (!projects) throw Error('No projects');

    res.status(200).json(projects);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   GET api/projects/:id
 * @desc    Get a project
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const projectsRaw = fs.readFileSync(projectsFile);
    const projects = JSON.parse(projectsRaw);
    if (!projects) throw Error('No projects');

    const project = projects.filter(proj => proj.id === Number(req.params.id))[0];
    if (!project) throw Error('Project not found');

    if (project.employees.rows.length > 0) {
      const employees = JSON.parse(fs.readFileSync(employeesFile));
      if (!employees) throw Error('No employees');

      project.employees.rows = employees.filter(employee => project.employees.rows.includes(employee.id));
      const employeeHeaders = project.employees.headers.map(header => header.id);
      employeeHeaders.push('id');

      project.employees.rows.forEach(employee => {
        Object.keys(employee).forEach(key => {
          if (!employeeHeaders.includes(key)) {
            delete employee.key;
          }
        });
      });
    }

    if (project.area !== undefined) {
      const areas = JSON.parse(fs.readFileSync(areasFile));
      if (!areas) throw Error('No areas');
      project.area = {id: project.area, name: areas.filter(area => project.area === area.id)[0].name}
    }

    res.status(200).json(project);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
* @route   PUT api/projects/:id
* @desc    Updates An existing Project
* @access  Public
*/
router.put('/:id', async (req, res) => {
  try {
    const projectsRaw = fs.readFileSync(projectsFile);
    let projects = JSON.parse(projectsRaw);
    if (!projects) throw Error('No projects');

    if (projects.filter(proj => proj.id === Number(req.params.id)).length <= 0) throw Error('Project not found');
    if (Number(req.body.id) !== Number(req.params.id)) throw Error('Cant update id');
    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');

    req.body.area = req.body.area.id;
    req.body.employees.rows = req.body.employees.rows.map(emp => emp.id);

    projects = projects.filter(proj => proj.id !== Number(req.params.id));
    projects.push(req.body);

    let payload = JSON.stringify(projects, null, 2);
    fs.writeFileSync(projectsFile, payload);

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
* @route   POST api/projects
* @desc    Create A Project
* @access  Public
*/
router.post('/', async (req, res) => {
  try {
    const projectsRaw = fs.readFileSync(projectsFile);
    const projects = JSON.parse(projectsRaw);
    if (!projects) throw Error('No projects');

    if (!req.body.hasOwnProperty('id')) throw Error('Id not defined');
    if (projects.filter(proj => proj.id === Number(req.body.id)).length > 0) throw Error('Project already exists');

    if (req.body.area !== undefined && req.body.area.id !== undefined) req.body.area = req.body.area.id;
    if (req.body.employees !== undefined) req.body.employees.rows = req.body.employees.rows.map(emp => emp.id);

    projects.push(req.body);

    const payload = JSON.stringify(projects, null, 2);
    fs.writeFileSync(projectsFile, payload);
    res.status(200).json(req.body);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});


/**
 * @route   DELETE api/projects/:id
 * @desc    Delete A Project
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
  try {
    const projectsRaw = fs.readFileSync(projectsFile);
    const projects = JSON.parse(projectsRaw);
    if (!projects) throw Error('No projects');

    if (projects.filter(proj => proj.id === Number(req.params.id)).length <= 0) throw Error('Project not found');

    const payload = JSON.stringify(projects.filter(proj => proj.id !== Number(req.params.id)), null, 2);
    fs.writeFileSync(projectsFile, payload);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;