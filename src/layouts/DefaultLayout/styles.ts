import styled from 'styled-components'

export const LayoutCotainer = styled.div`
  width: min(74rem, 100%);
  padding: 2.5rem;
  background: ${(props) => props.theme['gray-800']};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`
