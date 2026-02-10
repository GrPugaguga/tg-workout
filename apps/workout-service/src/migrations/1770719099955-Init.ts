import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1770719099955 implements MigrationInterface {
	name = 'Init1770719099955'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "equipment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "aliases" text array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_b44a87bec78c8cf13f5bb838577" UNIQUE ("name"), CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "muscle_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "aliases" text array NOT NULL DEFAULT '{}', CONSTRAINT "UQ_7b67dd7f791008ed1532e76a9c4" UNIQUE ("name"), CONSTRAINT "PK_87e03ee9f78be5d7a7d0e08897e" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "exercises" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "aliases" text array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a521b5cac5648eedc036e17d1bd" UNIQUE ("name"), CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "workout_sets" ("id" SERIAL NOT NULL, "setNumber" integer NOT NULL, "weight" numeric(6,2) NOT NULL, "sets" integer NOT NULL DEFAULT '1', "reps" integer NOT NULL, "workoutExerciseId" integer, CONSTRAINT "UQ_c45e02db545d8de1079e792ca76" UNIQUE ("workoutExerciseId", "setNumber"), CONSTRAINT "PK_5ad75c97e58e8c660a48926d438" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "workout_exercises" ("id" SERIAL NOT NULL, "orderIndex" integer NOT NULL, "notes" character varying, "workoutId" uuid, "exerciseId" uuid, "equipmentId" uuid, CONSTRAINT "PK_377f9ead6fd69b29f0d0feb1028" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "workouts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "date" date NOT NULL, "notes" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5b2319bf64a674d40237dbb1697" PRIMARY KEY ("id"))`
		)
		await queryRunner.query(
			`CREATE TABLE "exercises_muscle_groups_muscle_groups" ("exercisesId" uuid NOT NULL, "muscleGroupsId" uuid NOT NULL, CONSTRAINT "PK_5e7b5a995af77415dfa9f5074a8" PRIMARY KEY ("exercisesId", "muscleGroupsId"))`
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_1cd9cda68424ae541889439a93" ON "exercises_muscle_groups_muscle_groups" ("exercisesId") `
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_f04ae7b9ad9841037f95d48a42" ON "exercises_muscle_groups_muscle_groups" ("muscleGroupsId") `
		)
		await queryRunner.query(
			`CREATE TABLE "exercises_equipment_equipment" ("exercisesId" uuid NOT NULL, "equipmentId" uuid NOT NULL, CONSTRAINT "PK_68ff7ffaf10ddaee18299b40fad" PRIMARY KEY ("exercisesId", "equipmentId"))`
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_dbc9d42686de073c103432c0c5" ON "exercises_equipment_equipment" ("exercisesId") `
		)
		await queryRunner.query(
			`CREATE INDEX "IDX_1e026e8623c9128a6f3ac14551" ON "exercises_equipment_equipment" ("equipmentId") `
		)
		await queryRunner.query(
			`ALTER TABLE "workout_sets" ADD CONSTRAINT "FK_5b4de620970471d3efe408b8e81" FOREIGN KEY ("workoutExerciseId") REFERENCES "workout_exercises"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_1222e38fcd49c77d6ae78c6b073" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_942e5800ce7d6957da3ecfef4fc" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		)
		await queryRunner.query(
			`ALTER TABLE "exercises_muscle_groups_muscle_groups" ADD CONSTRAINT "FK_1cd9cda68424ae541889439a937" FOREIGN KEY ("exercisesId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE`
		)
		await queryRunner.query(
			`ALTER TABLE "exercises_muscle_groups_muscle_groups" ADD CONSTRAINT "FK_f04ae7b9ad9841037f95d48a42f" FOREIGN KEY ("muscleGroupsId") REFERENCES "muscle_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`
		)
		await queryRunner.query(
			`ALTER TABLE "exercises_equipment_equipment" ADD CONSTRAINT "FK_dbc9d42686de073c103432c0c5e" FOREIGN KEY ("exercisesId") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE`
		)
		await queryRunner.query(
			`ALTER TABLE "exercises_equipment_equipment" ADD CONSTRAINT "FK_1e026e8623c9128a6f3ac145515" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE`
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "exercises_equipment_equipment" DROP CONSTRAINT "FK_1e026e8623c9128a6f3ac145515"`
		)
		await queryRunner.query(
			`ALTER TABLE "exercises_equipment_equipment" DROP CONSTRAINT "FK_dbc9d42686de073c103432c0c5e"`
		)
		await queryRunner.query(
			`ALTER TABLE "exercises_muscle_groups_muscle_groups" DROP CONSTRAINT "FK_f04ae7b9ad9841037f95d48a42f"`
		)
		await queryRunner.query(
			`ALTER TABLE "exercises_muscle_groups_muscle_groups" DROP CONSTRAINT "FK_1cd9cda68424ae541889439a937"`
		)
		await queryRunner.query(
			`ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_942e5800ce7d6957da3ecfef4fc"`
		)
		await queryRunner.query(
			`ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_1222e38fcd49c77d6ae78c6b073"`
		)
		await queryRunner.query(
			`ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754"`
		)
		await queryRunner.query(
			`ALTER TABLE "workout_sets" DROP CONSTRAINT "FK_5b4de620970471d3efe408b8e81"`
		)
		await queryRunner.query(
			`DROP INDEX "public"."IDX_1e026e8623c9128a6f3ac14551"`
		)
		await queryRunner.query(
			`DROP INDEX "public"."IDX_dbc9d42686de073c103432c0c5"`
		)
		await queryRunner.query(`DROP TABLE "exercises_equipment_equipment"`)
		await queryRunner.query(
			`DROP INDEX "public"."IDX_f04ae7b9ad9841037f95d48a42"`
		)
		await queryRunner.query(
			`DROP INDEX "public"."IDX_1cd9cda68424ae541889439a93"`
		)
		await queryRunner.query(
			`DROP TABLE "exercises_muscle_groups_muscle_groups"`
		)
		await queryRunner.query(`DROP TABLE "workouts"`)
		await queryRunner.query(`DROP TABLE "workout_exercises"`)
		await queryRunner.query(`DROP TABLE "workout_sets"`)
		await queryRunner.query(`DROP TABLE "exercises"`)
		await queryRunner.query(`DROP TABLE "muscle_groups"`)
		await queryRunner.query(`DROP TABLE "equipment"`)
	}
}
