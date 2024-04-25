import React, { useState, useEffect, useRef } from 'react';
import { toast, Slide } from 'react-toastify';
import dayjs from 'dayjs';
import { ButtonClose } from '../ButtonClose/ButtonClose';
import { Textarea } from '../Textarea/Textarea';
import { Comment } from '../Comment/Comment';
import { Label } from '../Label/Label';
import { Button } from '../Button/Button';
import { FormDataTime } from '../FormDataTime/FormDataTime';

export const CardDetail = ({
    detailCard,
    labels,
    comments,
    setIsShowDetailItem,
    onUpdateTitleValue,
    onUpdateDescriptionValue,
    onAddNewComment,
    onEditComment,
    onDeleteComment,
    onSaveDateStart,
    onSaveDateEnd,
    onUpdateDone
  }) => {
  
  const { id, title, headline, src, description, dateStart, dateEnd, done } = detailCard;
  const [detailValueCard, setDetailValueCard] = useState({
    titleValue: title,
    descriptionValue: description,
    doneValue: done
  });
  const { titleValue, descriptionValue, doneValue } = detailValueCard;

  const [commentValue, setCommentValue] = useState('');
  const [editedCommentValue, setEditedCommentValue] = useState('');

  const [isClickEditHeading, setIsClickEditHeading] = useState(false);
  const [isClickEditDescription, setIsClickEditDescription] = useState(false);
  const [isClickEditComment, setIsClickEditComment] = useState(false);
  const [isClickWriteComment, setIsClickWriteComment] = useState(false);
  const [clickedCommentId, setClickedCommentId] = useState('');
  const [isShowFormDateTime, setIsShowFormDateTime] = useState(false);
  const refTitleValue = useRef(null);
  const refDescriptionValue = useRef(null);
  const refCommentValue = useRef(null);
  const refEditCommentValue = useRef(null);

  useEffect(() => {
    (isClickEditHeading && refTitleValue.current) && refTitleValue.current.select();
    (isClickEditDescription && refDescriptionValue.current) && refDescriptionValue.current.focus();
    (isClickWriteComment && refCommentValue.current) && refCommentValue.current.focus();
    (isClickEditComment && refEditCommentValue.current) && refEditCommentValue.current.focus();
  }, [isClickEditHeading, isClickEditDescription, isClickWriteComment, isClickEditComment]);

  const filteredComments = comments
  .filter(oneComment => oneComment.cardId === id)
  .sort((a, b) => dayjs(b.datetime).unix() - dayjs(a.datetime).unix());

  const filteredLabels = labels
  .filter(oneLabel => oneLabel.cardId === id);

  const onChangeValueTitle = (event) => {
    setDetailValueCard((prevDetailValueCard) => ({ ...prevDetailValueCard, titleValue: event.target.value }));
  }


  const onClickEditHeading = () => {
    setIsClickEditHeading(true);
  }

 
  
  const onClickButtonClose = () => {
    if (titleValue) {
      onUpdateDescriptionValue(descriptionValue);
      onUpdateTitleValue(titleValue);
      setIsShowDetailItem(false);
    }
  }

  
 

 
 

 

  const handleClickDataTime = () => {
    setIsShowFormDateTime(true);
  }

  const termHeading =
    dateEnd !== '' && dateStart === '' ? 'Time' :
    dateEnd === '' && dateStart !== '' ? 'Date & Time' :
    'Date & Time';

  const formDataTime =
  dateEnd !== '' && dateStart === ''
    ? `${dayjs(dateEnd).format('DD.MM.YYYY')} v ${dayjs(dateEnd).format('HH:mm')}`
    : dateEnd === '' && dateStart !== ''
    ? `${dayjs(dateStart).format('DD.MM.YYYY')}`
    : `${dayjs(dateStart).format('DD.MM.')} - ${dayjs(dateEnd).format(
        'DD.MM.YYYY'
      )} v ${dayjs(dateEnd).format('HH:mm')}`;

  const handleClickDone = () => {
    setDetailValueCard(prevDetailValueCard => ({ ...prevDetailValueCard, doneValue: !doneValue }));
    onUpdateDone(!doneValue);
  }

  const termStatusTitle = done ? 'Done' :
    dayjs(dateEnd).isSame(dayjs(), 'day') ? 'medium' :
    dayjs(dateEnd).isBefore(dayjs()) ? 'Pending' : 
    '';

  const termStatusStyled = done ? 'bg-green-700' :
    dayjs(dateEnd).isSame(dayjs(), 'day') ? 'bg-yellow-600' :
    dayjs(dateEnd).isBefore(dayjs()) ? 'bg-red-600' :
    '';

  return (
    <div className="sm:w-[80%] lg:w-[60%] min-h-[80%] bg-[#f1f2f4] text-[#172b4d] rounded-[8px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]">
      {src && <figure><img className="sm:max-h-36 max-h-52 w-full rounded-t-[8px]" src={src} alt="***" /></figure>}
      <div className="p-10 flex flex-col gap-4">
        <div>
          <div className="mx-[-10px] flex flex-row justify-between gap-2">
          {isClickEditHeading ? (
            <Textarea
              height="h-[40px]"
              padding="px-2 py-1"
              font="text-xl"
              border="border-[2px] border-[#5881fd]"
              bold="font-semibold"
              textareaValue={titleValue}
              onChangeValue={onChangeValueTitle}
              // onBlurHandler={onBlurHandlerHeading}
              refValue={refTitleValue}
            />
            ) : (
              <h2 onClick={onClickEditHeading} className="px-[10px] w-full h-10 text-xl font-semibold flex items-center">{titleValue}</h2>
            )}
            <div className="mr-2.5">
              <ButtonClose onClickButtonClose={onClickButtonClose} />
            </div>
          </div>
          <p>HeadLine <span className="underline">{headline}</span></p>
        </div>
        <div className="flex sm:flex-col md:flex-row gap-4">
          <div className="w-[100%] md:w-[80%]">
          {
            (filteredLabels.length > 0) && (
              <div className="mt-0.5 mb-1.5">
                <h3 className="text-[12px] text-[#44546f] font-bold">Progress</h3>
                <div className="mt-1.5 flex flex-row">
                  {filteredLabels.map(oneLabel => (
                    oneLabel.label.map(objLabel => 
                      <Label
                        color={objLabel.color}
                        title={objLabel.title}
                        key={objLabel.id}
                        showDetail={true}
                      />)
                  ))}
                </div>
              </div>
            )
          }
          {
            ((dateEnd !== '' && dateStart === '') || (dateEnd === '' && dateStart !== '') || (dateEnd !== '' && dateStart !== '')) &&
              <div className="mt-0.5 mb-1.5">
                <h3 className="text-[12px] text-[#44546f] font-bold">{termHeading}</h3>
                <div className=" mt-1.5 flex flex-row items-center gap-2">
                  {
                    ((dayjs(dateEnd).isBefore(dayjs()) || (dayjs(dateEnd).isSame(dayjs(), 'day')) || (dayjs(dateEnd).isAfter(dayjs())) || done)) && <input className="inline-block w-4 h-4" type="checkbox" id="datatime" name="datatime" onClick={handleClickDone} defaultChecked={(done ? true : false)} />
                  }
                  <div className="px-[6px] py-3 w-auto bg-[#e5e6ea] hover:bg-[#d1d4db] text-[14px] font-semibold rounded-[3px] cursor-pointer flex flex-row items-center" onClick={handleClickDataTime}>
                    {formDataTime}
                    {
                      ((dayjs(dateEnd).isBefore(dayjs()) || (dayjs(dateEnd).isSame(dayjs(), 'day')) || done)) && <span className={`ml-2 px-2 text-white ${termStatusStyled} rounded-[2px]`}>{termStatusTitle}</span>
                    }
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="ml-2 w-4 h-4 inline-block">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
          }
          {
            isShowFormDateTime && <FormDataTime dateStart={dateStart} dateEnd={dateEnd} setIsShowFormDateTime={setIsShowFormDateTime} onSaveDateStart={onSaveDateStart} onSaveDateEnd={onSaveDateEnd} />
          }
           
            {/* <div className="mt-6">
              <h3 className="mb-4 font-semibold">Komentáře</h3>
              {
                isClickWriteComment ?
                <>
                  <Textarea
                    padding="px-4 py-2"
                    textareaValue={commentValue}
                    onChangeValue={onAddCommentValue}
                    refValue={refCommentValue}
                  />
                  <div className="flex flex-row gap-2">
                    <Button text="Uložit" onClickButton={onClickSaveComment} /> <ButtonClose text="Zavřít" showText={true} onClickButtonClose={onClickCloseComment}/>
                  </div>
                </> :
                  <div onClick={onClickWriteComment} className="px-3 py-2 min-h-14 bg-[#e5e6ea] hover:bg-[#d1d4db] text-[14px] font-semibold rounded-[3px] cursor-pointer">
                    {'Napsat komentář...'}
                  </div>
              }
              {
                filteredComments.map(oneComment => (
                  <div key={oneComment.id}>
                    <p className="mt-6 mb-1 pl-2 text-[12px]">{dayjs(oneComment.datetime).format('DD.MM.YYYY HH:mm')}</p>
                    {isClickEditComment && clickedCommentId === oneComment.id ? (
                      <>
                        <Textarea
                          padding="px-4 py-2"
                          textareaValue={editedCommentValue}
                          onChangeValue={onEditCommentValue}
                          refValue={refEditCommentValue}
                        />
                        <div className="flex flex-row gap-2">
                          <Button text="Uložit" onClickButton={onClickSaveEditComment} />
                          <ButtonClose text="Zahodit změny" showText={true} onClickButtonClose={onClickCloseEditComment} />
                        </div>
                      </>
                    ) : (
                      <Comment
                        id={oneComment.id}
                        comment={oneComment.comment}
                        editComment={() => onClickEditComment(oneComment.id, oneComment.comment)}
                        deleteComment={() => onDeleteComment(oneComment.id)}
                      />
                    )}
                  </div>
                ))
              }
            </div> */}
          </div>
          <div className="w-[100%] md:w-[20%] flex flex-col gap-6">
           
            <div>
              {/* <h3 className="text-[12px] text-[#44546f] font-bold">Actions</h3> */}
              <div className="mt-2 flex flex-col gap-2">
             
              
                <hr className="border-1 border-[#d1d4dB]"></hr>
                {/* <button className="px-1.5 py-3 h-8 w-full bg-[#e5e6ea] text-[14px] text-[#44546f] font-bold hover:bg-[#d1d4db] flex gap-1 items-center cursor-pointer" title="Archivovat">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                  </svg>
                  <p>Delete</p>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}