import data from '../../../../data'

async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
    try {
        const year = parseInt((await params).year);
        if (isNaN(year)) {
            return Response.json({ error: "Invalid year parameter" }, { status: 400 });
        }
        const r = await data.readEntries(year);
        return Response.json(r);
    } catch (error) {
        console.error("Error reading entries:", error);
        return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
};

export {
    GET
};