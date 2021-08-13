import styled from "@emotion/styled"

export const Card = styled.div`
  padding: 24px;

  background: ${(props) => props.theme.color.card};
  box-shadow: 2px 2px 11px 2px rgba(0, 0, 0, 0.05);

  backdrop-filter: blur(16px);
  border-radius: 8px;
`
