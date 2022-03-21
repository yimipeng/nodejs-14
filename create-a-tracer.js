// OTel JS - API
const { trace } = require('@opentelemetry/api');

// OTel JS - Core
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');

// OTel JS - Core - Exporters
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector-grpc');

// OTel JS - Core - Instrumentations
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { AwsInstrumentation } = require('opentelemetry-instrumentation-aws-sdk');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')

// OTel JS - Contrib - AWS X-Ray
const { AWSXRayIdGenerator } = require('@opentelemetry/id-generator-aws-xray');
const { AWSXRayPropagator } = require('@opentelemetry/propagator-aws-xray');


module.exports = (serviceName) => {
  // create a provider using the AWS ID Generator
  const tracerConfig = {
    idGenerator: new AWSXRayIdGenerator(),
    // any instrumentations can be declared here
    instrumentations: [],
    // any resources can be declared here
    resources: {},
  };

  const tracerProvider = new NodeTracerProvider(tracerConfig);

  // add OTLP exporter
  const otlpExporter = new OTLPTraceExporter({
    serviceName: "node-simple-app",
    // port configured in the Collector config, defaults to 4317
    url: "localhost:4317"
    // credentials only required if tls setup on Collector instance
  });
  tracerProvider.addSpanProcessor(new BatchSpanProcessor(otlpExporter));

  // Register the tracer provider with an X-Ray propagator
  tracerProvider.register({
    propagator: new AWSXRayPropagator()
  });

  // Return an tracer instance
  return trace.getTracer("node-simple-test");
}
