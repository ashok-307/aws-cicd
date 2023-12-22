import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeLine = new CodePipeline(this, 'AwesomePipeline', {
      pipelineName: 'AwesomePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('ashok-307/aws-cicd', 'cicd-practice'),
        commands: [
          'cd cdk-cicd',
          'npm ci',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cdk-cicd/cdk.out'
      })
    });

    const testStage = pipeLine.addStage(new PipelineStage(this, 'PipelineTestStage', {
      stageName: 'test'
    }));

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkCicdQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
