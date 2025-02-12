import data from '../../../../data'

async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
    const r = await data.readEntries(parseInt((await params).year));
    return Response.json(r);
};

export {
    GET
};