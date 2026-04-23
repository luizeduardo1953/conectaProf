# ============================================================
# Makefile — Atalhos do projeto ConectaProf
# ============================================================
# Uso: make <comando>
# Exemplo: make dev
#
# No Windows, instale o Make via Chocolatey:
#   choco install make
# Ou use o Git Bash que já inclui o make.
# ============================================================

.PHONY: help dev db db-down db-reset full full-down seed logs

## Mostra esta ajuda
help:
	@echo ""
	@echo "  ConectaProf — Comandos disponíveis:"
	@echo ""
	@echo "  make db          Sobe apenas o PostgreSQL no Docker"
	@echo "  make db-down     Para o PostgreSQL"
	@echo "  make db-reset    Apaga e recria o banco (CUIDADO: perde dados)"
	@echo ""
	@echo "  make full        Sobe tudo no Docker (backend + frontend + db)"
	@echo "  make full-down   Para tudo"
	@echo ""
	@echo "  make seed        Roda o seed do banco"
	@echo "  make logs        Mostra logs do docker-compose.full.yml"
	@echo ""

## Sobe apenas o banco (modo recomendado para dev)
db:
	docker compose up -d
	@echo ""
	@echo "✅ PostgreSQL rodando em localhost:5433"
	@echo ""
	@echo "Agora abra dois terminais:"
	@echo "  cd backend  && npm run start:dev"
	@echo "  cd frontend && npm run dev"
	@echo ""

## Para o banco
db-down:
	docker compose down

## Apaga o volume e recria o banco (reset total)
db-reset:
	docker compose down -v
	docker compose up -d

## Sobe tudo no Docker com hot reload
full:
	docker compose -f docker-compose.full.yml up --build

## Para tudo
full-down:
	docker compose -f docker-compose.full.yml down

## Roda seed (requer banco ativo)
seed:
	cd backend && npm run seed

## Mostra logs da stack completa
logs:
	docker compose -f docker-compose.full.yml logs -f
