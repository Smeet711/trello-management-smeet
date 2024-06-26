import React, { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CardsList } from '../CardsList/CardsList';
import { ButtonAddCard } from '../ButtonAddCard/ButtonAddCard';
import { Form } from '../Form/Form';
import { ButtonCopy } from '../ButtonCopy/ButtonCopy';
import { ButtonMore } from '../ButtonMore/ButtonMore';
import { Textarea } from '../Textarea/Textarea';
import { useDrop } from 'react-dnd';

export const Column = ({ title, columns, id, rows, setRows, labels, comments, onClickCopy, onClickDetail, isShowDetailItem, onUpdateTitle, onUpdateDone }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "li",
    drop: (item) => addItemToCard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  const [isClickButtonAddCard, setIsClickButtonAddCard] = useState(false);
  const [isClickButtonClose, setIsClickButtonClose] = useState(true);
  const [textareaValue, setTextareaValue] = useState('');
  const [titleValue, setTitleValue] = useState(title);
  const [isClickEditHeading, setIsClickEditHeading] = useState(false);
  const refValue = useRef(null);

  const filteredRows = useMemo(() => {
    const filtered = rows.filter(card => card.status === title);
    return filtered;
  }, [rows, title]);

  useEffect(() => {
    if (isClickEditHeading && refValue.current) {
      refValue.current.select();
    }
  }, [isClickEditHeading, refValue]);

  useEffect(() => {
    if (isClickButtonAddCard && refValue.current) {
      refValue.current.focus();
    }
  }, [isClickButtonAddCard, refValue]);

  const onClickButtonAddCard = () => {
    setIsClickButtonAddCard(true);
    setIsClickButtonClose(false);
  }

  const onClickButtonClose = () => {
    setIsClickButtonClose(true);
    setIsClickButtonAddCard(false);
    setTextareaValue('');
  }

  const onClickButton = (event) => {
    event.preventDefault();
    if (textareaValue) {
      const newRow = {
        id: uuidv4(),
        title: textareaValue,
        status: title
      };

      const updatedRows = [...rows, newRow];
      setRows(updatedRows);

      localStorage.setItem("cards", JSON.stringify(updatedRows));

      setTextareaValue('');
      toast.success('Todo Added Success', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
      onClickButtonClose();
    } else {
      // add red outlet for textarea
      refValue.current.focus();
      toast.error('Todo Failed', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
      });
    }
  }

  const onChangeValueTitle = (event) => {
    event.preventDefault();
    setTitleValue(event.target.value);
  }

  const onChangeValueTextarea = (event) => {
    event.preventDefault();
    setTextareaValue(event.target.value);
  }

  const onClickEditHeading = () => {
    setIsClickEditHeading(true);
  }

  const onBlurHandler = () => {
    if (isClickEditHeading && titleValue === title) {
      setIsClickEditHeading(false);
    } else {
      if (!titleValue) {
        setIsClickEditHeading(true);
        toast.error('Vyplňte název sloupce!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
          onClose: () => {
            refValue.current.focus();
          }
        });
      } else {
        const existingColumnName = columns.find(column => column.name.toLowerCase() === titleValue.toLowerCase());
        if (!isClickButtonAddCard && existingColumnName) {
          setIsClickEditHeading(true);
          toast.error(<div dangerouslySetInnerHTML={{ __html: `Sloupec s názvem <strong>${titleValue}</strong> již existuje!` }} />, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
            onClose: () => {
              refValue.current.focus();
            }
          });
        } else {
          setIsClickEditHeading(false);
          onUpdateTitle(titleValue);
        }
      }
    }
  };

  const handleClickCopy = () => {
    onClickCopy(id);
  }

  const addItemToCard = (id) => {
    const updatedRows = (prevRows) => {
      const draggedCard = prevRows.find(card => card.id === id);
      draggedCard.status = title;
  
      const updatedColumns = [draggedCard, ...prevRows.filter(card => card.id !== id)];
      localStorage.setItem("cards", JSON.stringify(updatedColumns));
      return updatedColumns;

    }
    setRows(updatedRows);
  };

  return (
    <section ref={drop}
      className={`flex flex-col max-h-full mb-10 sm:mb-0 sm:mx-10 p-3 w-full sm:w-80 ${isOver ? 'bg-[#d4d7de]' : 'bg-[#f1f2f4]'} text-gray-800 rounded-xl shadow-xl flex-shrink-0 gap-0.5`}>
      <div className="mx-1 flex flex-row justify-between items-center gap-1">
        { isClickEditHeading ?
          <div className="pt-[0.4px]"><Textarea
            height="h-8"
            padding="px-1.5 py-0.5"
            border="border-[2px] border-[#5881fd]"
            bold="font-bold"
            textareaValue={titleValue}
            onChangeValue={onChangeValueTitle}
            onBlurHandler={onBlurHandler}
            refValue={refValue}
          /></div> :
          <h3
            className="pl-[7.5px] pb-[6px] h-[38px] text-[#172b4d] font-bold leading-none outline-none cursor-pointer flex-grow flex items-center"
            onClick={onClickEditHeading}
            >{titleValue}
          </h3>
        }
        <div className="pb-[4px]">
          <ButtonMore />
        </div>
      </div>

      <div className="h-full overflow-x-hidden overflow-y-auto">
        <CardsList
          cards={filteredRows}
          labels={labels}
          comments={comments}
          onClickDetail={onClickDetail}
          isShowDetailItem={isShowDetailItem}
          titleValue={titleValue}
          onUpdateDone={onUpdateDone}
        />

        {
          isClickButtonAddCard && <Form onClickButtonClose={onClickButtonClose} onClickButton={onClickButton} onChangeValue={onChangeValueTextarea} textareaValue={textareaValue} refValue={refValue} onBlurHandler={onBlurHandler}/>
        }
      </div>

      {
        !isClickButtonAddCard &&
          <div className="flex flex-row mx-1">
            <ButtonAddCard onClickAddCard={onClickButtonAddCard} />
            <ButtonCopy handleClickCopy={handleClickCopy} />
          </div>
      }

    </section>
  )
}