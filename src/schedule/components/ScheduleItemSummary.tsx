import styled from "@emotion/styled"
import { ScheduleItem } from "../types"
import { HumanizedDate } from "./HumanizedDate"

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: -5px;

  & + & {
    margin-top: 32px;
  }
`

const PrimaryInfo = styled.div`
  flex: 1;
  width: 0;

  margin-right: 16px;
`

const Name = styled.h2`
  margin-bottom: 7px;

  line-height: normal;
  margin-top: -7px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${(props) => props.theme.fontColor.normal};
`

const Organization = styled.span`
  font-size: 20px;
  line-height: 75%;

  color: ${(props) => props.theme.fontColor.muted};
`

const Time = styled.span`
  font-size: 20px;
  font-weight: 600;

  color: ${(props) => props.theme.fontColor.muted};
`

export type ScheduleItemSummaryProps = {
  item: ScheduleItem
}

export function ScheduleItemSummary(props: ScheduleItemSummaryProps) {
  const { video, starttime } = props.item

  return (
    <Container>
      <PrimaryInfo>
        <Name>{video.name}</Name>
        <Organization>{video.organization.name}</Organization>
      </PrimaryInfo>
      <Time>
        <HumanizedDate date={new Date(starttime)} />
      </Time>
    </Container>
  )
}
