import data from '../../../data'

async function get(req, res) {
    console.log('/api/entry HIT!');
    let r = await data.readEntries(2020);
    res.status(200).json(r);
};

export default get;