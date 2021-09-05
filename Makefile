all: clean build diff

clean:
	rm -rf myblog/public

build:
	cd myblog && hugo ; cd -

diff:
	cd infra && cdk --profile private diff ; cd -

deploy:
	cd infra && cdk --profile private deploy ; cd -

local:
	cd myblog && hugo server -w ; cd -

.PHONY: all clean build diff deploy