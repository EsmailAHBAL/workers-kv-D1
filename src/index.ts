import { Hono } from 'hono'
type Binding = {
  CACHE: KVNamespace
}
const app = new Hono<any>()

app.get("/:username", async c => {
  const username = c.req.param("username")
  const respCached = await c.env.CACHE.get(username)
  if (respCached) return c.json(respCached)
  const res = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      "User-Agent": "CF-Worker"
    }
  })
  const data = await res.json()
  await c.env.CACHE.put(username, JSON.stringify(data))
  return c.json({ data: data })
})

export default app
