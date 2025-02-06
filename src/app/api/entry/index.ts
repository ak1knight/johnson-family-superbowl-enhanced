import data from '../../../data'

async function get() {
    console.log('/api/entry HIT!');
    const r = await data.readEntries(2020);
    return Response.json(r);
};

export default get;