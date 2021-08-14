#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { InfraStack as BlogInfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new BlogInfraStack(app, 'BlogInfraStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
    domainName: "coel.link",
    siteSubDomain: "blog",
    useCloudFront: true
});

