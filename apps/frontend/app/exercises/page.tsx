'use client'
import { ExerciseItem } from "@/components/cards/ExerciseItem";
import Image from "next/image";
import { useState } from "react";

export default function ExercisesPage() {
  const [isASCSortType, setIsASCSortType] = useState(true)

  const mockExerciseItems = [
    {
      title:'Жим лежа',
      maxVal: 110,
      id:'1234'
    },
    {
      title:'Присед',
      maxVal: 50,
      id:'111'
    },
    {
      title:'Румынская тяга',
      maxVal: 80,
      id:'42'
    },
    {
      title:'Французский жим',
      maxVal: 20,
      id:'442'
    }
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
          <span className="leading-6 font-semibold text-[18px] tracking-[-0.45px] text-txt">Упражнения</span>
          <div className="flex flex-row gap-2.5" onClick={() => setIsASCSortType(!isASCSortType)}>
            <Image src="/svg/header/sort.svg" alt="sort" width={22} height={22}/>
            <span className="text-[14px] text-grey-dark leading-5.5 font-semibold">{isASCSortType? 'Недавно ': 'Давно '} выполненные</span>
          </div>
      </div>
      <div className="flex flex-col gap-4">
        {mockExerciseItems.map((item, i) => (
          <ExerciseItem title={item.title} maxVal={item.maxVal} id={item.id} key={i}/>
        ))}
      </div>
    </div>
  
  );
}
