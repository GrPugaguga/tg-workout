import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteWorkoutEx1774519862273 implements MigrationInterface {
    name = 'AddCascadeDeleteWorkoutEx1774519862273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workout_exercises" DROP CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754"`);
        await queryRunner.query(`ALTER TABLE "workout_exercises" ADD CONSTRAINT "FK_d616bcfffe0b6bb322281ae3754" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
