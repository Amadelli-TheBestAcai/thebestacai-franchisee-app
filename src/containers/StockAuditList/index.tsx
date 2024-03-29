import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

import Audit from '../../components/Audit'
import Pagination from '../../components/Pagination'
import Centralizer from '../../containers/Centralizer'

import { Audit as AuditModel } from '../../../shared/models/audit'
import { Page } from '../../../shared/models/page'

import { Spin, Empty, message } from 'antd'
import { Container, Modal } from './styles'

interface IProps {
  id: number | undefined
  setVisible: Dispatch<SetStateAction<boolean>>
  visible: boolean
  setPaginate: Dispatch<SetStateAction<Page>>
  paginate: Page
}

const StockAuditList: React.FC<IProps> = ({
  id,
  visible,
  setVisible,
  paginate,
  setPaginate,
}) => {
  const [audits, setAudits] = useState<AuditModel[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [shouldSearch, setShouldSearch] = useState(false)
  const { page, size } = paginate

  useEffect(() => {
    async function fechtAudit() {
      ipcRenderer.send('products:audit:get', { id, page, size })
      ipcRenderer.once(
        'products:audit:get:response',
        (event, { audits, totalElements, status }) => {
          if (status) {
            setLoading(false)
            setAudits(audits)
            setPaginate((oldValues) => ({ ...oldValues, totalElements }))
          } else {
            message.error('Erro ao obter auditoria do produto!')
          }
        }
      )
    }
    if (id || shouldSearch) {
      setLoading(true)
      fechtAudit()
    }
  }, [page, size, shouldSearch, id, setPaginate])

  return (
    <Container>
      <Modal
        title="Histórico"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        cancelButtonProps={{ hidden: true }}
        closable={true}
        width={1000}
        destroyOnClose={true}
        footer={
          <>
            <Pagination
              setStateSearch={setShouldSearch}
              setPaginate={setPaginate}
              totalElements={paginate.totalElements}
            />
          </>
        }
      >
        {loading ? (
          <Centralizer>
            <Spin />
          </Centralizer>
        ) : audits.length ? (
          audits.map((audit) => <Audit key={audit.id} {...audit} />)
        ) : (
          <Centralizer>
            <Empty description="Nenhum histórico de alteração encontrado" />
          </Centralizer>
        )}
      </Modal>
    </Container>
  )
}

export default StockAuditList
