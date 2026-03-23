'use client'
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function WorkoutsIcon({ color }: { color: string }) {
    return (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 9.43571C13 8.93778 12.9019 8.44473 12.7114 7.9847C12.5208 7.52468 12.2415 7.10669 11.8894 6.7546C11.5373 6.40251 11.1193 6.12322 10.6593 5.93267C10.1993 5.74212 9.70624 5.64404 9.20831 5.64404H5.14581C4.57117 5.64404 4.02007 5.87232 3.61374 6.27864C3.20741 6.68497 2.97914 7.23607 2.97914 7.81071V17.4784C2.97914 18.053 3.20741 18.6041 3.61374 19.0104C4.02007 19.4168 4.57117 19.645 5.14581 19.645H9.38922C10.2892 19.645 11.1669 19.9252 11.9004 20.4467L13 21.2278M13 9.43571V21.2278M13 9.43571C13 8.4301 13.3995 7.46567 14.1105 6.7546C14.8216 6.04352 15.786 5.64404 16.7916 5.64404H20.8541C21.4288 5.64404 21.9799 5.87232 22.3862 6.27864C22.7925 6.68497 23.0208 7.23607 23.0208 7.81071V17.4784C23.0208 18.053 22.7925 18.6041 22.3862 19.0104C21.9799 19.4168 21.4288 19.645 20.8541 19.645H16.6096C15.71 19.6452 14.8328 19.9254 14.0996 20.4467L13 21.2278" stroke={color} strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

function ExercisesIcon({ color }: { color: string }) {
    return (
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.66007 23.0207V8.93734H5.14582C4.57119 8.93734 4.02009 9.16561 3.61376 9.57194C3.20743 9.97827 2.97916 10.5294 2.97916 11.104V20.854C2.97916 21.4286 3.20743 21.9797 3.61376 22.3861C4.02009 22.7924 4.57119 23.0207 5.14582 23.0207H9.66007ZM9.66007 23.0207H16.3399M9.66007 23.0207V5.14567C9.66007 4.57103 9.88835 4.01993 10.2947 3.61361C10.701 3.20728 11.2521 2.979 11.8267 2.979H14.1732C14.7479 2.979 15.299 3.20728 15.7053 3.61361C16.1116 4.01993 16.3399 4.57103 16.3399 5.14567V23.0207M16.3399 23.0207H20.8542C21.4288 23.0207 21.9799 22.7924 22.3862 22.3861C22.7926 21.9797 23.0208 21.4286 23.0208 20.854V15.4373C23.0208 14.8627 22.7926 14.3116 22.3862 13.9053C21.9799 13.4989 21.4288 13.2707 20.8542 13.2707H16.3399V23.0207Z" stroke={color} strokeWidth="1.625" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export function Footer(){
    const path = usePathname()
    const isWorkouts = path === "/"
    const isExercises = path.startsWith("/exercises")

    const active = "var(--accent)"
    const inactive = "var(--grey-dark)"

    return (
        <footer className="rounded-[40px] px-5 py-2.5 w-87.5 h-16.25 flex flex-row justify-between items-center bg-[#FFFFFFCC] border border-[#F2F2F2] backdrop-blur-[10px] shadow-[0px_0px_15px_0px_#00000024]">
            <Link href={"/"} className="px-5 py-px gap-1.25 flex flex-col items-center justify-center">
                <WorkoutsIcon color={isWorkouts ? active : inactive} />
                <span className={" font-medium leading-2.5 text-[10px] tracking-[-0.07px] " + (isWorkouts ? ' text-accent' : ' text-grey-dark')}>Тренировки</span>
            </Link>
            <button className="w-17.5 h-17.5 bg-accent rounded-full flex items-center justify-center shrink-0 shadow-[0px_0px_15px_0px_#00000033]">
                <Image src="/svg/footer/plus.svg" alt="plus" width={24} height={24} />
            </button>
            <Link href={"/exercises"} className="px-5 py-px gap-1.25 flex flex-col items-center justify-center">
                <ExercisesIcon color={isExercises ? active : inactive} />
                <span className={" font-medium leading-2.5 text-[10px] tracking-[-0.07px] " + (isExercises ? ' text-accent' : ' text-grey-dark')}>Упражнения</span>
            </Link>
        </footer>
    )
}