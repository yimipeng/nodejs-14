'use strict'

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


const tracerProvider = new NodeTracerProvider({
  resource: Resource.default().merge(new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "node-simple-app"
  })),
  idGenerator: new AWSXRayIdGenerator(),
  instrumentations: [
    new HttpInstrumentation(),
    new AwsInstrumentation({
      suppressInternalInstrumentation: true
    }),
  ]
});

// Expects Collector at env variable `OTEL_EXPORTER_OTLP_ENDPOINT`, otherwise, http://localhost:4317
tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new CollectorTraceExporter()));

tracerProvider.register({
  propagator: new AWSXRayPropagator()
});

module.exports = trace.getTracer("node-simple-tests");
