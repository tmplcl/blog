all: clean build diff

clean:
	rm -rf myblog/public myblog/resources

build:
	cd myblog && hugo --minify ; cd -

diff:
	cd infra && cdk --profile private diff ; cd -

deploy:
	cd infra && cdk --profile private deploy ; cd -

local:
	cd myblog && docker run --rm -it -v $(pwd):/src -p 1313:1313 klakegg/hugo:0.89.4-ext-ubuntu-onbuild server ; cd -

.PHONY: all clean build diff deploy