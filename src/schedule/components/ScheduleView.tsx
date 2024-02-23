import { css, keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { darken } from "polished"
import { TransitionStatus } from "react-transition-group"
import { Card, cardStyle } from "../../core/components/Card"
import { Clock } from "../../core/components/Clock"
import { Logo } from "../../core/components/Logo"

import { ScheduleItemSummary } from "./ScheduleItemSummary"
import { useSchedule } from "../../core/useSchedule"
import * as stylex from "@stylexjs/stylex"

// Define the keyframe animations
const slideIn = stylex.keyframes({
  from: { transform: "translateX(-700px)" },
  to: { transform: "translateY(0)" },
})

const slideOut = stylex.keyframes({
  from: { transform: "translateY(0)" },
  to: { transform: "translateX(-700px)" },
})

const SlideFadeTransition = (px: number, reversed: boolean) => keyframes`
  ${reversed ? "0%" : "100%"} {
    opacity: 0;
    transform: translateX(${px}px);
  }

  ${reversed ? "100%" : "0%"} {
    transform: translateY(0px);
    opacity: 1;
  }
`

const slideFade = (px: number) => (props: { status: TransitionStatus }) => {
  const { status } = props

  return css`
    animation-name: ${SlideFadeTransition(px, status !== "exiting")};
  `
}

const ContainerTransition = (reversed: boolean) => keyframes`
  ${reversed ? "0%" : "100%"} {
    opacity: 0;
    transform: rotate(10deg) translateY(-90px) translateX(200px);
  }

  ${reversed ? "100%" : "0%"} {}
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

    right: 0;
    top: 0;
    position: absolute;

    transform: rotate(10deg) translateY(-90px) translateX(70px);
    animation: ${(props) => ContainerTransition(props.status !== "exiting")}
      500ms ease both;

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
${reversed ? "0%" : "100%"} {
  opacity: 0;
  transform: translateY(200px);
}

${reversed ? "100%" : "0%"} {}
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

const styles = stylex.create({
  entering: {
    animationName: slideIn,
    animationDuration: "1000ms",
    animationFillMode: "both",
    animationTimingFunction: "ease",
  },
  exiting: {
    animationName: slideOut,
    animationDuration: "1000ms",
    animationFillMode: "both",
    animationTimingFunction: "ease",
  },
  nextCardBase: {
    marginTop: "24px",
    marginBottom: "42px",
  },
  laterListCardBase: {
    marginTop: "24px",
    animationDelay: "100ms",
  },
})

const Aside = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const SizedLogo = styled(Logo)`
  width: 450px;
  color: ${(props) => props.theme.fontColor.normal};

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
  ${reversed ? "0%" : "100%"} {
    opacity: 0;
  }

  ${reversed ? "100%" : "0%"} {}
`

const Heading = styled.h1<{ status: TransitionStatus }>`
  transition: all 500ms ease;

  color: ${(props) => props.theme.fontColor.normal};
  animation: ${(props) => HeadingTransition(props.status !== "exiting")} 500ms
    ease forwards;
`

export type ScheduleViewProps = {
  status: TransitionStatus
}

export function ScheduleView(props: ScheduleViewProps) {
  const { schedule } = useSchedule()

  const { status } = props
  const [next, ...scheduleItems] =
    schedule?.filter((x) => new Date() < new Date(x.endtime)) ?? []

  return (
    <Container status={status}>
      <Body>
        <Content>
          <Heading status={status}>Neste program</Heading>
          <Card
            {...stylex.props(
              cardStyle.baseCard,
              styles.nextCardBase,
              status !== "exiting" ? styles.entering : styles.exiting,
            )}
          >
            {next ? <ScheduleItemSummary item={next} /> : null}
          </Card>
          <Heading status={status}>Senere</Heading>
          <div
            {...stylex.props(
              cardStyle.baseCard,
              styles.laterListCardBase,
              status !== "exiting" ? styles.entering : styles.exiting,
            )}
          >
            {scheduleItems.slice(0, 3).map((item) => (
              <ScheduleItemSummary key={item.id} item={item} />
            ))}
          </div>
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
