# ----------------------------------- base ----------------------------------- #
FROM node:16-slim as base

ENV WORKDIR=/usr/home
WORKDIR ${WORKDIR}

RUN mkdir -p modules/lib && \
  mkdir -p modules/test

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./yarn.lock ./
COPY ./.yarnrc.yml ./
COPY ./.yarn ./.yarn

# --------------------------------- module-a --------------------------------- #

FROM base as module-a

# copy lib module
COPY ./modules/lib/core ./modules/lib/core
COPY ./modules/lib/module-a ./modules/lib/module-a

# copy test module
COPY ./modules/test/module-a ./modules/test/module-a

RUN yarn && \
  yarn validate && \
  rm -rf dist

CMD [ "yarn", "test" ]

# --------------------------------- module-b --------------------------------- #

FROM base as module-b

# copy lib module
COPY ./modules/lib/core ./modules/lib/core
COPY ./modules/lib/module-b ./modules/lib/module-b

# copy test module
COPY ./modules/test/module-b ./modules/test/module-b

RUN yarn && \
  yarn validate && \
  rm -rf dist

CMD [ "yarn", "test" ]
