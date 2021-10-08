import React, { useEffect, useState } from 'react'
import currentUser from './helpers/currentUser'
import { ipcRenderer } from 'electron'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { GlobalStyle } from './styles/GlobalStyle'
import Routes from './routes'
import 'antd/dist/antd.css'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    ipcRenderer.send('user:get')
    ipcRenderer.once('user:get:response', (event, user) => {
      currentUser.logIn(user)
      setLoading(false)
    })
  }, [])
  return (
    <BrowserRouter>
      <GlobalStyle />
      {loading ? <div>Inicializando App.ts</div> : <Routes />}
    </BrowserRouter>
  )
}

render(<App />, mainElement)
