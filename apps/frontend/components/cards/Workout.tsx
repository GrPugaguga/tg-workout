import Image from "next/image"

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
export function Workout({ data }: {data: IWorkout}) {
  return (
    <div className="bg-white rounded-[20px] w-87.5 grid grid-cols-4 gap-x-5 gap-y-4 py-5">
        <div className="mx-5 col-start-1 col-span-4 flex flex-row justify-between">
            <span className=" text-txt text-[16px] leading-5.5 font-medium ">{data.date}</span>
            <Image src="/svg/menu/menu-light.svg" alt="menu" width={22} height={22} className="block dark:hidden" />
            <Image src="/svg/menu/menu-dark.svg" alt="menu" width={22} height={22} className="hidden dark:block" />
        </div>
        <div className="col-start-1 col-span-4 grid grid-cols-4 gap-x-5 gap-y-2.5  text-grey-dark text-[14px] leading-5.5 font-medium">
            {data.exercises.map((ex,i) => (
                <Exercise ex={ex} key={i} />
            ))}
        </div>
    </div>
  )
}
