import { collection } from 'typesense-ts'

export const exerciseCollection = collection({
	name: 'exercises',
	fields: [
		{ name: 'id',          type: 'string' },
		{ name: 'name',        type: 'string' },
		{ name: 'description', type: 'string', index: false },
		{ name: 'aliases',     type: 'string[]', optional: true },
		{ name: 'muscleGroups',type: 'string[]', facet: true },
		{ name: 'equipment',   type: 'string[]', facet: true, optional: true },
	]
})

declare module "typesense-ts" {
  interface Collections {
    exercises: typeof exerciseCollection.schema;
  }
}

export type ExerciseDocument = typeof exerciseCollection.infer
