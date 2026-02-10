import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity({ name: 'muscle_groups' })
export class MuscleGroup {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id!: string

	@Field()
	@Column({ unique: true })
	name!: string

	@Field(() => [String])
	@Column('text', { array: true, default: '{}' })
	aliases!: string[]
}
