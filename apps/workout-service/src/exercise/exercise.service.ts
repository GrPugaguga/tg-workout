import { CLIENTS, EXERCISE_PATTERNS } from '@app/contracts'
import type { ExerciseDocument } from '@app/typesense'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { CreateExerciseInput } from './dto/create-exercise.input'
import { UpdateExerciseInput } from './dto/update-exercise.input'
import { Equipment } from './entities/equipment.entity'
import { Exercise } from './entities/exercise.entity'
import { MuscleGroup } from './entities/muscle-group.entity'
import { ExerciseRepositoryPort } from './repository/exercise.repository.abstract'

@Injectable()
export class ExerciseService {
	constructor(
		private readonly exerciseRepository: ExerciseRepositoryPort,
		@InjectRepository(MuscleGroup) private readonly muscleGroupRepo: Repository<MuscleGroup>,
		@InjectRepository(Equipment) private readonly equipmentRepo: Repository<Equipment>,
		@Inject(CLIENTS.SYNC_SERVICE) private readonly syncClient: ClientProxy,
	) {}

	async findById(id: string): Promise<Exercise> {
		const exercise = await this.exerciseRepository.findById(id)
		if (!exercise)
			throw new NotFoundException(`Exercise with id ${id} not found`)
		return exercise
	}

	async findAll(): Promise<Exercise[]> {
		return this.exerciseRepository.findAll()
	}

	async search(query: string): Promise<Exercise[]> {
		return this.exerciseRepository.search(query)
	}

	async findAllMuscleGroups(): Promise<MuscleGroup[]> {
		return this.muscleGroupRepo.find()
	}

	async findAllEquipment(): Promise<Equipment[]> {
		return this.equipmentRepo.find()
	}

	async create(input: CreateExerciseInput): Promise<Exercise> {
		const muscleGroups = await this.muscleGroupRepo.findBy({ id: In(input.muscleGroupIds) })
		const equipment = await this.equipmentRepo.findBy({ id: In(input.equipmentIds) })

		const exercise = new Exercise()
		exercise.name = input.name
		exercise.description = input.description
		exercise.aliases = input.aliases ?? []
		exercise.muscleGroups = muscleGroups
		exercise.equipment = equipment

		const saved = await this.exerciseRepository.save(exercise)
		this.syncClient.emit(EXERCISE_PATTERNS.CREATED, [this.toDocument(saved)])
		return saved
	}

	async update(input: UpdateExerciseInput): Promise<Exercise> {
		const exercise = await this.findById(input.id)

		if (input.name !== undefined) exercise.name = input.name
		if (input.description !== undefined) exercise.description = input.description
		if (input.aliases !== undefined) exercise.aliases = input.aliases
		if (input.muscleGroupIds !== undefined)
			exercise.muscleGroups = await this.muscleGroupRepo.findBy({ id: In(input.muscleGroupIds) })
		if (input.equipmentIds !== undefined)
			exercise.equipment = await this.equipmentRepo.findBy({ id: In(input.equipmentIds) })

		const saved = await this.exerciseRepository.save(exercise)
		this.syncClient.emit(EXERCISE_PATTERNS.UPDATED, [this.toDocument(saved)])
		return saved
	}

	async delete(id: string): Promise<string> {
		await this.findById(id)
		await this.exerciseRepository.delete(id)
		this.syncClient.emit(EXERCISE_PATTERNS.DELETED, [id])
		return id
	}

	private toDocument(exercise: Exercise): ExerciseDocument {
		return {
			id: exercise.id,
			name: exercise.name,
			description: exercise.description,
			aliases: exercise.aliases ?? [],
			muscleGroups: exercise.muscleGroups.map(mg => mg.name),
			equipment: exercise.equipment.map(eq => eq.name),
		}
	}
}
