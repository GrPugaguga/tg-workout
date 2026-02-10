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
			name: 'Жим штанги лёжа',
			description: 'Базовое упражнение на грудные мышцы',
			aliases: ['bench press', 'жим лёжа', 'жим лежа'],
			muscleGroups: [mg.chest, mg.triceps],
			equipment: [eq.barbell]
		},
		{
			name: 'Жим гантелей лёжа',
			description: 'Жим лёжа с гантелями',
			aliases: ['dumbbell bench press', 'жим гантелей'],
			muscleGroups: [mg.chest, mg.triceps],
			equipment: [eq.dumbbell]
		},
		{
			name: 'Жим на наклонной скамье',
			description: 'Жим штанги на наклонной скамье вверх',
			aliases: ['incline bench press', 'наклонный жим'],
			muscleGroups: [mg.chest, mg.shoulders],
			equipment: [eq.barbell, eq.dumbbell]
		},
		{
			name: 'Отжимания',
			description: 'Отжимания от пола',
			aliases: ['push-ups', 'отжимания от пола'],
			muscleGroups: [mg.chest, mg.triceps],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Разводка гантелей',
			description: 'Разведение рук с гантелями лёжа',
			aliases: ['dumbbell flyes', 'разводка'],
			muscleGroups: [mg.chest],
			equipment: [eq.dumbbell]
		},
		{
			name: 'Сведение в кроссовере',
			description: 'Сведение рук в кроссовере',
			aliases: ['cable crossover', 'кроссовер на грудь'],
			muscleGroups: [mg.chest],
			equipment: [eq.cable]
		},

		// Back
		{
			name: 'Подтягивания',
			description: 'Подтягивания на перекладине',
			aliases: ['pull-ups', 'подтяги'],
			muscleGroups: [mg.back, mg.biceps],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Становая тяга',
			description: 'Классическая становая тяга',
			aliases: ['deadlift', 'тяга', 'станина'],
			muscleGroups: [mg.back, mg.legs, mg.glutes],
			equipment: [eq.barbell]
		},
		{
			name: 'Тяга штанги в наклоне',
			description: 'Тяга штанги к поясу в наклоне',
			aliases: ['barbell row', 'тяга в наклоне'],
			muscleGroups: [mg.back],
			equipment: [eq.barbell]
		},
		{
			name: 'Тяга верхнего блока',
			description: 'Тяга верхнего блока к груди',
			aliases: ['lat pulldown', 'верхний блок', 'тяга блока'],
			muscleGroups: [mg.back],
			equipment: [eq.cable]
		},
		{
			name: 'Тяга гантели в наклоне',
			description: 'Тяга гантели одной рукой в наклоне',
			aliases: ['dumbbell row', 'тяга гантели'],
			muscleGroups: [mg.back],
			equipment: [eq.dumbbell]
		},
		{
			name: 'Тяга нижнего блока',
			description: 'Горизонтальная тяга нижнего блока',
			aliases: ['seated cable row', 'нижний блок', 'горизонтальная тяга'],
			muscleGroups: [mg.back],
			equipment: [eq.cable]
		},

		// Legs
		{
			name: 'Приседания со штангой',
			description: 'Классические приседания со штангой на плечах',
			aliases: ['squat', 'присед', 'приседания'],
			muscleGroups: [mg.legs, mg.glutes, mg.core],
			equipment: [eq.barbell]
		},
		{
			name: 'Жим ногами',
			description: 'Жим ногами в тренажёре',
			aliases: ['leg press', 'жим платформы'],
			muscleGroups: [mg.legs, mg.glutes],
			equipment: [eq.machine]
		},
		{
			name: 'Выпады',
			description: 'Выпады с гантелями или штангой',
			aliases: ['lunges', 'выпады вперёд'],
			muscleGroups: [mg.legs, mg.glutes],
			equipment: [eq.dumbbell, eq.barbell, eq.bodyweight]
		},
		{
			name: 'Разгибание ног',
			description: 'Разгибание ног в тренажёре',
			aliases: ['leg extension', 'разгибание'],
			muscleGroups: [mg.legs],
			equipment: [eq.machine]
		},
		{
			name: 'Сгибание ног',
			description: 'Сгибание ног лёжа в тренажёре',
			aliases: ['leg curl', 'сгибание лёжа'],
			muscleGroups: [mg.legs],
			equipment: [eq.machine]
		},
		{
			name: 'Румынская тяга',
			description: 'Румынская становая тяга на прямых ногах',
			aliases: ['romanian deadlift', 'RDL', 'мёртвая тяга'],
			muscleGroups: [mg.legs, mg.glutes, mg.back],
			equipment: [eq.barbell, eq.dumbbell]
		},

		// Shoulders
		{
			name: 'Жим штанги стоя',
			description: 'Армейский жим штанги над головой',
			aliases: ['overhead press', 'армейский жим', 'жим стоя'],
			muscleGroups: [mg.shoulders, mg.triceps],
			equipment: [eq.barbell]
		},
		{
			name: 'Жим гантелей сидя',
			description: 'Жим гантелей над головой сидя',
			aliases: ['dumbbell shoulder press', 'жим сидя'],
			muscleGroups: [mg.shoulders],
			equipment: [eq.dumbbell]
		},
		{
			name: 'Махи гантелями в стороны',
			description: 'Подъём гантелей через стороны',
			aliases: ['lateral raise', 'махи в стороны', 'разводка стоя'],
			muscleGroups: [mg.shoulders],
			equipment: [eq.dumbbell]
		},

		// Biceps
		{
			name: 'Подъём штанги на бицепс',
			description: 'Сгибание рук со штангой стоя',
			aliases: ['barbell curl', 'бицепс со штангой', 'подъём на бицепс'],
			muscleGroups: [mg.biceps],
			equipment: [eq.barbell, eq['ez-bar']]
		},
		{
			name: 'Подъём гантелей на бицепс',
			description: 'Сгибание рук с гантелями',
			aliases: ['dumbbell curl', 'бицепс с гантелями', 'молотки'],
			muscleGroups: [mg.biceps],
			equipment: [eq.dumbbell]
		},

		// Triceps
		{
			name: 'Французский жим',
			description: 'Разгибание рук со штангой лёжа',
			aliases: ['skull crusher', 'французский', 'трицепс лёжа'],
			muscleGroups: [mg.triceps],
			equipment: [eq.barbell, eq['ez-bar']]
		},
		{
			name: 'Отжимания на брусьях',
			description: 'Отжимания на параллельных брусьях',
			aliases: ['dips', 'брусья'],
			muscleGroups: [mg.triceps, mg.chest],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Разгибание рук на блоке',
			description: 'Разгибание рук на верхнем блоке',
			aliases: ['tricep pushdown', 'трицепс на блоке'],
			muscleGroups: [mg.triceps],
			equipment: [eq.cable]
		},

		// Core
		{
			name: 'Планка',
			description: 'Статическое удержание в упоре лёжа',
			aliases: ['plank', 'планка на локтях'],
			muscleGroups: [mg.core],
			equipment: [eq.bodyweight]
		},
		{
			name: 'Скручивания',
			description: 'Скручивания на пресс лёжа',
			aliases: ['crunches', 'пресс'],
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
