import { css, keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { darken } from "polished"
import React from "react"
import { TransitionStatus } from "react-transition-group"
import { Card, CardStyle } from "../../core/components/Card"
import { Clock } from "../../core/components/Clock"
import { Logo } from "../../core/components/Logo"
import { store } from "../../core/store"

import { ScheduleItemSummary } from "./ScheduleItemSummary"

const SlideTransition = (px: number, reversed: boolean) => keyframes`
  ${reversed ? 0 : 100}% {
    transform: translateX(${px}px);
  }

  ${reversed ? 100 : 0}% {
    transform: translateY(0px);
  }
`

const SlideFadeTransition = (px: number, reversed: boolean) => keyframes`
  ${reversed ? 0 : 100}% {
    opacity: 0;
    transform: translateX(${px}px);
  }

  ${reversed ? 100 : 0}% {
    transform: translateY(0px);
    opacity: 1;
  }
`

const slide = (px: number) => (props: { status: TransitionStatus }) => {
  const { status } = props

  return css`
    animation-name: ${SlideTransition(px, status !== "exiting")};
  `
}

const slideFade = (px: number) => (props: { status: TransitionStatus }) => {
  const { status } = props

  return css`
    animation-name: ${SlideFadeTransition(px, status !== "exiting")};
  `
}

const ContainerTransition = (reversed: boolean) => keyframes`
  ${reversed ? 0 : 100}% {
    opacity: 0;
    transform: rotate(10deg) translateY(-90px) translateX(200px);
  }

  ${reversed ? 100 : 0}% {}
`

const Container = styled.div<{ status: TransitionStatus }>`
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 64px;

  &:before {
    content: "";
    width: 65%;
    height: 140%;

    right: 0px;
    top: 0px;
    position: absolute;

    transform: rotate(10deg) translateY(-90px) translateX(70px);
    animation: ${(props) => ContainerTransition(props.status !== "exiting")}
      500ms ease both;

    ${CardStyle}

    @supports not (backdrop-filter: blur(30px)) {
      background: ${(props) => darken(0.02, props.theme.color.cardFallback)};
    }
  }
`

const Body = styled.div`
  display: flex;
  flex: 1;

  position: relative;
  z-index: 1;
`

const FooterTransition = (reversed: boolean) => keyframes`
${reversed ? 0 : 100}% {
  opacity: 0;
  transform: translateY(200px);
}

${reversed ? 100 : 0}% {}
`

const Footer = styled.div<{ status: TransitionStatus }>`
  text-align: center;

  font-weight: 600;
  font-size: 16px;

  color: ${(props) => props.theme.fontColor.muted};

  animation: ${(props) => FooterTransition(props.status !== "exiting")} 500ms
    ease both;

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

  animation: 1000ms ease both;
  ${slide(-700)}
`

const LaterListCard = styled(Card)`
  margin-top: 24px;

  animation: 1000ms ease both;
  animation-delay: 100ms;
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

  animation: 500ms ease both;
  ${slideFade(50)}
`

const ClockContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  animation: 500ms ease both;
  animation-delay: 100ms;
  ${slideFade(50)}
`

const HeadingTransition = (reversed: boolean) => keyframes`
  ${reversed ? 0 : 100}% {
    opacity: 0;
  }

  ${reversed ? 100 : 0}% {}
`

const Heading = styled.h1<{ status: TransitionStatus }>`
  transition: all 500ms ease;

  animation: ${(props) => HeadingTransition(props.status !== "exiting")} 500ms
    ease forwards;
`

export type ScheduleViewProps = {
  status: TransitionStatus
}

export function ScheduleView(props: ScheduleViewProps) {
  const { status } = props
  const [next, ...scheduleItems] = store.safeScheduleItems

  return (
    <Container status={status}>
      <Body>
        <Content>
          <Heading status={status}>Neste program</Heading>
          <NextCard status={status}>
            {next ? <ScheduleItemSummary item={next} /> : null}
          </NextCard>
          <Heading status={status}>Senere</Heading>
          <LaterListCard status={status}>
            {scheduleItems.slice(0, 3).map((item) => (
              <ScheduleItemSummary key={item.video.id} item={item} />
            ))}
          </LaterListCard>
        </Content>
        <Aside>
          <SizedLogo status={status} />
          <ClockContainer status={status}>
            <Clock size={320} />
          </ClockContainer>
        </Aside>
      </Body>
      <Footer status={status}>
        Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for
        kontakt- og redaktørinformasjon.
      </Footer>
    </Container>
  )
}
