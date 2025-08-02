# Changelog
Project's github: https://github.com/msoehnchen/ha-addons/tree/main/hollistic-todo
Project's Container Repo: https://hub.docker.com/r/msoehnchen/hollistic-todo

## [0.1.5] - 2025-07-30

### Fixed (DEV)

- use /data if available, otherwise /data_local

## [0.1.3] - 2025-07-30

### Fixed (DEV)

- docker_build script, now using version from config.yaml

## [0.1.2] - 2025-07-30

### Added (APP)

- basic application (in development)

### Fixed (DEV)

- image: removed local node-modules via .dockerignore
- image: used npm install 

### Changed (APP)

- base image bumped to node:24-alpine3.22

### Removed (DEV)

- rebuild sqlite from source, as that blows up the image-size

### Docker Hub Container

- msoehnchen/hollistic-todo:0.1.2 [@msoehnchen](https://hub.docker.com/r/msoehnchen/hollistic-todo).
