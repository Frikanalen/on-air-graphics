import styled from "@emotion/styled"
import React from "react"
import { Card } from "../../core/components/Card"
import { store } from "../../core/store"
import { ScheduleItemSummary } from "./ScheduleItemSummary"

const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
`

const Body = styled.div`
  display: flex;
  flex: 1;
`

const Footer = styled.div`
  text-align: center;

  font-weight: 600;
  font-size: 16px;

  color: ${(props) => props.theme.fontColor.muted};
`

const Content = styled.div`
  max-width: 590px;
  flex: 1;
`

const NextCard = styled(Card)`
  margin-top: 24px;
  margin-bottom: 42px;
`

const LaterListCard = styled(Card)`
  margin-top: 24px;
`

export function UpcomingView() {
  const [next, ...scheduleItems] = store.scheduleItems

  return (
    <Container>
      <Body>
        <Content>
          <h1>Neste program</h1>
          <NextCard>
            <ScheduleItemSummary item={next} />
          </NextCard>
          <h1>Senere</h1>
          <LaterListCard>
            {scheduleItems.slice(0, 3).map((item) => (
              <ScheduleItemSummary key={item.id} item={item} />
            ))}
          </LaterListCard>
        </Content>
      </Body>
      <Footer>
        Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for
        kontakt- og redaktørinformasjon.
      </Footer>
    </Container>
  )
}
