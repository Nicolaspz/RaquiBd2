-- AlterEnum
ALTER TYPE "StatusServico" ADD VALUE 'ARQUIVADA';

-- AlterTable
ALTER TABLE "servicos" ADD COLUMN     "numero" INTEGER NOT NULL DEFAULT 0;
