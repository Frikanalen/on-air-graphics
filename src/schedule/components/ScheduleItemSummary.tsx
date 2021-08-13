import React from "react"
import styled from "@emotion/styled"
import { ScheduleItem } from "../types"

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: -3px;

  & + & {
    margin-top: 32px;
  }
`

const PrimaryInfo = styled.div`
  flex: 1;
  max-width: 460px;
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
  const { video, starttime } = props.item

  return (
    <Container>
      <PrimaryInfo>
        <Name>{video.name}</Name>
        <Organization>{video.organization.name}</Organization>
      </PrimaryInfo>
      <Time>12:00</Time>
    </Container>
  )
}
