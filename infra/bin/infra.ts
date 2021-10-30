#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { InfraStack as BlogInfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new BlogInfraStack(app, 'BlogInfraStack', {
    env: {
        account: '834067345082',
        region: 'eu-central-1',
    },
    domainName: "coel.link",
    siteSubDomain: "blog"
});

