'use client'

import { ExerciseItem } from "@/components/cards/ExerciseItem";
import { MyExercisesListDocument, SortEnum } from "@/generated/graphql";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import { useState } from "react";

export default function ExercisesPage() {
  const { loading: authLoading } = useAuth();
  const [isASCSortType, setIsASCSortType] = useState(true);

  const sort = isASCSortType ? SortEnum.Desc : SortEnum.Asc;

  const { data } = useQuery(MyExercisesListDocument, {
    variables: { sort },
    skip: authLoading,
  });

  const items = data?.myExercisesList ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <span className="leading-6 font-semibold text-[18px] tracking-[-0.45px] text-txt">Упражнения</span>
        <div className="flex flex-row gap-2.5" onClick={() => setIsASCSortType(!isASCSortType)}>
          <Image src="/svg/header/sort.svg" alt="sort" width={22} height={22} />
          <span className="text-[14px] text-grey-dark leading-5.5 font-semibold">{isASCSortType ? 'Недавно ' : 'Давно '} выполненные</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <ExerciseItem key={item.id} title={item.name} maxVal={item.maxWeight ?? 0} id={item.id} />
        ))}
      </div>
    </div>
  );
}
