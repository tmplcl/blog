#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { InfraStack as BlogInfraStack } from '../lib/infra-stack';

const app = new cdk.App();
new BlogInfraStack(app, 'BlogInfraStack', {
    env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION,
    },
    domainName: "coel.link",
    siteSubDomain: "blog"
});

