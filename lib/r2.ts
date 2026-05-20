import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? '';

export async function r2Put(key: string, body: Buffer | Uint8Array, contentType: string) {
  return r2.send(
    new PutObjectCommand({
      Bucket: required('R2_BUCKET_NAME'),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function r2Delete(key: string) {
  return r2.send(new DeleteObjectCommand({ Bucket: required('R2_BUCKET_NAME'), Key: key }));
}

export async function r2List(prefix = '') {
  const out: string[] = [];
  let token: string | undefined;
  do {
    const resp = await r2.send(
      new ListObjectsV2Command({
        Bucket: required('R2_BUCKET_NAME'),
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    for (const obj of resp.Contents ?? []) if (obj.Key) out.push(obj.Key);
    token = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (token);
  return out;
}

export async function r2SignedGetUrl(key: string, expiresIn = 60 * 60) {
  return getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: required('R2_BUCKET_NAME'), Key: key }),
    { expiresIn },
  );
}

// Re-exported from a dependency-free module so client components can import
// r2PublicUrl without pulling the AWS SDK into the client bundle.
export { r2PublicUrl } from './r2-url';
