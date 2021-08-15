import styled from "@emotion/styled"
import React from "react"
import { Card, CardStyle } from "../../core/components/Card"
import { Clock } from "../../core/components/Clock"
import { Logo } from "../../core/components/Logo"
import { store } from "../../core/store"
import { ScheduleItemSummary } from "./ScheduleItemSummary"

const Container = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;

  &:before {
    content: "";
    width: 65%;
    height: 140%;

    right: 0px;
    top: 0px;
    position: absolute;

    transform: rotate(10deg) translateY(-90px) translateX(70px);
    ${CardStyle}
  }
`

const Body = styled.div`
  display: flex;
  flex: 1;

  position: relative;
  z-index: 1;
`

const Footer = styled.div`
  text-align: center;

  font-weight: 600;
  font-size: 16px;

  color: ${(props) => props.theme.fontColor.muted};

  position: relative;
  z-index: 1;
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

const Aside = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const SizedLogo = styled(Logo)`
  width: 450px;
`

const ClockContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

export function UpcomingView() {
  const [next, ...scheduleItems] = store.safeScheduleItems

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
        <Aside>
          <SizedLogo />
          <ClockContainer>
            <Clock size={320} />
          </ClockContainer>
        </Aside>
      </Body>
      <Footer>
        Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for
        kontakt- og redaktørinformasjon.
      </Footer>
    </Container>
  )
}
