import dataSource from '../data-source'
import { Equipment } from '../exercise/entities/equipment.entity'
import { Exercise } from '../exercise/entities/exercise.entity'
import { MuscleGroup } from '../exercise/entities/muscle-group.entity'

async function seed() {
	await dataSource.initialize()
	console.log('Seeding exercise data...')

	const mgRepo = dataSource.getRepository(MuscleGroup)
	const eqRepo = dataSource.getRepository(Equipment)
	const exRepo = dataSource.getRepository(Exercise)

	// --- Muscle Groups ---
	const muscleGroups = await mgRepo.save([
		{ name: 'chest', aliases: ['грудь', 'грудные', 'грудак'] },
		{ name: 'back', aliases: ['спина', 'широчайшие'] },
		{ name: 'legs', aliases: ['ноги', 'бёдра'] },
		{ name: 'shoulders', aliases: ['плечи', 'дельты'] },
		{ name: 'biceps', aliases: ['бицепс'] },
		{ name: 'triceps', aliases: ['трицепс'] },
		{ name: 'core', aliases: ['кор', 'пресс', 'живот'] },
		{ name: 'glutes', aliases: ['ягодицы', 'ягодичные', 'попа'] },
		{ name: 'forearms', aliases: ['предплечья', 'хват'] },
		{ name: 'traps', aliases: ['трапеция', 'трапы'] },
		{ name: 'calves', aliases: ['икры', 'голень'] }
	])

	const mg = Object.fromEntries(muscleGroups.map(m => [m.name, m]))

	// --- Equipment ---
	const equipmentList = await eqRepo.save([
		{ name: 'barbell', aliases: ['штанга', 'гриф'] },
		{ name: 'dumbbell', aliases: ['гантели', 'гантель', 'ганьтели'] },
		{ name: 'machine', aliases: ['тренажёр', 'тренажер'] },
		{ name: 'bodyweight', aliases: ['собственный вес', 'свой вес'] },
		{ name: 'cable', aliases: ['блок', 'кроссовер', 'тросовый'] },
		{ name: 'kettlebell', aliases: ['гиря', 'гири'] },
		{ name: 'ez-bar', aliases: ['изогнутый гриф', 'ez гриф'] },
		{ name: 'bands', aliases: ['резинки', 'эспандер', 'ленты'] }
	])

	const eq = Object.fromEntries(equipmentList.map(e => [e.name, e]))

	// --- Exercises ---
	const exercises: Partial<Exercise>[] = [
		// Chest
		{
			name: 'Bench Press',
			description: 'Compound pressing movement for chest',
			aliases: ['жим лёжа', 'жим лежа', 'жим штанги лёжа', 'жим гантелей лёжа', 'жим гантелей'],
			muscleGroups: [mg.chest, mg.triceps],
			equipment: [eq.barbell, eq.dumbbell]
		},
		{
			name: 'Incline Bench Press',
			description: 'Pressing on an incline bench targeting upper chest',
			aliases: ['наклонный жим', 'жим на наклонной скамье', 'жим на наклонной'],
			muscleGroups: [mg.chest, mg.shoulders],
			equipment: [eq.barbell, eq.dumbbell]
		},
		{
			name: 'Push-Up',
			description: 'Bodyweight pressing exercise',
			aliases: ['отжимания', 'отжимания от пола'],
			muscleGroups: [mg.chest, mg.triceps],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Dumbbell Fly',
			description: 'Chest isolation with dumbbells',
			aliases: ['разводка', 'разводка гантелей'],
			muscleGroups: [mg.chest],
			equipment: [eq.dumbbell]
		},
		{
			name: 'Cable Crossover',
			description: 'Cable chest isolation movement',
			aliases: ['кроссовер', 'сведение в кроссовере', 'кроссовер на грудь'],
			muscleGroups: [mg.chest],
			equipment: [eq.cable]
		},

		// Back
		{
			name: 'Pull-Up',
			description: 'Bodyweight vertical pulling exercise',
			aliases: ['подтягивания', 'подтяги'],
			muscleGroups: [mg.back, mg.biceps],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Deadlift',
			description: 'Compound full-body pulling from the floor',
			aliases: ['становая тяга', 'тяга', 'станина', 'становая'],
			muscleGroups: [mg.back, mg.legs, mg.glutes],
			equipment: [eq.barbell]
		},
		{
			name: 'Barbell Row',
			description: 'Barbell bent-over row',
			aliases: ['тяга штанги в наклоне', 'тяга в наклоне', 'тяга штанги'],
			muscleGroups: [mg.back],
			equipment: [eq.barbell]
		},
		{
			name: 'Lat Pulldown',
			description: 'Cable lat pulldown to chest',
			aliases: ['тяга верхнего блока', 'верхний блок', 'тяга блока'],
			muscleGroups: [mg.back],
			equipment: [eq.cable]
		},
		{
			name: 'Dumbbell Row',
			description: 'Single-arm dumbbell row',
			aliases: ['тяга гантели', 'тяга гантели в наклоне'],
			muscleGroups: [mg.back],
			equipment: [eq.dumbbell]
		},
		{
			name: 'Seated Cable Row',
			description: 'Horizontal cable row',
			aliases: ['тяга нижнего блока', 'нижний блок', 'горизонтальная тяга'],
			muscleGroups: [mg.back],
			equipment: [eq.cable]
		},

		// Legs
		{
			name: 'Squat',
			description: 'Compound lower body exercise',
			aliases: ['присед', 'приседания', 'приседания со штангой'],
			muscleGroups: [mg.legs, mg.glutes, mg.core],
			equipment: [eq.barbell]
		},
		{
			name: 'Leg Press',
			description: 'Machine pressing for legs',
			aliases: ['жим ногами', 'жим платформы'],
			muscleGroups: [mg.legs, mg.glutes],
			equipment: [eq.machine]
		},
		{
			name: 'Lunge',
			description: 'Unilateral leg exercise',
			aliases: ['выпады', 'выпады вперёд'],
			muscleGroups: [mg.legs, mg.glutes],
			equipment: [eq.dumbbell, eq.barbell, eq.bodyweight]
		},
		{
			name: 'Leg Extension',
			description: 'Machine quad isolation',
			aliases: ['разгибание ног', 'разгибание'],
			muscleGroups: [mg.legs],
			equipment: [eq.machine]
		},
		{
			name: 'Leg Curl',
			description: 'Machine hamstring isolation',
			aliases: ['сгибание ног', 'сгибание лёжа'],
			muscleGroups: [mg.legs],
			equipment: [eq.machine]
		},
		{
			name: 'Romanian Deadlift',
			description: 'Hip hinge targeting hamstrings and glutes',
			aliases: ['румынская тяга', 'RDL', 'мёртвая тяга', 'румынка'],
			muscleGroups: [mg.legs, mg.glutes, mg.back],
			equipment: [eq.barbell, eq.dumbbell]
		},

		// Shoulders
		{
			name: 'Overhead Press',
			description: 'Standing barbell press overhead',
			aliases: ['жим стоя', 'армейский жим', 'жим штанги стоя'],
			muscleGroups: [mg.shoulders, mg.triceps],
			equipment: [eq.barbell]
		},
		{
			name: 'Seated Dumbbell Press',
			description: 'Seated dumbbell shoulder press',
			aliases: ['жим гантелей сидя', 'жим сидя', 'жим гантелей над головой'],
			muscleGroups: [mg.shoulders],
			equipment: [eq.dumbbell]
		},
		{
			name: 'Lateral Raise',
			description: 'Dumbbell side raises for lateral delts',
			aliases: ['махи в стороны', 'махи гантелями', 'разводка стоя'],
			muscleGroups: [mg.shoulders],
			equipment: [eq.dumbbell]
		},

		// Biceps
		{
			name: 'Barbell Curl',
			description: 'Standing barbell curl',
			aliases: ['подъём штанги на бицепс', 'бицепс со штангой', 'подъём на бицепс'],
			muscleGroups: [mg.biceps],
			equipment: [eq.barbell, eq['ez-bar']]
		},
		{
			name: 'Dumbbell Curl',
			description: 'Dumbbell bicep curl',
			aliases: ['подъём гантелей на бицепс', 'бицепс с гантелями', 'молотки'],
			muscleGroups: [mg.biceps],
			equipment: [eq.dumbbell]
		},

		// Triceps
		{
			name: 'Skull Crusher',
			description: 'Lying tricep extension',
			aliases: ['французский жим', 'французский', 'трицепс лёжа'],
			muscleGroups: [mg.triceps],
			equipment: [eq.barbell, eq['ez-bar']]
		},
		{
			name: 'Dip',
			description: 'Parallel bar dips',
			aliases: ['отжимания на брусьях', 'брусья', 'дипы'],
			muscleGroups: [mg.triceps, mg.chest],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Tricep Pushdown',
			description: 'Cable tricep pushdown',
			aliases: ['разгибание рук на блоке', 'трицепс на блоке'],
			muscleGroups: [mg.triceps],
			equipment: [eq.cable]
		},

		// Core
		{
			name: 'Plank',
			description: 'Isometric core hold',
			aliases: ['планка', 'планка на локтях'],
			muscleGroups: [mg.core],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Crunch',
			description: 'Abdominal crunch',
			aliases: ['скручивания', 'пресс'],
			muscleGroups: [mg.core],
			equipment: [eq.bodyweight]
		}
	]

	for (const ex of exercises) {
		const exercise = exRepo.create(ex)
		await exRepo.save(exercise)
	}

	console.log(`Seeded: ${muscleGroups.length} muscle groups`)
	console.log(`Seeded: ${equipmentList.length} equipment`)
	console.log(`Seeded: ${exercises.length} exercises`)

	await dataSource.destroy()
}

seed().catch(err => {
	console.error('Seed failed:', err)
	process.exit(1)
})
