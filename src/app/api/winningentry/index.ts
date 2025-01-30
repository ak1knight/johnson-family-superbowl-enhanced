import data from '../../../data'

async function getCurrentWinningEntry(req, res) {
    console.log('/api/winningentry HIT!');
    let r = await data.getWinningEntry(2023);
    res.status(200).json(r);
};

export default getCurrentWinningEntry;