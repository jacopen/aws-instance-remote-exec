import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, RemoteBackend } from "cdktf";
import { AwsProvider, ec2 } from "@cdktf/provider-aws";

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AwsProvider(this, "AWS", {
      region: "ap-northeast-1",
    });

    const instance = new ec2.Instance(this, "jacopen-compute", {
      ami: "ami-088da9557aae42f39",
      instanceType: "t2.micro",
    });

    new TerraformOutput(this, "public_ip", {
      value: instance.publicIp,
    });
  }
}

const app = new App();
const stack = new MyStack(app, "aws-instance-remote-exec");

new RemoteBackend(stack, {
  hostname: "app.terraform.io",
  organization: "kusama",
  workspaces: {
    name: "aws-instance-remote-exec",
  },
});

app.synth();
