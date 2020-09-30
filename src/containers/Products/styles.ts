import styled from 'styled-components'
import { Spin as SpinAnt, Tabs as TabsAnd } from 'antd'

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  background: var(--mainBackground);
`

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`

export const Spin = styled(SpinAnt)``

export const TabContainer = styled(TabsAnd)`
  width: 100%;
  div.ant-tabs-nav {
    background: var(--primary-orange);
  }
  div.ant-tabs-nav-wrap {
    display: flex;
    justify-content: center;
  }
  .ant-tabs-tab {
    font-weight: bold;
  }
`

export const TabItem = styled(TabsAnd.TabPane)``
