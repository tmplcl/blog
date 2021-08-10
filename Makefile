all: clean build diff

clean:
	rm -rf myblog/public

build:
	cd myblog && hugo ; cd -

diff:
	cd infra && cdk diff ; cd -

deploy:
	cd infra && cdk deploy ; cd -

local:
	cd myblog && hugo server -w ; cd -

.PHONY: all clean build diff deploy