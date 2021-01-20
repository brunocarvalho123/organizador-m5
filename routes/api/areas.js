const express = require('express');
const router = express.Router();
const fs = require('fs');

const areasFile = './data/areas.json';

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