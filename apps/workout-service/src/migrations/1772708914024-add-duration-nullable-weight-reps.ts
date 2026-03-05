import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDurationNullableWeightReps1772708914024 implements MigrationInterface {
    name = 'AddDurationNullableWeightReps1772708914024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_sets" ADD "duration" integer`);
        await queryRunner.query(`ALTER TABLE "workout_sets" ALTER COLUMN "weight" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workout_sets" ALTER COLUMN "reps" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_sets" ALTER COLUMN "reps" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workout_sets" ALTER COLUMN "weight" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "workout_sets" DROP COLUMN "duration"`);
    }

}
