# ----------------------------------- base ----------------------------------- #
FROM node:16 as base

ENV WORKDIR=/usr/home
WORKDIR ${WORKDIR}

RUN mkdir -p modules/lib && \
  mkdir -p modules/test

COPY ./package.json ./
COPY ./tsconfig.json ./
COPY ./yarn.lock ./
COPY ./lerna.json ./

COPY ./modules/lib/types ./modules/lib/types
COPY ./modules/test/types ./modules/test/types

# --------------------------------- module-a --------------------------------- #

FROM base as module-a

# copy lib module
COPY ./modules/lib/core ./modules/lib/core
COPY ./modules/lib/jest ./modules/lib/jest
COPY ./modules/lib/module-a ./modules/lib/module-a

# copy test module
COPY ./modules/test/module-a ./modules/test/module-a

RUN yarn && \
  yarn validate && \
  rm -rf dist && \
  yarn install --prod

CMD [ "yarn", "test" ]

# --------------------------------- module-b --------------------------------- #

FROM base as module-b

# copy lib module
COPY ./modules/lib/core ./modules/lib/core
COPY ./modules/lib/jest ./modules/lib/jest
COPY ./modules/lib/module-b ./modules/lib/module-b

# copy test module
COPY ./modules/test/module-b ./modules/test/module-b

RUN yarn && \
  yarn validate && \
  rm -rf dist && \
  yarn install --prod

CMD [ "yarn", "test" ]
