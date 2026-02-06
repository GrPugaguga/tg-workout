export const WORKOUT_CREATED_EVENT = 'workout.created'

export interface WorkoutCreatedEvent {
    workoutId: string
    userId: string
    date: string
    exercises: any
    createdAt: string
}