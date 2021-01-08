import * as Hapi from '@hapi/hapi';
import { createServer } from '../src/server';

describe('Status plugin', () => {
  let server: Hapi.Server;

  beforeAll(async () => { server = await createServer() });
  afterAll(async () => { await server.stop() });

  test('Status endpoint returns 200', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/'
    });
    expect(res.statusCode).toEqual(200);
    const resPayload = JSON.parse(res.payload);
    expect(resPayload.up).toEqual(true);
  });
});
