import { Card } from 'antd'
import './App.css'
import RssTable from './components/RssTable'

function App() {

  return (
    <>
      <div>
        <Card title="RSS">
          <RssTable />
        </Card>
      </div>
    </>
  )
}

export default App
