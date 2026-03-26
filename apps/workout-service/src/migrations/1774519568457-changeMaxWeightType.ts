import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeMaxWeightType1774519568457 implements MigrationInterface {
    name = 'ChangeMaxWeightType1774519568457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP COLUMN "maxWeight"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD "maxWeight" numeric(6,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP COLUMN "maxWeight"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD "maxWeight" integer`);
    }

}
