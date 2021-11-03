import { css, keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { CardStyle } from "../../core/components/Card"
import { Logo } from "../../core/components/Logo"
import { delay } from "../../core/helpers/delay"

export type AnimationState = "start" | "unblur" | "end"

const Container = styled.div<{ state: AnimationState }>`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: "";
    position: absolute;

    height: 200%;
    width: 200%;

    top: 0px;
    right: 0px;

    transition: all 700ms ease-in-out;
    transform: rotate(10deg) translateY(-220px);

    ${(props) => {
      if (props.state === "end")
        return css`
          transform: rotate(10deg) translateY(60%);
        `

      return
    }}

    ${CardStyle};
  }
`

const LogoContainer = styled.div<{ state: AnimationState }>`
  width: 600px;

  position: relative;
  z-index: 1;

  transition: all 1000ms ease-in-out;

  ${(props) => {
    const { state } = props

    if (state === "start")
      return css`
        filter: blur(120px);
        opacity: 0;
      `

    if (state === "unblur") return

    if (props.state === "end")
      return css`
        transition-duration: 700ms;

        transform: translateY(800px);
        opacity: 0;
      `
  }}
`

export type IntroSequenceProps = {
  onFinished: () => void
}

export function IntroSequence(props: IntroSequenceProps) {
  const [state, setState] = useState<AnimationState>("start")

  useEffect(() => {
    const run = async () => {
      await delay(700)
      setState("unblur")

      await delay(2500)
      setState("end")

      await delay(300)
      props.onFinished()
    }

    run()
  }, [])

  return (
    <Container state={state}>
      <LogoContainer state={state}>
        <Logo />
      </LogoContainer>
    </Container>
  )
}
