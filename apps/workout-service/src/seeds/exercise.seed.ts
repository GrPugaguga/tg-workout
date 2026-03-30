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
		{ name: 'Грудь' },
		{ name: 'Широчайшие' },
		{ name: 'Трапеции' },
		{ name: 'Ромбовидные' },
		{ name: 'Поясница' },
		{ name: 'Передняя дельта' },
		{ name: 'Средняя дельта' },
		{ name: 'Задняя дельта' },
		{ name: 'Бицепс' },
		{ name: 'Трицепс' },
		{ name: 'Пресс' },
		{ name: 'Большая ягодичная' },
		{ name: 'Средняя ягодичная' },
		{ name: 'Предплечья' },
		{ name: 'Квадрицепс' },
		{ name: 'Бицепс бедра' },
		{ name: 'Приводящие' },
		{ name: 'Икры' },
	])

	const mgByName = Object.fromEntries(muscleGroups.map(m => [m.name, m]))
	const mg = {
		chest:      mgByName['Грудь'],
		back:       mgByName['Широчайшие'],
		traps:      mgByName['Трапеции'],
		rhomboids:  mgByName['Ромбовидные'],
		lower_back: mgByName['Поясница'],
		front_delt: mgByName['Передняя дельта'],
		mid_delt:   mgByName['Средняя дельта'],
		rear_delt:  mgByName['Задняя дельта'],
		biceps:     mgByName['Бицепс'],
		triceps:    mgByName['Трицепс'],
		core:       mgByName['Пресс'],
		glutes:     mgByName['Большая ягодичная'],
		glutes_med: mgByName['Средняя ягодичная'],
		forearms:   mgByName['Предплечья'],
		quads:      mgByName['Квадрицепс'],
		hamstrings: mgByName['Бицепс бедра'],
		adductors:  mgByName['Приводящие'],
		calves:     mgByName['Икры'],
	}

	// --- Equipment ---
	const equipmentList = await eqRepo.save([
		{ name: 'Штанга',          aliases: ['гриф', 'олимпийская штанга'] },
		{ name: 'Гантели',         aliases: ['гантель'] },
		{ name: 'Тренажёр',        aliases: ['тренажер'] },
		{ name: 'Собственный вес', aliases: ['свой вес', 'без оборудования'] },
		{ name: 'Блок',            aliases: ['кроссовер', 'тросовый', 'тросовый тренажёр'] },
		{ name: 'Гиря',            aliases: ['гири'] },
		{ name: 'EZ-гриф',         aliases: ['изогнутый гриф', 'ez гриф'] },
		{ name: 'Резинки',         aliases: ['эспандер', 'ленты', 'резиновые ленты'] },
		{ name: 'Турник',          aliases: ['перекладина'] },
		{ name: 'Брусья',          aliases: ['параллельные брусья'] },
	])

	const eqByName = Object.fromEntries(equipmentList.map(e => [e.name, e]))
	const eq = {
		barbell:    eqByName['Штанга'],
		dumbbell:   eqByName['Гантели'],
		machine:    eqByName['Тренажёр'],
		bodyweight: eqByName['Собственный вес'],
		cable:      eqByName['Блок'],
		kettlebell: eqByName['Гиря'],
		'ez-bar':   eqByName['EZ-гриф'],
		bands:      eqByName['Резинки'],
		pullup_bar: eqByName['Турник'],
		dip_bar:    eqByName['Брусья'],
	}

	// --- Exercises ---
	const exercises: Partial<Exercise>[] = [

		// Грудь
		{
			name: 'Жим лёжа',
			aliases: ['жим штанги лёжа', 'жим лежа'],
			muscleGroups: [mg.chest, mg.front_delt, mg.triceps],
			equipment: [eq.barbell],
		},
		{
			name: 'Жим гантелей лёжа',
			aliases: ['жим гантелей'],
			muscleGroups: [mg.chest, mg.front_delt, mg.triceps],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Жим лёжа на наклонной',
			aliases: ['наклонный жим', 'жим на наклонной'],
			muscleGroups: [mg.chest, mg.front_delt, mg.triceps],
			equipment: [eq.barbell],
		},
		{
			name: 'Жим гантелей на наклонной',
			aliases: ['наклонный жим гантелей'],
			muscleGroups: [mg.chest, mg.front_delt, mg.triceps],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Жим на грудь в тренажёре',
			aliases: ['грудной тренажёр', 'жим в тренажёре на грудь'],
			muscleGroups: [mg.chest, mg.front_delt, mg.triceps],
			equipment: [eq.machine],
		},
		{
			name: 'Разводка гантелей лёжа',
			aliases: ['разводка', 'разведения с гантелями'],
			muscleGroups: [mg.chest, mg.front_delt],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Разводка в тренажёре',
			aliases: ['сведения в тренажёре', 'баттерфляй'],
			muscleGroups: [mg.chest],
			equipment: [eq.machine],
		},
		{
			name: 'Кроссовер на блоке',
			aliases: ['кроссовер', 'сведение в кроссовере'],
			muscleGroups: [mg.chest, mg.front_delt],
			equipment: [eq.cable],
		},
		{
			name: 'Отжимания от пола',
			aliases: ['отжимания'],
			muscleGroups: [mg.chest, mg.front_delt, mg.triceps],
			equipment: [eq.bodyweight],
		},
		{
			name: 'Отжимания на брусьях',
			aliases: ['брусья', 'дипы'],
			muscleGroups: [mg.chest, mg.triceps, mg.front_delt],
			equipment: [eq.dip_bar],
		},

		// Широчайшие / Спина
		{
			name: 'Подтягивания широким хватом',
			aliases: ['подтягивания', 'подтяги'],
			muscleGroups: [mg.back, mg.biceps, mg.rhomboids],
			equipment: [eq.pullup_bar],
		},
		{
			name: 'Подтягивания обратным хватом',
			aliases: ['подтягивания узким хватом', 'обратный хват'],
			muscleGroups: [mg.back, mg.biceps, mg.rhomboids],
			equipment: [eq.pullup_bar],
		},
		{
			name: 'Тяга верхнего блока',
			aliases: ['верхний блок', 'тяга блока'],
			muscleGroups: [mg.back, mg.biceps, mg.rhomboids],
			equipment: [eq.cable],
		},
		{
			name: 'Тяга нижнего блока',
			aliases: ['нижний блок', 'горизонтальная тяга'],
			muscleGroups: [mg.back, mg.rhomboids, mg.biceps, mg.traps],
			equipment: [eq.cable],
		},
		{
			name: 'Тяга штанги к поясу',
			aliases: ['тяга штанги в наклоне', 'тяга в наклоне'],
			muscleGroups: [mg.back, mg.rhomboids, mg.biceps, mg.traps, mg.lower_back],
			equipment: [eq.barbell],
		},
		{
			name: 'Тяга гантели к поясу',
			aliases: ['тяга гантели', 'тяга гантели в наклоне'],
			muscleGroups: [mg.back, mg.rhomboids, mg.biceps],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Пуловер с гантелью',
			aliases: ['пуловер'],
			muscleGroups: [mg.back, mg.chest],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Тяга Т-грифа',
			aliases: ['т-гриф'],
			muscleGroups: [mg.back, mg.rhomboids, mg.biceps, mg.traps],
			equipment: [eq.barbell],
		},

		// Трапеции
		{
			name: 'Шраги',
			aliases: ['шраги со штангой', 'шраги с гантелями'],
			muscleGroups: [mg.traps, mg.forearms],
			equipment: [eq.barbell, eq.dumbbell],
		},
		{
			name: 'Фермерская походка',
			aliases: ['фермерская прогулка', 'фермер'],
			muscleGroups: [mg.traps, mg.forearms, mg.core],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Тяга к подбородку',
			aliases: ['протяжка', 'тяга штанги к подбородку'],
			muscleGroups: [mg.traps, mg.mid_delt, mg.front_delt],
			equipment: [eq.barbell, eq.dumbbell],
		},

		// Ромбовидные + Задняя дельта
		{
			name: 'Тяга к лицу',
			aliases: ['face pull', 'тяга каната к лицу'],
			muscleGroups: [mg.rhomboids, mg.rear_delt, mg.traps],
			equipment: [eq.cable],
		},
		{
			name: 'Разводка в наклоне',
			aliases: ['обратные разводки', 'разводка гантелей в наклоне'],
			muscleGroups: [mg.rhomboids, mg.rear_delt, mg.traps],
			equipment: [eq.dumbbell],
		},

		// Поясница
		{
			name: 'Гиперэкстензия',
			aliases: ['гипер', 'разгибание спины'],
			muscleGroups: [mg.lower_back, mg.glutes, mg.hamstrings],
			equipment: [eq.machine],
		},
		{
			name: 'Наклоны со штангой',
			aliases: ['good morning', 'гуд морнинг'],
			muscleGroups: [mg.lower_back, mg.hamstrings, mg.glutes],
			equipment: [eq.barbell],
		},

		// Дельты
		{
			name: 'Жим гантелей сидя',
			aliases: ['жим гантелей над головой', 'жим сидя'],
			muscleGroups: [mg.mid_delt, mg.front_delt, mg.triceps],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Жим в Смите',
			aliases: ['армейский жим в смите', 'жим в смите сидя'],
			muscleGroups: [mg.mid_delt, mg.front_delt, mg.triceps],
			equipment: [eq.machine],
		},
		{
			name: 'Жим за голову',
			aliases: ['армейский жим за голову', 'жим штанги за голову'],
			muscleGroups: [mg.mid_delt, mg.front_delt, mg.triceps],
			equipment: [eq.barbell],
		},
		{
			name: 'Махи вперёд',
			aliases: ['подъём гантелей перед собой', 'фронтальные махи'],
			muscleGroups: [mg.front_delt],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Махи в стороны',
			aliases: ['разводка стоя', 'латеральные махи'],
			muscleGroups: [mg.mid_delt],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Махи в тренажёре',
			aliases: ['разводка в тренажёре на плечи'],
			muscleGroups: [mg.mid_delt],
			equipment: [eq.machine],
		},
		{
			name: 'Обратные разводки в тренажёре',
			aliases: ['обратная бабочка', 'задняя дельта в тренажёре'],
			muscleGroups: [mg.rear_delt, mg.rhomboids],
			equipment: [eq.machine],
		},

		// Бицепс
		{
			name: 'Подъём штанги на бицепс',
			aliases: ['бицепс со штангой', 'подъём на бицепс'],
			muscleGroups: [mg.biceps, mg.forearms],
			equipment: [eq.barbell, eq['ez-bar']],
		},
		{
			name: 'Подъём гантелей на бицепс',
			aliases: ['бицепс с гантелями', 'сгибания с гантелями'],
			muscleGroups: [mg.biceps, mg.forearms],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Молотки',
			aliases: ['молоток', 'сгибания нейтральным хватом'],
			muscleGroups: [mg.biceps, mg.forearms],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Скамья Скотта',
			aliases: ['скотт', 'сгибания на скамье скотта'],
			muscleGroups: [mg.biceps, mg.forearms],
			equipment: [eq.barbell, eq['ez-bar'], eq.dumbbell],
		},
		{
			name: 'Сгибания на блоке',
			aliases: ['бицепс на блоке', 'тяга блока на бицепс'],
			muscleGroups: [mg.biceps, mg.forearms],
			equipment: [eq.cable],
		},
		{
			name: 'Тренажёр на бицепс',
			aliases: ['сгибания в тренажёре'],
			muscleGroups: [mg.biceps],
			equipment: [eq.machine],
		},

		// Трицепс
		{
			name: 'Французский жим',
			aliases: ['французский', 'трицепс лёжа', 'skull crusher'],
			muscleGroups: [mg.triceps],
			equipment: [eq.barbell, eq['ez-bar'], eq.dumbbell],
		},
		{
			name: 'Разгибания на блоке',
			aliases: ['трицепс на блоке', 'разгибание рук на блоке'],
			muscleGroups: [mg.triceps],
			equipment: [eq.cable],
		},
		{
			name: 'Жим узким хватом',
			aliases: ['жим штанги узким хватом'],
			muscleGroups: [mg.triceps, mg.chest, mg.front_delt],
			equipment: [eq.barbell],
		},
		{
			name: 'Разгибания с гантелью из-за головы',
			aliases: ['французский жим сидя', 'трицепс из-за головы'],
			muscleGroups: [mg.triceps],
			equipment: [eq.dumbbell],
		},

		// Плечи (добавка)
		{
			name: 'Жим Арнольда',
			aliases: ['арнольд', 'жим арнольда'],
			muscleGroups: [mg.front_delt, mg.mid_delt, mg.triceps],
			equipment: [eq.dumbbell],
		},

		// Ягодичные
		{
			name: 'Ягодичный мост',
			aliases: ['ягодичный мостик', 'мост'],
			muscleGroups: [mg.glutes, mg.hamstrings],
			equipment: [eq.barbell, eq.bodyweight],
		},
		{
			name: 'Отведение ноги в блоке',
			aliases: ['отведение ноги', 'кик-бэк на блоке'],
			muscleGroups: [mg.glutes, mg.glutes_med],
			equipment: [eq.cable],
		},
		{
			name: 'Разведение ног в тренажёре',
			aliases: ['разведения', 'абдуктор'],
			muscleGroups: [mg.glutes_med, mg.adductors],
			equipment: [eq.machine],
		},

		// Квадрицепс
		{
			name: 'Присед со штангой',
			aliases: ['присед', 'приседания', 'приседания со штангой'],
			muscleGroups: [mg.quads, mg.glutes, mg.hamstrings, mg.core],
			equipment: [eq.barbell],
		},
		{
			name: 'Присед плие',
			aliases: ['плие', 'приседания плие', 'присед сумо'],
			muscleGroups: [mg.quads, mg.adductors, mg.glutes],
			equipment: [eq.barbell, eq.dumbbell],
		},
		{
			name: 'Жим ногами',
			aliases: ['жим платформы', 'жим ног'],
			muscleGroups: [mg.quads, mg.glutes, mg.hamstrings],
			equipment: [eq.machine],
		},
		{
			name: 'Разгибание ног в тренажёре',
			aliases: ['разгибание ног', 'квадрицепс в тренажёре'],
			muscleGroups: [mg.quads],
			equipment: [eq.machine],
		},
		{
			name: 'Выпады',
			aliases: ['выпады вперёд', 'выпады с гантелями'],
			muscleGroups: [mg.quads, mg.glutes, mg.hamstrings],
			equipment: [eq.dumbbell, eq.barbell, eq.bodyweight],
		},
		{
			name: 'Болгарские выпады с гантелями',
			aliases: ['болгарский сплит', 'болгарские выпады'],
			muscleGroups: [mg.quads, mg.glutes, mg.hamstrings],
			equipment: [eq.dumbbell],
		},
		{
			name: 'Болгарский присед',
			aliases: ['болгарский присед со штангой'],
			muscleGroups: [mg.quads, mg.glutes, mg.hamstrings],
			equipment: [eq.barbell],
		},

		// Бицепс бедра
		{
			name: 'Становая тяга',
			aliases: ['тяга', 'становая', 'классическая тяга'],
			muscleGroups: [mg.hamstrings, mg.glutes, mg.lower_back, mg.quads, mg.traps],
			equipment: [eq.barbell],
		},
		{
			name: 'Становая тяга сумо',
			aliases: ['тяга сумо', 'сумо'],
			muscleGroups: [mg.hamstrings, mg.glutes, mg.adductors, mg.lower_back],
			equipment: [eq.barbell],
		},
		{
			name: 'Румынская тяга',
			aliases: ['румынка', 'RDL', 'тяга на прямых ногах'],
			muscleGroups: [mg.hamstrings, mg.glutes, mg.lower_back],
			equipment: [eq.barbell, eq.dumbbell],
		},
		{
			name: 'Мёртвая тяга',
			aliases: ['мертвая тяга', 'тяга на прямых'],
			muscleGroups: [mg.hamstrings, mg.lower_back],
			equipment: [eq.barbell],
		},
		{
			name: 'Сгибание ног в тренажёре',
			aliases: ['сгибание ног', 'бицепс бедра в тренажёре'],
			muscleGroups: [mg.hamstrings],
			equipment: [eq.machine],
		},

		// Приводящие
		{
			name: 'Приведение ног в тренажёре',
			aliases: ['приводящие', 'аддуктор'],
			muscleGroups: [mg.adductors],
			equipment: [eq.machine],
		},

		// Икры
		{
			name: 'Подъём на носки стоя',
			aliases: ['икры стоя', 'подъём на икры'],
			muscleGroups: [mg.calves],
			equipment: [eq.machine, eq.bodyweight],
		},
		{
			name: 'Подъём на носки сидя',
			aliases: ['икры сидя'],
			muscleGroups: [mg.calves],
			equipment: [eq.machine],
		},

		// Предплечья
		{
			name: 'Сгибания запястий со штангой',
			aliases: ['сгибания запястий', 'запястья'],
			muscleGroups: [mg.forearms],
			equipment: [eq.barbell],
		},
		{
			name: 'Обратные сгибания запястий',
			aliases: ['разгибания запястий'],
			muscleGroups: [mg.forearms],
			equipment: [eq.barbell, eq.dumbbell],
		},

		// Пресс
		{
			name: 'Скручивания',
			aliases: ['пресс', 'кранчи'],
			muscleGroups: [mg.core],
			equipment: [eq.bodyweight],
		},
		{
			name: 'Подъём ног в висе',
			aliases: ['подъём ног на перекладине', 'уголок на турнике'],
			muscleGroups: [mg.core],
			equipment: [eq.pullup_bar],
		},
		{
			name: 'Подъём ног на брусьях',
			aliases: ['уголок на брусьях'],
			muscleGroups: [mg.core],
			equipment: [eq.dip_bar],
		},

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
