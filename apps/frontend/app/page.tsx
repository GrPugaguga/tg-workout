"use client";

import { Workout } from "@/components/cards/Workout";
import type { IWorkout } from "@/components/cards/Workout";
import { Calendar } from "@/components/Calendar";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";

const mockWorkout: IWorkout = {
  id: "1",
  date: "15/03/2026",
  exercises: [
    {
      title: "Жим штанги лёжа",
      sets: [
        { sets: 3, reps: 8, weight: 70 },
        { sets: 2, reps: 6, weight: 80 },
      ],
    },
    {
      title: "Присед со штангой",
      sets: [
        { sets: 4, reps: 10, weight: 90 },
      ],
    },
    {
      title: "Тяга верхнего блока",
      sets: [
        { sets: 3, reps: 12, weight: 55 },
        { sets: 1, reps: 10, weight: 60 },
      ],
    },
  ],
};

export default function Home() {
  const [isASCSortType, setIsASCSortType] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const workoutDates = [mockWorkout.date];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <span className="leading-6 font-semibold text-[18px] tracking-[-0.45px] text-txt">Тренировки</span>
          <Image src="/svg/calendar/calendar.svg" alt="sort" width={22} height={22} className="cursor-pointer" onClick={() => setShowCalendar(true)}/>
        </div>
        <div className="flex flex-row gap-2.5" onClick={() => setIsASCSortType(!isASCSortType)}>
          <Image src="/svg/header/sort.svg" alt="sort" width={22} height={22}/>
          <span className="text-[14px] text-grey-dark leading-5.5 font-semibold">{isASCSortType? 'Недавно ': 'Давно '} выполненные</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Workout data={mockWorkout} onDelete={() => console.log('delete')} />
        <Workout data={mockWorkout} onDelete={() => console.log('delete')} />
        <Workout data={mockWorkout} onDelete={() => console.log('delete')} />
        <Workout data={mockWorkout} onDelete={() => console.log('delete')} />
        <Workout data={mockWorkout} onDelete={() => console.log('delete')} />
      </div>
      {showCalendar && createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 pt-6">
          <Calendar
            workoutDates={workoutDates}
            onSelectDate={(date) => { setSelectedDate(date); setShowCalendar(false); }}
            onClose={() => setShowCalendar(false)}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
