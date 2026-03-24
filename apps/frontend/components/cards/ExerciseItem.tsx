import Image from "next/image";
import Link from "next/link";

export function ExerciseItem({title, maxVal, id}: {title: string, maxVal: number, id: string} ){
    return (
        <Link 
            className="w-87.5 flex flex-row justify-between p-5 rounded-[20px] bg-white"
            href={`/exercises/${id}`}
        >
            <div className="flex flex-col gap-4">
                <span className=" font-medium text-[16px] leading-5.5 text-txt ">{title}</span>
                { maxVal ? <span className="font-medium text-[14px] leading-5.5 text-grey-dark ">Разовый максимум: {maxVal}кг</span> : ''}
            </div>
            <Image src="/svg/open_arrow.svg" alt="open" width={22} height={22} className="self-center" />
        </Link>
    )
}