import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { Button, Form as Toggler } from '../styles';

const DatePicker = ({ showPicker = false, placeholder = 'Select date', date, day, month, year, setDate, handleMouseDown, handleAdd }) => {
  const inputRef = useRef();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keyup', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keyup', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keyup', handleClickOutside);
    };
  }, [open]);

  const handleClickOutside = event => {
    if (inputRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleAddDate = e => {
    e.preventDefault();
    e.stopPropagation();
    handleAdd();
    setOpen(!open);
  }

  return (
    <Container ref={inputRef}>
      <Toggler open={open} onClick={() => setOpen(!open)}>
        {showPicker
          ? <input
              className="w:100pc"
              style={{ color: date ? '#134168' : '#8d8d8d', fontWeight: date ? 'bold' : 'normal' }}
              placeholder={placeholder}
              value={date || ''}
              onChange={e => { setDate(e.target.value) }}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  handleAddDate(e);
                  setOpen(false);
                }
              }}
            />
          : <div className="w:100pc" style={{ color: date ? '#134168' : '#8d8d8d', fontWeight: date ? 'bold' : 'normal' }}>{date || placeholder}</div>
        }
        <div className="w:24px ta:c c:ccc" style={{ color: open && '#1fb5a7' }}><FontAwesomeIcon icon="calendar-alt" /></div>
      </Toggler>
      {open && (
        <Date>
          <DateItems>
            <DateItem>
              <Icon onMouseDown={() => handleMouseDown({ type: 'years'})}><FontAwesomeIcon icon="plus" /></Icon>
              <DateText>{year}</DateText>
              <Icon down onMouseDown={() => handleMouseDown({ type: 'years', down: true})}><FontAwesomeIcon icon="minus" /></Icon>
            </DateItem>
            <DateItem>
              <Icon onMouseDown={() => handleMouseDown({ type: 'months'})}><FontAwesomeIcon icon="plus" /></Icon>
              <DateText>{month}</DateText>
              <Icon down onMouseDown={() => handleMouseDown({ type: 'months', down: true })}><FontAwesomeIcon icon="minus" /></Icon>
            </DateItem>
            <DateItem>
              <Icon onMouseDown={() => handleMouseDown({ type: 'days'})}><FontAwesomeIcon icon="plus" /></Icon>
              <DateText>{day}</DateText>
              <Icon down onMouseDown={() => handleMouseDown({ type: 'days', down: true })}><FontAwesomeIcon icon="minus" /></Icon>
            </DateItem>
          </DateItems>
          <div className="w:100pc dp:flx fd:row jc:sb ai:c m-t:8px m-rl:4px">
            {/* <Button onClick={() => setOpen(false)}>tabindex="-1" to prevent tabbing</Button> */}
            <Button outline tabIndex="-1" className="w:100pc" type="button" onClick={handleAddDate}>Add</Button>
          </div>
        </Date>
      )}
    </Container>
  )
}

export default DatePicker;

const Icon = styled.div`
  width: 100%;
  padding: 8px 12px;
  background: #f7f7f7;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    box-shadow: 1px;
    transform: ${props => props.down ? 'translateY(1px)' : 'translateY(-1px)'};
  }
`;

const DateText = styled.div`
  width: 100%;
  padding: 8px 4px;
  background: #1fb5a7; /* prim */
  color: white;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  color: #134168; /* sec */
`;

const Date = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  background:  white; /* #f7f7f7 */
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  margin: 0;
  border: 1px solid #1fb5a7;  /* prim */
`;

const DateItems = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 4px;

  &:last-child {
    margin-right: 0;
  }
`;
