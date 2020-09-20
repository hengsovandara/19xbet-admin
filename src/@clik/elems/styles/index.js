import styled from 'styled-components'

const Scrollable = styled.div`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
`

const Button = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  min-height: 40px;
  background: ${props => props.theme.prim};
  border-radius: 5px;
  transition: all 0.5s

  &:hover {
    transform: translateY(1px);
  }

  ${props => props.outline && `
    color: ${props.theme.sec};
    background: none;
    border: 1px solid transparent;

    &:hover {
      color: ${props.theme.prim};
      border: 1px solid ${props.theme.prim};
      box-shadow: 12px;
    }
  `};

  ${props => props.link && `
    color: ${props.theme.grey};
    padding: 12px 0;
    background: none;
    border: none;
    text-align: center;

    &:hover {
      padding: 12px 5px;
    }
  `};
`

const Input = styled.input`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:  white;
  padding: 8px 12px;
  outline: none;
  min-height: 40px;
  font-size: 14px;
  text-align: left;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: 4px;
  transition: all 0.5s;

  &:hover {
    box-shadow: 1px;
    border: 1px solid ${props => props.theme.prim};
  }

  &:focus {
    box-shadow: 1px;
    border: 1px solid ${props => props.theme.prim};
  }

  ${props => props.open && `
    border: 1px solid ${props.theme.prim};
    border-bottom: 1px solid ${props.theme.borderColor};
    border-radius: 3px 3px 0 0;
    box-shadow: 1px;
  `};

  &::placeholder {
    color: #8d8d8d;
  }
`

const Paragraph = styled.p`
  font-size: 14px;
  text-align: ${props => props.center ? 'center' : 'left'};
  line-height: 2.35;
  ${props => props.label === 'true' && `
    color: rgba(0,0,0, 0.75);
    font-size: 11px;
    font-weight: normal;
  `};
`

// For wrapping like input, select, date components
const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:  white;
  outline: none;
  font-size: 14px;
  min-height: 40px;
  text-align: left;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 4px;
  cursor: pointer;

  ${props => props.transparent && `
    background: transparent;
  `};

  ${props => props.green && `
    border: 1px solid #79cf78;
  `};

  ${props => props.disabled && `
    cursor: not-allowed;
    border: 1px solid transparent;
    opacity: 0.8;
    background: rgba(0,0,0,0.2);
    &:hover{
      border: 1px solid transparent;
    }
  `};

  ${props => props.open && `
    border: 1px solid ${props.theme.borderColor};
    border-bottom: 1px solid ${props.theme.borderColor};
    border-radius: 3px 3px 0 0;
    box-shadow: 1px;
  `};
`

const Icon = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* color: ${props => props.value ? '#00d061' : '#f57167'} */
`

export { Button, Input, Paragraph, Icon, Form, Scrollable }

