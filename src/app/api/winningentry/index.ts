import data from '../../../data'

async function getCurrentWinningEntry() {
    console.log('/api/winningentry HIT!');
    const r = await data.getWinningEntry(2023);
    return Response.json(r);
};

export default getCurrentWinningEntry;