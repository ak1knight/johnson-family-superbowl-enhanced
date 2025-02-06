import data from '../../../data'

async function get(req: Request, { params }: { params: Promise<{ entryId: number }> }) {
    console.log('/api/entry/get HIT!');
    console.log((await params).entryId);
    const r = await data.getEntry((await params).entryId);
    return Response.json(r);
};

export default get;