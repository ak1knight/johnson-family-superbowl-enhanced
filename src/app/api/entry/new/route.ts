import data from "../../../../data";

async function POST(req: Request) {
    console.log("/api/entry/new HIT!");
    const entry = (await req.json()).entry;
    await data.createEntry(entry);
    return Response.json("OK");
};

export {
    POST
};