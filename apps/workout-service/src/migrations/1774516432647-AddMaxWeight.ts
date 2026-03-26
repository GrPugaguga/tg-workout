import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaxWeight1774516432647 implements MigrationInterface {
    name = 'AddMaxWeight1774516432647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD "maxWeight" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP COLUMN "maxWeight"`);
    }

}
