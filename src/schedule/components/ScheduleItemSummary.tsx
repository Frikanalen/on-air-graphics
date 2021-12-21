import React from "react"
import styled from "@emotion/styled"
import { ScheduleItem } from "../types"
import { humanizeDate } from "../helpers/humanizeDate"
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
  const { video, startsAt } = props.item

  return (
    <Container>
      <PrimaryInfo>
        <Name>{video.title}</Name>
        <Organization>{video.organization.name}</Organization>
      </PrimaryInfo>
      <Time>
        <HumanizedDate date={new Date(startsAt)} />
      </Time>
    </Container>
  )
}
