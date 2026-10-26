/**
 * Acesso ao DynamoDB. O runtime nodejs22.x já traz o AWS SDK v3 embutido,
 * então não é necessário empacotar dependências.
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export const TABLES = {
  events: process.env.EVENTS_TABLE,
  leads: process.env.LEADS_TABLE,
};

/** Pagina uma Query até o fim (com limite de segurança). */
export async function queryAll(params, { maxPages = 20 } = {}) {
  const items = [];
  let lastKey;
  let pages = 0;
  do {
    const res = await ddb.send(
      new QueryCommand({ ...params, ExclusiveStartKey: lastKey }),
    );
    if (res.Items) items.push(...res.Items);
    lastKey = res.LastEvaluatedKey;
    pages += 1;
  } while (lastKey && pages < maxPages);
  return items;
}

export async function putEvent(item) {
  await ddb.send(
    new PutCommand({ TableName: TABLES.events, Item: item }),
  );
}

export async function putLead(item) {
  await ddb.send(
    new PutCommand({ TableName: TABLES.leads, Item: item }),
  );
}

export async function updateLead(pk, sk, patch) {
  const names = {};
  const values = {};
  const sets = [];
  for (const [key, value] of Object.entries(patch)) {
    names[`#${key}`] = key;
    values[`:${key}`] = value;
    sets.push(`#${key} = :${key}`);
  }
  const res = await ddb.send(
    new UpdateCommand({
      TableName: TABLES.leads,
      Key: { pk, sk },
      UpdateExpression: `SET ${sets.join(", ")}`,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: "ALL_NEW",
    }),
  );
  return res.Attributes;
}
