/**
 *  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

/// !cdk-integ *
import { App, Stack, RemovalPolicy } from "@aws-cdk/core";
import { LambdaToDynamoDB, LambdaToDynamoDBProps } from "../lib";
import * as lambda from '@aws-cdk/aws-lambda';
import * as defaults from '@aws-solutions-constructs/core';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { generateIntegStackName } from '@aws-solutions-constructs/core';

const app = new App();

// Empty arguments
const stack = new Stack(app, generateIntegStackName(__filename));

const testProp = {
  logGroupProps: {
    logGroupName: 'testLogGroup',
    removalPolicy: RemovalPolicy.SNAPSHOT,
    retention: RetentionDays.THREE_DAYS
  }
};

const logGroup = defaults.buildLogGroup(stack, 'test', testProp.logGroupProps);

const props: LambdaToDynamoDBProps = {
  lambdaFunctionProps: {
    code: lambda.Code.fromAsset(`${__dirname}/lambda`),
    runtime: lambda.Runtime.NODEJS_10_X,
    handler: 'index.handler'
  },
  existingLogGroup: logGroup
};

new LambdaToDynamoDB(stack, 'test-lambda-dynamodb-stack', props);
app.synth();