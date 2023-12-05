import joi from 'joi';

import { cookies } from 'next/headers';

import { apiHandler } from '_helpers/server/api';
import { playersRepo } from '_helpers/server';

module.exports = apiHandler({
    GET: getById,
    PUT: update,
    DELETE: _delete
});

async function getById(req: Request, { params: { id } }: any) {
    return await playersRepo.getById(id);
}

async function update(req: Request, { params: { id } }: any) {
    const body = await req.json();
    await playersRepo.update(id, body);
}

update.schema = joi.object({
    title: joi.string(),
    configuration: joi.object(),
});

async function _delete(req: Request, { params: { id } }: any) {
    await playersRepo.delete(id);
}