const express = require('express');
const router = express.Router();
const fs = require('fs');

const projectsFile = './data/projects.json';
const projectTemplateFile = './data/project_template.json';
const employeesFile = './data/employees.json';
const areasFile = './data/areas.json';

const getSuitableId = require('../../common/common_functions')

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

    const employees = JSON.parse(fs.readFileSync(employeesFile));
    if (!employees) throw Error('No employees');

    // project.employees.rows = employees.filter(employee => project.employees.rows.includes(employee.id));
    project.employees.rows = employees.filter(employee => employee.projects.rows.includes(project.id));
    const employeeHeaders = project.employees.headers.map(header => header.id);
    employeeHeaders.push('id');

    project.employees.rows.forEach(employee => {
      Object.keys(employee).forEach(key => {
        if (!employeeHeaders.includes(key)) {
          delete employee.key;
        }
      });
    });

    const areas = JSON.parse(fs.readFileSync(areasFile));
    if (!areas) throw Error('No areas');
    // project.area = {id: project.area, name: areas.filter(area => project.area === area.id)[0].name}
    const proj_area = areas.filter(area => area.projects.rows.includes(project.id))[0];
    if (proj_area) project.area = {id: proj_area.id, name: proj_area.name};

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


    if (req.body.area.id !== undefined) {
      let areas = JSON.parse(fs.readFileSync(areasFile));
      if (!areas) throw Error('No areas');
      const proj_area = areas.filter(area => area.id === Number(req.body.area.id))[0];

      proj_area.projects.rows.filter(item => item !== Number(req.params.id));
      proj_area.projects.rows.push(Number(req.params.id));

      areas = areas.filter(are => are.id !== Number(proj_area.id));
      areas.push(proj_area);
      let payload = JSON.stringify(areas, null, 2);
      fs.writeFileSync(areasFile, payload);
      req.body.area = -1;
    }

    req.body.employees.rows = req.body.employees.rows.map(emp => emp.id);
    if (req.body.employees.rows.length > 0) {
      let employees = JSON.parse(fs.readFileSync(employeesFile));
      if (!employees) throw Error('No employees');
      let proj_employees = employees.filter(employee => req.body.employees.rows.includes(employee.id));

      proj_employees.forEach(employee => {
        employee.projects.rows.indexOf(Number(req.params.id)) === -1 ? employee.projects.rows.push(Number(req.params.id)) : console.log("");
      });

      employees = employees.filter(emp => !proj_employees.includes(emp.id));
      employees.concat(proj_employees);

      let payload = JSON.stringify(employees, null, 2);
      fs.writeFileSync(employeesFile, payload);
      req.body.employees.rows = [];
    }


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
    const projects = JSON.parse(fs.readFileSync(projectsFile));
    if (!projects) throw Error('No projects');

    let projectTemplate = JSON.parse(fs.readFileSync(projectTemplateFile));
    if (!projectTemplate) throw Error('No projectTemplate');

    if (!req.body.hasOwnProperty('name')) throw Error('name not defined');
    projectTemplate.name = req.body.name;
    projectTemplate.id = getSuitableId(projects);

    projects.push(projectTemplate);

    const payload = JSON.stringify(projects, null, 2);
    fs.writeFileSync(projectsFile, payload);
    res.status(200).json(projectTemplate.id);
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