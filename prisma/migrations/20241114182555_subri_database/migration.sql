-- CreateEnum
CREATE TYPE "TipoServico" AS ENUM ('ENTREGA', 'MOTORISTA_PESSOAL');

-- CreateEnum
CREATE TYPE "StatusServico" AS ENUM ('PENDENTE', 'ACEITO', 'EM_ANDAMENTO', 'CONCLUIDO');

-- CreateEnum
CREATE TYPE "TipoPagamento" AS ENUM ('CONTA_3DIAS', 'CONTA_7DIAS', 'CONTA_15DIAS', 'CONTA_30DIAS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "tipo" "TipoServico" NOT NULL,
    "status" "StatusServico" NOT NULL DEFAULT 'PENDENTE',
    "descricao" TEXT,
    "data_solicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_atualizacao" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interacoes" (
    "id" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "interacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "proces_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "morada" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "redes" TEXT NOT NULL,
    "tipo_pagamento" "TipoPagamento" NOT NULL,
    "telefone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_proces_number_key" ON "users"("proces_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_telefone_key" ON "users"("telefone");

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interacoes" ADD CONSTRAINT "interacoes_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "servicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
