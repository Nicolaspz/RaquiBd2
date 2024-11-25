/*
  Warnings:

  - The values [ENTREGA,MOTORISTA_PESSOAL] on the enum `TipoServico` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';

-- AlterEnum
BEGIN;
CREATE TYPE "TipoServico_new" AS ENUM ('SERVICO_ENTREGA', 'SERVICO_PESSOAL', 'SERVICO_24h', 'SERVICO_30_DIAS');
ALTER TABLE "servicos" ALTER COLUMN "tipo" TYPE "TipoServico_new" USING ("tipo"::text::"TipoServico_new");
ALTER TYPE "TipoServico" RENAME TO "TipoServico_old";
ALTER TYPE "TipoServico_new" RENAME TO "TipoServico";
DROP TYPE "TipoServico_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "morada" DROP NOT NULL;
