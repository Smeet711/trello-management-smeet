import React from 'react';
import { Button } from '../Button/Button';
import { Textarea } from '../Textarea/Textarea';
import { ButtonClose } from '../ButtonClose/ButtonClose';

export const FormColumn = ({ onClickButtonClose, onClickButton, onChangeValue, textareaValue, refValue }) => {

  return (
    <section className="mb-10 sm:mb-0 sm:mx-10 p-3 w-full sm:w-80 bg-[#f1f2f4] text-gray-800 rounded-xl shadow-xl flex-shrink-0">
      <form action="">
        <Textarea
          padding="px-3 py-2"
          rows="1"
          placeholder="Type name of Swimlane"
          border="border-[2px] border-[#5881fd]"
          onChangeValue={onChangeValue}
          textareaValue={textareaValue}
          refValue={refValue}
        />
        <div className="flex flex-row items-center gap-1">
          <Button text="Add Swimlane" onClickButton={onClickButton} />
          <ButtonClose onClickButtonClose={onClickButtonClose} />
        </div>
      </form>
    </section>
  )
}
