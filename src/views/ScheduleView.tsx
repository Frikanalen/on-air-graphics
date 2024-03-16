import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import { darken } from "polished"
import { TransitionStatus } from "react-transition-group"
import { cardStyle } from "../core/components/Card.tsx"
import { Clock } from "../core/components/Clock.tsx"
import { Logo } from "../core/components/Logo.tsx"
import { ScheduleItemSummary } from "../schedule/components/ScheduleItemSummary.tsx"
import { useSchedule } from "../core/useSchedule.ts"
import * as stylex from "@stylexjs/stylex"
import {
  scheduleStyles,
  slideStyles,
  titleStyle,
} from "../schedule/components/scheduleAnimations.ts"
import { TransitionState } from "./types.ts"

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

    opacity: ${(props) => (props.status === "entered" ? 1 : 0)};

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

export function ScheduleView({
  sequencerCues: { transition },
}: {
  sequencerCues: TransitionState
}) {
  const { schedule } = useSchedule()

  const [next, ...scheduleItems] =
    schedule?.filter((x) => new Date() < new Date(x.endtime)) ?? []

  return (
    <Container status={transition}>
      <div {...stylex.props(transition !== "entered" && scheduleStyles.hidden)}>
        <div className={"flex flex-1 relative z-10"}>
          <div className={"max-w-[590px] flex-1"}>
            <h1
              {...stylex.props(
                titleStyle.base,
                transition === "exiting" && titleStyle.exiting,
              )}
            >
              Neste program
            </h1>
            <div
              {...stylex.props(
                cardStyle.baseCard,
                scheduleStyles.base,
                scheduleStyles.nextCardBase,
                transition === "exiting" && scheduleStyles.exiting,
              )}
            >
              {next ? <ScheduleItemSummary item={next} /> : null}
            </div>
            <h1
              {...stylex.props(
                titleStyle.base,
                transition === "exiting" && titleStyle.exiting,
              )}
            >
              Senere
            </h1>
            <div
              {...stylex.props(
                cardStyle.baseCard,
                scheduleStyles.base,
                scheduleStyles.laterListCardBase,
                transition === "exiting" && scheduleStyles.exiting,
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
                transition === "exiting" && slideStyles.exiting,
              )}
            />
            <ClockContainer
              {...stylex.props(
                slideStyles.base,
                transition === "exiting" && slideStyles.exiting,
              )}
            >
              <Clock size={320} />
            </ClockContainer>
          </div>
        </div>
        <Footer status={transition}>
          Alt innhold sendes på medlemmers eget ansvar. Se frikanalen.no for
          kontakt- og redaktørinformasjon.
        </Footer>
      </div>
    </Container>
  )
}
