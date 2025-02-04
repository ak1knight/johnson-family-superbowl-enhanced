import data from '../../../../data'

async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
    console.log('/api/winningentry HIT!');
    const r = await data.getWinningEntry(parseInt((await params).year));
    return Response.json(r);
};

export {
    GET
};