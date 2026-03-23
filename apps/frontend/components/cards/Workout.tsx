"use client"

import Image from "next/image"
import { useState } from "react"
import { createPortal } from "react-dom"
import { ActionPopup, ApprovePopup } from "@/ui-kit"

interface IExerciseSet {
    weight?: number
    sets: number
    reps?: number
    duration?: number
}

interface IExercise {
    title: string,
    sets: IExerciseSet[]
}

export interface IWorkout {
    id: string
    date: string,
    exercises: IExercise[]
}

function Exercise({ ex }: { ex:IExercise}){
    function format(set: IExerciseSet): string{
        return `${set.reps} x ${set.weight} кг ${set.sets > 1 ? `(x${set.sets})`: ''}`
    }

    return (
        <>
            <span className="mx-5 col-start-1 col-span-2">{ex.title}</span>
            <div className="flex flex-col gap-1 col-start-3 col-span-2">
                {ex.sets.map((set,i)=> (
                    <span className="" key={i}>{format(set)}</span>
                ))}
            </div>

        </>
    )
}
export function Workout({ data, onDelete }: {data: IWorkout, onDelete: () => void}) {
  const [popupState, setPopupState] = useState<'none' | 'action' | 'approve'>('none')

  return (
    <div className="bg-white rounded-[20px] w-87.5 grid grid-cols-4 gap-x-5 gap-y-4 py-5">
        <div className="mx-5 col-start-1 col-span-4 flex flex-row justify-between">
            <span className=" text-txt text-[16px] leading-5.5 font-medium ">{data.date}</span>
            <div className="relative">
                <button className="cursor-pointer" onClick={() => setPopupState('action')}>
                    <Image src="/svg/menu/menu-light.svg" alt="menu" width={22} height={22} className={popupState === 'none' ? '' : 'hidden'} />
                    <Image src="/svg/menu/menu-dark.svg" alt="menu" width={22} height={22} className={popupState !== 'none' ? '' : 'hidden'} />
                </button>
                {popupState === 'action' && (
                    <>
                        <div className="fixed inset-0 z-9" onClick={() => setPopupState('none')} />
                        <div className="absolute -right-5 top-full mt-4 z-10">
                            <ActionPopup onClick={() => setPopupState('approve')} />
                        </div>
                    </>
                )}
            </div>
        </div>
        <div className="col-start-1 col-span-4 grid grid-cols-4 gap-x-5 gap-y-2.5  text-grey-dark text-[14px] leading-5.5 font-medium">
            {data.exercises.map((ex,i) => (
                <Exercise ex={ex} key={i} />
            ))}
        </div>
        {popupState === 'approve' && createPortal(
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 pb-25">
                <ApprovePopup
                    onCancel={() => setPopupState('none')}
                    onApprove={() => { onDelete(); setPopupState('none'); }}
                />
            </div>,
            document.body
        )}
    </div>
  )
}
