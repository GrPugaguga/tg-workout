import { CLIENTS, EXERCISE_PATTERNS, EQUIPMENT_PATTERNS } from '@app/contracts'
import { exerciseCollection, ExerciseDocument, equipmentCollection, EquipmentDocument } from '@app/typesense'
import { Inject, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class SyncServiceService implements OnApplicationBootstrap {
	private readonly logger = new Logger(SyncServiceService.name)

	constructor(@Inject(CLIENTS.WORKOUT_SERVICE) private readonly client: ClientProxy) {}

	async onApplicationBootstrap() {
		try {
			await exerciseCollection.create()
			this.logger.log('Exercises collection created')
		} catch {
			this.logger.log('Exercises collection already exists')
		}

		try {
			await equipmentCollection.create()
			this.logger.log('Equipment collection created')
		} catch {
			this.logger.log('Equipment collection already exists')
		}

		const exercises = await firstValueFrom(
			this.client.send<ExerciseDocument[]>(EXERCISE_PATTERNS.GET_ALL, {}),
		)
		await this.fullSync(exercises)

		const equipment = await firstValueFrom(
			this.client.send<EquipmentDocument[]>(EQUIPMENT_PATTERNS.GET_ALL, {}),
		)
		await this.fullSyncEquipment(equipment)
	}

	// --- Exercise sync ---

	async fullSync(exercises: ExerciseDocument[]): Promise<void> {
		await exerciseCollection.documents.import(exercises, { action: 'upsert' })
		this.logger.log(`Full sync: indexed ${exercises.length} exercises`)
	}

	async create(exercises: ExerciseDocument[]): Promise<void> {
		await exerciseCollection.documents.import(exercises, { action: 'create' })
		this.logger.log(`Created ${exercises.length} exercises`)
	}

	async update(exercises: ExerciseDocument[]): Promise<void> {
		await exerciseCollection.documents.import(exercises, { action: 'update' })
		this.logger.log(`Updated ${exercises.length} exercises`)
	}

	async delete(ids: string[]): Promise<void> {
		await Promise.all(ids.map(id => exerciseCollection.documents.delete({ documentId: id })))
		this.logger.log(`Deleted ${ids.length} exercises`)
	}

	// --- Equipment sync ---

	async fullSyncEquipment(equipment: EquipmentDocument[]): Promise<void> {
		await equipmentCollection.documents.import(equipment, { action: 'upsert' })
		this.logger.log(`Full sync: indexed ${equipment.length} equipment`)
	}

	async createEquipment(equipment: EquipmentDocument[]): Promise<void> {
		await equipmentCollection.documents.import(equipment, { action: 'create' })
		this.logger.log(`Created ${equipment.length} equipment`)
	}

	async updateEquipment(equipment: EquipmentDocument[]): Promise<void> {
		await equipmentCollection.documents.import(equipment, { action: 'update' })
		this.logger.log(`Updated ${equipment.length} equipment`)
	}

	async deleteEquipment(ids: string[]): Promise<void> {
		await Promise.all(ids.map(id => equipmentCollection.documents.delete({ documentId: id })))
		this.logger.log(`Deleted ${ids.length} equipment`)
	}
}
