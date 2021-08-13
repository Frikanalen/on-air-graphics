import styled from "@emotion/styled"
import React from "react"
import { Card } from "../../core/components/Card"
import { store } from "../../core/store"

const Container = styled.div`
  display: flex;
`

const Content = styled.div``

const NextCard = styled(Card)`
  margin-top: 24px;
`

export function UpcomingView() {
  const [next, ...scheduleItems] = store.scheduleItems

  return (
    <Container>
      <Content>
        <h1>Neste program</h1>
        <NextCard>...</NextCard>
      </Content>
    </Container>
  )
}
