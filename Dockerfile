# ----------------------------------- base ----------------------------------- #
FROM node:16 as base

ENV WORKDIR=/usr/home
WORKDIR ${WORKDIR}

# ----------------------------------- build ---------------------------------- #
FROM base as package

COPY . .

RUN yarn

# ------------------------------ module-a-build ------------------------------ #
FROM package as module-a-build

RUN yarn lerna run build --scope @jest-modules-test-template/module-a

# ----------------------------- module-a-package ----------------------------- #
FROM base as module-a

COPY --from=module-a-build ${WORKDIR}/node_modules ./node_modules
COPY --from=module-a-build ${WORKDIR}/dist/core ./dist/core
COPY --from=module-a-build ${WORKDIR}/dist/module-a ./dist/module-a
COPY ./modules/module-a/package.json ./
COPY ./modules/module-a/jest.config.ts ./

CMD [ "yarn", "test" ]

# ------------------------------ module-b-build ------------------------------ #
FROM package as module-b-build

RUN yarn lerna run build --scope @jest-modules-test-template/module-b

# ----------------------------- module-b-package ----------------------------- #
FROM base as module-b

COPY --from=module-b-build ${WORKDIR}/node_modules ./node_modules
COPY --from=module-b-build ${WORKDIR}/dist/core ./dist/core
COPY --from=module-b-build ${WORKDIR}/dist/module-b ./dist/module-b
COPY ./modules/module-b/package.json ./
COPY ./modules/module-b/jest.config.ts ./

CMD [ "yarn", "test" ]
