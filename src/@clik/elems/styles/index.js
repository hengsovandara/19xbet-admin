import styled from 'styled-components'

// const theme = {
//   prim: '#1fb5a7',
//   sec: '#134168',
//   success: '#00d061',
//   danger: '#f57167',
//   grey: '#555',
//   lightgrey: '#e0e0e0'
// }

const Scrollable = styled.div`
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* Chrome/Safari/Webkit */
  }
`

const Button = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${props => props.theme.prim};
  border-radius: 5px;
  /* border: 1px solid ${props => props.theme.prim}; */
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);

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
      box-shadow: 10px;
    }
  `};

  ${props => props.link && `
    color: ${props.theme.grey};
    padding: 10px 0;
    background: none;
    border: none;
    text-align: center;

    &:hover {
      padding: 10px 5px;
    }
  `};
`

const Input = styled.input`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background:  white;
  /* color: ${props => props.theme.sec}; */
  padding: 8px 12px;
  outline: none;
  font-size: 14px;
  text-align: left;
  border: 1px solid ${props => props.theme.lightgrey};
  border-radius: 3px;

  &:focus {
    box-shadow: 1px;
    border: 1px solid ${props => props.theme.prim};
  }

  ${props => props.open && `
    border: 1px solid ${props.theme.prim};
    border-bottom: 1px solid ${props.theme.lightgrey};
    border-radius: 3px 3px 0 0;
    box-shadow: 1px;
  `};

  &::placeholder {
    color: #8d8d8d;
  }
`

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: bold;
  text-align: ${props => props.center ? 'center' : 'left'};
  line-height: 2.35;
  ${props => props.label && `
    color: rgba(0,0,0, 0.5);
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
  padding: 8px 12px;
  outline: none;
  font-size: 14px;
  text-align: left;
  border: 1px solid ${props => props.theme.lightgrey};
  border-radius: 3px;
  cursor: pointer;

  ${props => props.disabled && `
    cursor: not-allowed;
    background: ${props.theme.lightgrey};
  `};

  ${props => props.open && `
    border: 1px solid ${props.theme.prim};
    border-bottom: 1px solid ${props.theme.lightgrey};
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

