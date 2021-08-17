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

import { DefaultLogGroupProps } from './cloudwatch-log-group-defaults';
import * as logs from '@aws-cdk/aws-logs';
import { overrideProps, addCfnSuppressRules } from './utils';
import { Construct } from '@aws-cdk/core';

export function buildLogGroup(scope: Construct, logGroupId?: string, logGroupProps?: logs.LogGroupProps,
  existingLogGroup?: logs.LogGroup): logs.LogGroup {
  if (existingLogGroup) {
    return existingLogGroup;
  }

  let _logGroupProps: logs.LogGroupProps;

  // Override user provided CW LogGroup props with the DefaultLogGroupProps
  if (logGroupProps !== undefined) {
    _logGroupProps = overrideProps(DefaultLogGroupProps(), logGroupProps);
  } else {
    _logGroupProps = DefaultLogGroupProps();
  }

  // Set the LogGroup Id
  const _logGroupId = logGroupId ? logGroupId : 'CloudWatchLogGroup';

  // Create the CW Log Group
  const logGroup = new logs.LogGroup(scope, _logGroupId, _logGroupProps);

  // If required, suppress the Cfn Nag WARNINGS
  if (_logGroupProps.retention === logs.RetentionDays.INFINITE) {
    addCfnSuppressRules( logGroup, [
      {
        id: 'W86',
        reason: 'Retention period for CloudWatchLogs LogGroups are set to \'Never Expire\' to preserve customer data indefinitely'
      }
    ]);
  }

  if (!_logGroupProps.encryptionKey) {
    addCfnSuppressRules( logGroup, [
      {
        id: 'W84',
        reason: 'By default CloudWatchLogs LogGroups data is encrypted using the CloudWatch server-side encryption keys (AWS Managed Keys)'
      }
    ]);
  }

  return logGroup;
}