import { useEffect, useState } from 'react'
import { fetchApi, type HealthResponse } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApi<HealthResponse>('/health')
      .then(setHealth)
      .catch((e) => setError(String(e)))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>FishingReels</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">Backend error: {error}</p>
          ) : health ? (
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">status</dt>
                <dd>{health.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">db</dt>
                <dd>{health.db}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-muted-foreground">Loading…</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default App
