import { CLIENTS, EXERCISE_PATTERNS } from '@app/contracts'
import { exerciseCollection, ExerciseDocument } from '@app/typesense'
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
			this.logger.log('Typesense collection created')
		} catch {
			this.logger.log('Typesense collection already exists')
		}

		const exercises = await firstValueFrom(
			this.client.send<ExerciseDocument[]>(EXERCISE_PATTERNS.GET_ALL, {}),
		)
		await this.fullSync(exercises)
	}

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
}
