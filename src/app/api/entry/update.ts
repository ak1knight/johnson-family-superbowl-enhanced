import data from '../../../data'

async function update(req: Request, { params }: { params: Promise<{ entryId: number }> }) {
    console.log('/api/entry/get HIT!');
    const entryId = (await params).entryId;
    const entry = (await req.json()).entry;
    console.log(entry);
    await data.updateEntry(entryId, entry);
    return Response.json("OK");
}

export default update;