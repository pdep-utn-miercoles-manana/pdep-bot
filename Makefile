test-docker:
	@docker-compose -f docker/test-docker-compose.yml up -d mongo haskell
	@docker-compose -f docker/test-docker-compose.yml up node
	@docker-compose -f docker/test-docker-compose.yml kill
