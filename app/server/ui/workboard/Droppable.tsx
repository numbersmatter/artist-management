import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable({children, id}: {children:React.ReactNode, id:string}) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? "bg-green-300" : "",
  };
  
  
  return (
    <div ref={setNodeRef} className={isOver ? "bg-green-300" : ""} >
      {children}
    </div>
  );
}