interface Environment {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    if (new URL(request.url).pathname.startsWith('/api/')) {
      return Response.json({ error: 'Endpoint not found.' }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};
