import { Util } from "./src/util"
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: '${self:custom.pApp}-${self:custom.pEnvironment}-${self:custom.regions.${self:custom.pRegion}}-fn-${self:custom.pFunction}',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    pApp: "sipm",
    pFunction: "project",
    pEnvironment: '${opt:stage, self:provider.stage}',
    pRegion: '${opt:region, "us-east-1"}',
    pAccountId: '${ssm:/${self:custom.pApp}/${self:provider.stage}/${self:custom.regions.${self:custom.pRegion}}/ps/accountId}',
    regions: {
      "us-west-2": "usw2a",
      "us-east-1": "use1b"
    }
  },
  plugins: ['serverless-offline', 'serverless-webpack', 'serverless-plugin-tracing', 'serverless-prune-plugin', 'serverless-plugin-log-retention'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
    logRetentionInDays: 30,
    tracing: {
      apiGateway: true,
      lambda: true
    },
    deploymentBucket: {
      name: '${ssm:/${self:custom.pApp}/${self:custom.pFunction}/${self:provider.stage}/${self:custom.regions.${self:custom.pRegion}}/ps/deploymentBucket}',
      serverSideEncryption: "AES256"
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'ssm:*'
            ],
            Resource: "*"
          },
          {
            Effect: 'Allow',
            Action: [
              'xray:PutTraceSegments',
              'xray:PutTelemetryRecords',
            ],
            Resource: "*"
          },
          {
            Effect: 'Allow',
            Action: [
              'kms:Decrypt'
            ],
            Resource: "*"
          },
          {
            Effect: 'Allow',
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
              "dynamodb:BatchGetItem",
              "dynamodb:BatchWriteItem"
            ],
            Resource: ["arn:aws:dynamodb:${opt:region}:${self:custom.pAccountId}:table/${self:custom.pApp}-${self:custom.pEnvironment}-${self:custom.regions.${self:custom.pRegion}}-db-Organization",
              "arn:aws:dynamodb:${opt:region}:${self:custom.pAccountId}:table/${self:custom.pApp}-${self:custom.pEnvironment}-${self:custom.regions.${self:custom.pRegion}}-db-Master",
              "arn:aws:dynamodb:${opt:region}:${self:custom.pAccountId}:table/${self:custom.pApp}-${self:custom.pEnvironment}-${self:custom.regions.${self:custom.pRegion}}-db-MaxIdValue"]
          }
        ]
      }
    }
  },




  functions: {
    masterModule: {
      handler: `${Util.handlerPath(__dirname + "/src")}/handler.main`,
      name: '${self:service}',
      tracing: true,
      environment:
      {
        LOGGER_LEVEL: '${ssm:/${self:custom.pApp}/${self:custom.pFunction}/${self:provider.stage}/${self:custom.regions.${self:custom.pRegion}}/ps/loggerLevel}',
        REGION: '${self:custom.pRegion}',
        SHORT_REGION: '${self:custom.regions.${self:custom.pRegion}}',
        APP_ENVIRONMENT: '${self:provider.stage}',
      }
      ,
      events: [
        {
          http: {
            method: 'any',
            path: 'master/{entity}'
          }
        }
      ]
    }
  }
};

module.exports = serverlessConfiguration;
