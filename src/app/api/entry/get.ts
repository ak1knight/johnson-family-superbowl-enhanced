import data from '../../../data'

async function get(req, res) {
    console.log('/api/entry/get HIT!');
    console.log(req.query);
    let r = await data.getEntry(req.query.entryId);
    res.status(200).json(r);
};

export default get;