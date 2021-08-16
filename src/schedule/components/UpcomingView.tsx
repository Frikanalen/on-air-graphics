import { css } from "@emotion/react"
import styled from "@emotion/styled"
import React from "react"
import { Card, CardStyle } from "../../core/components/Card"
import { Clock } from "../../core/components/Clock"
import { Logo } from "../../core/components/Logo"
import { store } from "../../core/store"
import {
  TransitionState,
  useTimedTransition,
} from "../../sequencing/hooks/useTimedTransition"
import { ScheduleItemSummary } from "./ScheduleItemSummary"

const slideFade = (px: number) => (props: { state: TransitionState }) => {
  const { state } = props

  if (state === "start" || state === "disappear")
    return css`
      opacity: 0;
      transform: translateX(${px}px);
    `
}

const slide = (px: number) => (props: { state: TransitionState }) => {
  const { state } = props

  if (state === "start" || state === "disappear")
    return css`
      transform: translateX(${px}px);
    `
}

const Container = styled.div<{ state: TransitionState }>`
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
    transition: all 500ms ease;

    ${(props) => {
      const { state } = props

      if (state === "start" || state === "disappear")
        return css`
          opacity: 0;
          transform: rotate(10deg) translateY(-90px) translateX(200px);
        `
    }}

    ${CardStyle}
  }
`

const Body = styled.div`
  display: flex;
  flex: 1;

  position: relative;
  z-index: 1;
`

const Footer = styled.div<{ state: TransitionState }>`
  text-align: center;

  font-weight: 600;
  font-size: 16px;

  color: ${(props) => props.theme.fontColor.muted};
  transition: all 500ms ease;

  ${(props) => {
    const { state } = props

    if (state === "start" || state === "disappear")
      return css`
        opacity: 0;
        transform: translateY(200px);
      `
  }}

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

  transition: all 1000ms ease;
  ${slide(-700)}
`

const LaterListCard = styled(Card)`
  margin-top: 24px;

  transition: all 1000ms ease;
  transition-delay: 100ms;
  ${slide(-700)}
`

const Aside = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const SizedLogo = styled(Logo)`
  width: 450px;

  transition: all 500ms ease;
  ${slideFade(50)}
`

const ClockContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  transition: all 500ms ease;
  transition-delay: 100ms;
  ${slideFade(50)}
`

const Heading = styled.h1<{ state: TransitionState }>`
  transition: all 500ms ease;

  ${(props) => {
    const { state } = props

    if (state === "start" || state === "disappear")
      return css`
        opacity: 0;
      `
  }}
`

export type UpcomingViewProps = {
  duration: number
  onFinished: () => void
}

export function UpcomingView(props: UpcomingViewProps) {
  const { duration, onFinished } = props
  const [next, ...scheduleItems] = store.safeScheduleItems

  const state = useTimedTransition({
    duration,
    appear: 1000,
    disappear: 1000,
    onFinished,
  })

  console.log(state)

  return (
    <Container state={state}>
      <Body>
        <Content>
          <Heading state={state}>Neste program</Heading>
          <NextCard state={state}>
            {next ? <ScheduleItemSummary item={next} /> : null}
          </NextCard>
          <Heading state={state}>Senere</Heading>
          <LaterListCard state={state}>
            {scheduleItems.slice(0, 3).map((item) => (
              <ScheduleItemSummary key={item.id} item={item} />
            ))}
          </LaterListCard>
        </Content>
        <Aside>
          <SizedLogo state={state} />
          <ClockContainer state={state}>
            <Clock size={320} />
          </ClockContainer>
        </Aside>
      </Body>
      <Footer state={state}>
        Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for
        kontakt- og redaktørinformasjon.
      </Footer>
    </Container>
  )
}
