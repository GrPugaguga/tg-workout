'use client'

import { Chart } from "@/components/cards/Chart";
import { ExerciseHistory } from "@/components/cards/ExerciseHistory";
import { OneRepMax } from "@/components/cards/OneRepMax";
import { MyExerciseHistoryDocument } from "@/generated/graphql";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import { use } from "react";
import { useRouter } from "next/navigation";

export default function ExercisesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { loading: authLoading } = useAuth();

  const { data } = useQuery(MyExerciseHistoryDocument, {
    variables: { exercise: id },
    skip: authLoading,
  });

  const exercise = data?.myExerciseHistory;

  const chartData = exercise?.history.map((h) => ({
    date: h.date.slice(0, 5),
    value: h.maxWeight ?? 0,
  })) ?? [];

  const historyData = exercise?.history.map((h) => ({
    date: h.date,
    sets: h.sets.map((s) => ({
      sets: s.sets ?? 0,
      reps: s.reps ?? undefined,
      weight: s.weight ?? undefined,
    })),
  })) ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row justify-between">
        <Image src="/svg/exercise/back.svg" alt="back" width={22} height={22} className="self-center cursor-pointer" onClick={router.back} priority/>
        <span className="w-full text-center leading-6 font-semibold text-[18px] tracking-[-0.45px] text-txt">
          {exercise?.name ?? ''}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <Chart title="Вес" data={chartData} unit="кг" />
        <OneRepMax value={exercise?.maxWeight ?? 0} />
        <ExerciseHistory data={historyData} />
      </div>
    </div>
  );
}
