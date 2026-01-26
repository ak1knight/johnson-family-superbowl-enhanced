import data from "../../../../../data";

async function POST(req: Request, { params }: { params: Promise<{ year: string }> }) {
    try {
        console.log("/api/winningentry/new HIT!");
        const year = parseInt((await params).year);
        if (isNaN(year)) {
            return Response.json({ error: "Invalid year parameter" }, { status: 400 });
        }
        const entry = (await req.json()).entry;
        await data.createWinningEntry(entry, year);
        return Response.json({ success: true });
    } catch (error) {
        console.error("Error creating winning entry:", error);
        return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
};

export {
    POST
};