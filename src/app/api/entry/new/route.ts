import data from "../../../../data";

async function POST(req: Request) {
    try {
        console.log("/api/entry/new HIT!");
        const entry = (await req.json()).entry;
        await data.createEntry(entry);
        return Response.json({ success: true });
    } catch (error) {
        console.error("Error creating entry:", error);
        return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
};

export {
    POST
};