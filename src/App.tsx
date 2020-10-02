import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { HotKeys } from 'react-hotkeys'
import { GlobalStyle } from './styles/GlobalStyle'
import Routes from './routes'
import 'antd/dist/antd.css'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const keyMap = {
  MONEY: 'a',
  C_CREDIT: 's',
  C_DEBIT: 'd',
  TICKET: 't',
  REGISTER: 'f1',
}

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <HotKeys keyMap={keyMap}>
        <Routes />
      </HotKeys>
    </BrowserRouter>
  )
}

render(<App />, mainElement)
