/**
 * Synaptiv Learning — Courses Lambda (Node.js 18.x)
 * Deploy this as a single Lambda function behind API Gateway.
 *
 * Routes handled:
 *   GET    /courses         → list all courses
 *   POST   /courses         → create course
 *   PUT    /courses/{id}    → update course
 *   DELETE /courses/{id}    → delete course
 *
 * Environment variable required:
 *   COURSES_TABLE  — DynamoDB table name (e.g. SynaptivCourses)
 */

const { DynamoDBClient, ScanCommand, PutItemCommand,
        UpdateItemCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const TABLE  = process.env.COURSES_TABLE;

const headers = {
  'Content-Type':                'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':'Authorization,Content-Type',
  'Access-Control-Allow-Methods':'GET,POST,PUT,DELETE,OPTIONS',
};

function resp(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  const method = event.httpMethod;
  const id     = event.pathParameters && event.pathParameters.id;

  // Preflight
  if (method === 'OPTIONS') return resp(200, {});

  try {
    // ── GET /courses ──────────────────────────────────────────
    if (method === 'GET' && !id) {
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      const courses = (result.Items || []).map(unmarshall);
      return resp(200, courses);
    }

    // ── POST /courses ─────────────────────────────────────────
    if (method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      if (!body.id || !body.shortName || !body.name) {
        return resp(400, { error: 'id, shortName and name are required' });
      }
      await client.send(new PutItemCommand({
        TableName: TABLE,
        Item: marshall(body, { removeUndefinedValues: true }),
      }));
      return resp(201, body);
    }

    // ── PUT /courses/{id} ─────────────────────────────────────
    if (method === 'PUT' && id) {
      const body = JSON.parse(event.body || '{}');
      // Replace the whole item (simpler than attribute-level update for nested arrays)
      body.id = id;
      await client.send(new PutItemCommand({
        TableName: TABLE,
        Item: marshall(body, { removeUndefinedValues: true }),
      }));
      return resp(200, body);
    }

    // ── DELETE /courses/{id} ──────────────────────────────────
    if (method === 'DELETE' && id) {
      await client.send(new DeleteItemCommand({
        TableName: TABLE,
        Key: marshall({ id }),
      }));
      return resp(200, { deleted: id });
    }

    return resp(404, { error: 'Route not found' });

  } catch (err) {
    console.error(err);
    return resp(500, { error: err.message });
  }
};
