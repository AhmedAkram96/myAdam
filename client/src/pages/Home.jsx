import { useState, useEffect } from 'react'
import axios from 'axios'

function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data')
        setData(response.data)
        setLoading(false)
      } catch (err) {
        setError('Error fetching data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="home">
      <h1>Welcome to React App</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}

export default Home 