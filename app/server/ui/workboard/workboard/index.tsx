import ColumnWorkboard from "~/server/ui/workboard/column"
import React, { useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { Draggable } from '~/server/ui/workboard/Draggable';
import { Droppable } from "~/server/ui/workboard/Droppable";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/server/db.server";
import { useFetcher, useLoaderData } from "@remix-run/react";
// import {Droppable} from './Droppable';

export async function action({params, request}:ActionArgs) {
  const dndDocRef = db.demo().doc("dnd");
  const dndSnap = await dndDocRef.get();
  const dndDoc = dndSnap.data();

  if (!dndDoc) {
    throw new Response("no doc", { status: 404 })
  }
  const formData = await request.formData();


  const dragId =  formData.get("dragId")
  const dropId =  formData.get("dropId")
  console.log({dragId, dropId})

  const columna = dndDoc.columna;

  // const newColumna= columna.filter()

  return json({dragId,dropId});
}


export async function loader({ params }: LoaderArgs) {
  const dndDocRef = db.demo().doc("dnd");
  const dndSnap = await dndDocRef.get();
  const dndDoc = dndSnap.data();

  if (!dndDoc) {
    throw new Response("no doc", { status: 404 })
  }

  return json({ dndDoc });
}



export default function WorkboardArea() {
  const [isDropped, setIsDropped] = useState(false);
  const fetcher = useFetcher();

  const { dndDoc } = useLoaderData<typeof loader>();


  const draggableMarkup = (
    <Draggable id="test">Drag me</Draggable>
  );

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event)
    if(!event.over){
      console.log("no drop")
      return;
    }

    const dragData = {
      dropId: event.over.id as string,
      dragId: event.active.id as string,
    }

    fetcher.submit(dragData, {
      method: "post",

    })

  }

  return (
    <div className="bg-blue-400 w-full h-screen font-sans">
      <div className="flex p-2 bg-blue-dark items-center">
        {/* <div className="hidden md:flex justify-start">
          <button className="bg-blue-light rounded p-2 font-bold text-white text-sm mr-2 flex">
            <svg className="fill-current text-white h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M41 4H9C6.24 4 4 6.24 4 9v32c0 2.76 2.24 5 5 5h32c2.76 0 5-2.24 5-5V9c0-2.76-2.24-5-5-5zM21 36c0 1.1-.9 2-2 2h-7c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v24zm19-12c0 1.1-.9 2-2 2h-7c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v12z" /></svg>
            Pannels
          </button>
          <input type="text" className="bg-blue-light rounded p-2" />
        </div> */}
        <div className="mx-0 md:mx-auto">
          <h1 className="text-blue-lighter text-xl flex items-center font-sans italic">
            <svg className="fill-current h-8 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M41 4H9C6.24 4 4 6.24 4 9v32c0 2.76 2.24 5 5 5h32c2.76 0 5-2.24 5-5V9c0-2.76-2.24-5-5-5zM21 36c0 1.1-.9 2-2 2h-7c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v24zm19-12c0 1.1-.9 2-2 2h-7c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2v12z" /></svg>
            Workboard
          </h1>
        </div>
        {/* <div className="flex items-center ml-auto">
          <button className="bg-blue-light rounded h-8 w-8 font-bold text-white text-sm mr-2">+</button>
          <button className="bg-blue-light rounded h-8 w-8 font-bold text-white text-sm mr-2">i</button>
          <button className="bg-red rounded h-8 w-8 font-bold text-white text-sm mr-2">
            <svg className="h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c-.8 0-1.5.7-1.5 1.5v.688C7.344 4.87 5 7.62 5 11v4.5l-2 2.313V19h18v-1.188L19 15.5V11c0-3.379-2.344-6.129-5.5-6.813V3.5c0-.8-.7-1.5-1.5-1.5zm-2 18c0 1.102.898 2 2 2 1.102 0 2-.898 2-2z" /></svg>
          </button>
          <img src="https://i.imgur.com/OZaT7jl.png" className="rounded-full" />
        </div> */}
      </div>
      <div className="flex m-4 justify-between">
        <div className="flex">
          <h3 className="text-white mr-4">TailwindComponents.com</h3>
          <ul className="list-reset text-white hidden md:flex">
            <li><span className="font-bold text-lg px-2">☆</span></li>
            <li><span className="border-l border-blue-lighter px-2 text-sm">Business Name</span> <span className="rounded-lg bg-blue-light text-xs px-2 py-1">Free</span></li>
            <li><span className="border-l border-blue-lighter px-2 text-sm ml-2">Team Visible</span></li>
          </ul>
        </div>
        <div className="text-white font-sm text-underlined hidden md:flex items-center underline">
          <svg className="h-4 fill-current text-white cursor-pointer mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 10a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4zm7 0a1.999 1.999 0 1 0 0 4 1.999 1.999 0 1 0 0-4z" /></svg>
          Show menu
        </div>
      </div>
      <DndContext onDragEnd={handleDragEnd}>

        <div className="flex px-4 pb-8 items-start overflow-x-scroll">
          {/* first column */}
          <ColumnWorkboard
            title="first column"
          >

            <Droppable id={"columna"}>
              {
                dndDoc.columna.map((dragId) =>
                <div key={dragId} className="">

                  <Draggable key={dragId} id={dragId}>
                    <div className="bg-white block p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                      {dragId}
                    </div>
                  </Draggable>
                </div>
                )
              }



            </Droppable>
          </ColumnWorkboard>

          {/* second column */}
          <ColumnWorkboard
            title="secound column"
          >
            <Droppable id="second">

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Delete all references from the wiki
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Remove analytics code
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Whatever
              </div>
            </Droppable>
          </ColumnWorkboard>
          <ColumnWorkboard
            title="third column"
          >
            <Droppable id="third">

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Delete all references from the wiki
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Remove analytics code
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Whatever
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Delete all references from the wiki
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Remove analytics code
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                Whatever
              </div>

              <div className="bg-white p-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
                <p>Think more tasks for this example</p>
                <div className="bg-red rounded p-1 mt-2 inline-flex text-white text-xs">
                  <svg className="h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2c-.8 0-1.5.7-1.5 1.5v.688C7.344 4.87 5 7.62 5 11v4.5l-2 2.313V19h18v-1.188L19 15.5V11c0-3.379-2.344-6.129-5.5-6.813V3.5c0-.8-.7-1.5-1.5-1.5zm-2 18c0 1.102.898 2 2 2 1.102 0 2-.898 2-2z" /></svg>
                  2
                </div>
              </div>

            </Droppable>

          </ColumnWorkboard>
        </div>
      </DndContext>

    </div>
  );
}