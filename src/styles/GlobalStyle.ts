import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    background: white;
  }

  :root {
    --primary-orange: #FF9D0A;
    --button-add: #007C05;
    /* --hoverButton-add:  */
    --button-remove: #FF0000;


  }
`
