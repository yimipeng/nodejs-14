const { BatchSpanProcessor } = require("@opentelemetry/tracing");
const { NodeTracerProvider } = require("@opentelemetry/node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");
const { AWSXRayPropagator } = require("@opentelemetry/propagator-aws-xray");
const { AWSXRayIdGenerator } = require("@opentelemetry/id-generator-aws-xray");
const { trace } = require("@opentelemetry/api");

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
