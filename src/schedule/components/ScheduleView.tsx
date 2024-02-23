import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { darken } from "polished"
import { TransitionStatus } from "react-transition-group"
import { cardStyle } from "../../core/components/Card"
import { Clock } from "../../core/components/Clock"
import { Logo } from "../../core/components/Logo"
import { ScheduleItemSummary } from "./ScheduleItemSummary"
import { useSchedule } from "../../core/useSchedule"
import * as stylex from "@stylexjs/stylex"
import {
  scheduleStyles,
  slideStyles,
  titleStyle,
} from "./scheduleAnimations.ts"

const ContainerTransition = (reversed: boolean) => keyframes`
    ${reversed ? "0%" : "100%"} {
        opacity: 0;
        transform: rotate(10deg) translateY(-90px) translateX(200px);
    }

    ${reversed ? "100%" : "0%"} {
    }
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

const FooterTransition = (reversed: boolean) => keyframes`
    ${reversed ? "0%" : "100%"} {
        opacity: 0;
        transform: translateY(200px);
    }

    ${reversed ? "100%" : "0%"} {
    }
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

const SizedLogo = styled(Logo)`
  width: 450px;
  color: ${(props) => props.theme.fontColor.normal};
`

const ClockContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  animation-delay: 100ms;
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
      <div className={"flex flex-1 relative z-10"}>
        <div className={"max-w-[590px] flex-1"}>
          <h1
            {...stylex.props(
              titleStyle.base,
              status === "exiting" && titleStyle.exiting,
            )}
          >
            Neste program
          </h1>
          <div
            {...stylex.props(
              cardStyle.baseCard,
              scheduleStyles.base,
              scheduleStyles.nextCardBase,
              status === "exiting" && scheduleStyles.exiting,
            )}
          >
            {next ? <ScheduleItemSummary item={next} /> : null}
          </div>
          <h1
            {...stylex.props(
              titleStyle.base,
              status === "exiting" && titleStyle.exiting,
            )}
          >
            Senere
          </h1>
          <div
            {...stylex.props(
              cardStyle.baseCard,
              scheduleStyles.base,
              scheduleStyles.laterListCardBase,
              status === "exiting" && scheduleStyles.exiting,
            )}
          >
            {scheduleItems.slice(0, 3).map((item) => (
              <ScheduleItemSummary key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className={"flex flex-1 flex-col items-center"}>
          <SizedLogo
            {...stylex.props(
              slideStyles.base,
              status === "exiting" && slideStyles.exiting,
            )}
          />
          <ClockContainer
            {...stylex.props(
              slideStyles.base,
              status === "exiting" && slideStyles.exiting,
            )}
          >
            <Clock size={320} />
          </ClockContainer>
        </div>
      </div>
      <Footer status={status}>
        Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for
        kontakt- og redaktørinformasjon.
      </Footer>
    </Container>
  )
}
