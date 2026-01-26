import data from '../../../../data'

async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
    try {
        console.log('/api/winningentry HIT!');
        const year = parseInt((await params).year);
        if (isNaN(year)) {
            return Response.json({ error: "Invalid year parameter" }, { status: 400 });
        }
        const r = await data.getWinningEntry(year);
        return Response.json(r);
    } catch (error) {
        console.error("Error getting winning entry:", error);
        return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
};

export {
    GET
};