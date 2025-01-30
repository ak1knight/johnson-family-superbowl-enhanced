import data from '../../../../data'
import { Entry } from '../../../../data/formdata';

async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
    console.log(req, params);
    const r = await data.readEntries((await params).year);
    return Response.json(r);
};

export {
    GET
};