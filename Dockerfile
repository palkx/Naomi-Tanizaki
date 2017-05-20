FROM node:7-alpine

LABEL maintainer "iSm1le <sm1leua@ya.ru>"

# Add package.json for Yarn
WORKDIR /usr/src/iSm1le
COPY package.json yarn.lock ./

#  Install dependencies
RUN apk add --update \
&& apk add --no-cache git ffmpeg opus pixman cairo pango giflib ca-certificates \
&& apk add --no-cache --virtual .build-deps build-essential libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev libtool autoconf automake curl pixman-dev cairo-dev pangomm-dev libjpeg-turbo-dev giflib-dev python g++ make \
\
# Install node.js dependencies
&& yarn global add node-gyp \
&& yarn install \
\
# Clean up build dependencies
&& apk del .build-deps

# Add project source
COPY . .

ENV TOKEN= \
	COMMAND_PREFIX= \
	COMMANDO_VERSION= \
	OAUTH_LINK= \
	OSU_API_KEY= \
	CLEVERBOT_API_USER= \
	CLEVERBOT_API_KEY= \
	ANILIST_ID= \
	ANILIST_SECRET= \
	SHIKIMORI_API_KEY= \
	PERMITTED_GROUP= \
	OWNERS= \
	DB= \
	REDIS= \
	EXAMPLE_CHANNEL= \
	ISSUE_CHANNEL= \
	REQUEST_CHANNEL= \
	WEATHER_API= \
	GOOGLE_API= \
	GOOGLE_CUSTOM_SEARCH= \
	GOOGLE_CUSTOM_SEARCH_CX= \
	SOUNDCLOUD_API= \
	SHERLOCK_API= \
	PAGINATED_ITEMS= \
	DEFAULT_VOLUME= \
	MAX_LENGTH= \
	MAX_SONGS= \
	PASSES=

CMD ["node", "bot.js"]