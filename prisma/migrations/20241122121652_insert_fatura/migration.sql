-- CreateEnum
CREATE TYPE "StatusFatura" AS ENUM ('ABERTA', 'PAGA', 'CANCELADA');

-- AlterTable
ALTER TABLE "servicos" ADD COLUMN     "faturaId" TEXT;

-- CreateTable
CREATE TABLE "Fatura" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "status" "StatusFatura" NOT NULL DEFAULT 'ABERTA',

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fatura_numero_key" ON "Fatura"("numero");

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_faturaId_fkey" FOREIGN KEY ("faturaId") REFERENCES "Fatura"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
