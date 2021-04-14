test-docker:
	$(MAKE) test-docker-build
	$(MAKE) test-docker-run

test-docker-run:
	@docker-compose -f docker/test-docker-compose.yml up -d mongo haskell
	@docker-compose -f docker/test-docker-compose.yml up node
	@docker-compose -f docker/test-docker-compose.yml kill

test-docker-build:
	@docker-compose -f docker/test-docker-compose.yml build
