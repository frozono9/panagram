import { json, type RequestHandler } from "@sveltejs/kit";
import { getTriggerState } from "$lib/server/stores";

export const GET: RequestHandler = async () => {
    const state = getTriggerState();
    return json({ trigger: state });
};
