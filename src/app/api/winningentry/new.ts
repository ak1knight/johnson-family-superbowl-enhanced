import data from "../../../data";

async function createWinningEntry(req: Request) {
    console.log("/api/winningentry/new HIT!");
    const entry = (await req.json()).entry;
    await data.createWinningEntry(entry, 2022);
    return Response.json("OK");
};

export default createWinningEntry;