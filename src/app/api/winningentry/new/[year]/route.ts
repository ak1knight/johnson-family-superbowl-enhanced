import data from "../../../../../data";

async function POST(req: Request, { params }: { params: Promise<{ year: string }> }) {
    console.log("/api/winningentry/new HIT!");
    const entry = (await req.json()).entry;
    await data.createWinningEntry(entry, parseInt((await params).year));
    return Response.json('OK');
};

export {
    POST
};