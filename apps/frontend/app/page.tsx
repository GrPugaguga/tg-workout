"use client";

import { Workout } from "@/components/cards/Workout";
import type { IWorkout } from "@/components/cards/Workout";
import { Calendar } from "@/components/Calendar";
import {
  DeleteWorkoutDocument,
  MyWorkoutDatesDocument,
  MyWorkoutsDocument,
  MyWorkoutsByDateDocument,
  type MyWorkoutsQuery,
  SortEnum,
} from "@/generated/graphql";
import { useTelegram } from "@/lib/telegram";
import { useMutation, useQuery } from "@apollo/client/react";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";

const PAGE_SIZE = 10;

type WorkoutItem = MyWorkoutsQuery["myWorkouts"]["items"][number];

function toIWorkout(item: WorkoutItem): IWorkout {
  return {
    id: item.id,
    date: item.date,
    exercises: item.exercises.map((ex) => ({
      title: ex.exercise.name,
      sets: ex.sets.map((s) => ({
        sets: s.sets,
        reps: s.reps ?? undefined,
        weight: s.weight ?? undefined,
      })),
    })),
  };
}

export default function Home() {
  const { loading: authLoading, initData, token, error } = useTelegram();
  const [isASCSortType, setIsASCSortType] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const sort = isASCSortType ? SortEnum.Desc : SortEnum.Asc;

  const { data: allData, fetchMore } = useQuery(MyWorkoutsDocument, {
    variables: { pagination: { take: PAGE_SIZE, sort } },
    skip: authLoading || !!selectedDate,
  });

  const { data: dateData } = useQuery(MyWorkoutsByDateDocument, {
    variables: { input: { date: selectedDate! } },
    skip: authLoading || !selectedDate,
  });

  const { data: datesData } = useQuery(MyWorkoutDatesDocument, {
    skip: authLoading,
  });

  const [deleteWorkout] = useMutation(DeleteWorkoutDocument, {
    update(cache, _, { variables }) {
      if (variables?.id) {
        cache.evict({ id: cache.identify({ __typename: "Workout", id: variables.id }) });
        cache.gc();
      }
    },
  });

  const items = selectedDate
    ? (dateData?.myWorkoutsByDate.items ?? [])
    : (allData?.myWorkouts.items ?? []);

  const workoutDates = datesData?.myWorkoutDates.dates ?? [];
  const hasMore = !selectedDate && (allData?.myWorkouts.hasMore ?? false);

  function loadMore() {
    fetchMore({ variables: { pagination: { skip: items.length, take: PAGE_SIZE, sort } } });
  }

  return (
    <div className="flex flex-col gap-5 w-87.5">
      {/* <span className="text-[50px]">{initData + ' jwt - ' + token}</span>
      <span className="text-[50px]">{error}</span> */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <span className="leading-6 font-semibold text-[18px] tracking-[-0.45px] text-txt">Тренировки</span>
          <Image src="/svg/calendar/calendar.svg" alt="sort" width={22} height={22} className="cursor-pointer" onClick={() => setShowCalendar(true)} priority/>
        </div>
        <div className="flex flex-row gap-2.5" onClick={() => { setIsASCSortType(!isASCSortType); setSelectedDate(null); }}>
          <Image src="/svg/header/sort.svg" alt="sort" width={22} height={22} priority/>
          <span className="text-[14px] text-grey-dark leading-5.5 font-semibold">{isASCSortType ? "Недавно " : "Давно "} выполненные</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Workout
            key={item.id}
            data={toIWorkout(item)}
            onDelete={() => deleteWorkout({ variables: { id: item.id } })}
          />
        ))}
        {hasMore && (
          <button onClick={loadMore} className="text-[14px] text-grey-dark text-center py-2">
            Загрузить ещё
          </button>
        )}
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
