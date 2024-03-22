import React from "react"
import styled from "@emotion/styled"

const Analytic: React.FC = () => {
  return (
    <>
      <StyledWrapper
        className="elfsight-app-16b2c89d-7271-47f9-8005-7c1dd04cfc00"
        data-elfsight-app-lazy
      ></StyledWrapper>
       <script
        src="https://static.elfsight.com/platform/platform.js"
        data-use-service-core
        defer
      ></script>
    </>
  )
}

export default Analytic
const StyledWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
  margin-top: 2.25rem;
  margin-bottom: 2.25rem;
  flex-direction: column;
  border-radius: 1rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  > a {
    display: flex;
    padding: 0.75rem;
    gap: 0.75rem;
    align-items: center;
    border-radius: 1rem;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray5};
    }
    .icon {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .name {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
`