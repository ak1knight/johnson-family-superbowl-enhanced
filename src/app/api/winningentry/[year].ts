import data from '../../../data'

async function getWinningEntry(req, res) {
    console.log('/api/winningentry HIT!');
    let r = await data.getWinningEntry(parseInt(req.query.year));
    res.status(200).json(r);
};

export default getWinningEntry;