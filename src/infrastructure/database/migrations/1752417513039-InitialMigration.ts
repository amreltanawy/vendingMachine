import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1752417513039 implements MigrationInterface {
    name = 'InitialMigration1752417513039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('buyer', 'seller')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL, "username" character varying NOT NULL, "deposit" integer NOT NULL DEFAULT '0', "role" "public"."user_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "credentials" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "passwordHash" character varying(255) NOT NULL, "salt" character varying(255) NOT NULL, "passwordChangedAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8d3a07b8e994962efe57ebd0f20" UNIQUE ("userId"), CONSTRAINT "REL_8d3a07b8e994962efe57ebd0f2" UNIQUE ("userId"), CONSTRAINT "PK_1e38bc43be6697cdda548ad27a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "cost" integer NOT NULL, "amountAvailable" integer NOT NULL, "sellerId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22cc43e9a74d7498546e9a63e7" ON "product" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d5cac481d22dacaf4d53f900a3" ON "product" ("sellerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b141a49d55ccb272172107f133" ON "product" ("name", "sellerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_91c1e68131788d5e07c72ced81" ON "product" ("sellerId", "createdAt") `);
        await queryRunner.query(`CREATE TYPE "public"."product_event_eventtype_enum" AS ENUM('top_up', 'withdraw')`);
        await queryRunner.query(`CREATE TABLE "product_event" ("id" uuid NOT NULL, "productId" uuid NOT NULL, "eventType" "public"."product_event_eventtype_enum" NOT NULL, "quantity" integer NOT NULL, "unitPrice" integer NOT NULL, "totalValue" integer NOT NULL, "createdBy" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "description" text NOT NULL, "metadata" json, CONSTRAINT "PK_e96757f72afe00f2ed8b4ecc770" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7f75dbee1d01e934c4c73fb720" ON "product_event" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_64fc7fdc6939861191c74b2abd" ON "product_event" ("createdBy") `);
        await queryRunner.query(`CREATE INDEX "IDX_db616a31fdb7fe54175b3d107b" ON "product_event" ("createdBy", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_5856fb0b620917c9b455512f01" ON "product_event" ("eventType", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_150cea6ac74f7207177db1d377" ON "product_event" ("productId", "createdAt") `);
        await queryRunner.query(`ALTER TABLE "credentials" ADD CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credentials" DROP CONSTRAINT "FK_8d3a07b8e994962efe57ebd0f20"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_150cea6ac74f7207177db1d377"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5856fb0b620917c9b455512f01"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db616a31fdb7fe54175b3d107b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64fc7fdc6939861191c74b2abd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7f75dbee1d01e934c4c73fb720"`);
        await queryRunner.query(`DROP TABLE "product_event"`);
        await queryRunner.query(`DROP TYPE "public"."product_event_eventtype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91c1e68131788d5e07c72ced81"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b141a49d55ccb272172107f133"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d5cac481d22dacaf4d53f900a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22cc43e9a74d7498546e9a63e7"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "credentials"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
