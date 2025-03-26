# Nombre del archivo Makefile: Makefile

# Comando predeterminado que se ejecutará cuando solo se llame `make`
default: help

# Objetivo para agregar, confirmar y enviar cambios a Git
commit:
	@read -p "Enter your commit message: " MESSAGE; \
	git add .; \
	git commit -m "$$MESSAGE"; \
	git push

# Objetivo de ayuda que muestra las opciones disponibles
help:
	@echo "Uso: make <comando>"
	@echo ""
	@echo "Comandos disponibles:"
	@echo "  commit  Agrega, confirma y envía los cambios a Git (requiere ingresar un mensaje de confirmación)"

install:
	npm install -g @nestjs/cli
	npm install --force

run:
	#sudo npm run start:dev
	nest build
	node dist/main.js --host 0.0.0.0

run2:
	#sudo npm run start:dev
	#nest build
	#node dist/main.js --host 0.0.0.0 
	npm run start:dev
migrate:
	npx prisma migrate dev
delete:
	sudo chmod 777 -R prisma/
	rm -R prisma/migrations
	rm prisma/dev.db
pull:
	git pull
.PHONY: help commit install run pull