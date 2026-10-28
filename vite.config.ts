import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Serve the Vercel Functions in api/ during `npm run dev`, so features like the view count work
// locally without `vercel dev`. Env vars come from .env.local (written by `vercel env pull`).
// In production, Vercel runs api/ itself and this plugin is unused.
function vercelFunctions(): Plugin {
  return {
    name: 'vercel-functions-dev',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/([\w-]+)/)
        if (!match) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.ts`)
          const handler: ((request: Request) => Promise<Response>) | undefined = req.method
            ? mod[req.method]
            : undefined
          if (!handler) {
            res.statusCode = 405
            return res.end()
          }
          const response = await handler(new Request(`http://localhost${req.url}`, { method: req.method }))
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.config.logger.error(`[api] ${(error as Error).message}`)
          res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelFunctions()],
})
