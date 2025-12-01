# DynamoDB Table Setup for MavPrep

## Option 1: AWS Console (Easiest)

### Step 1: Create the Table

1. Go to [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb)
2. Click **"Create table"**
3. Configure:
   - **Table name**: `MavPrepData`
   - **Partition key**: `PK` (String)
   - **Sort key**: `SK` (String)
4. Under **Table settings**, choose **"Customize settings"**
5. Under **Read/write capacity settings**, select **"On-demand"** (recommended for variable workloads)
6. Click **"Create table"**

### Step 2: Create Global Secondary Index (GSI)

After the table is created:

1. Click on your table name
2. Go to **"Indexes"** tab
3. Click **"Create index"**
4. Configure:
   - **Partition key**: `GSI1PK` (String)
   - **Sort key**: `GSI1SK` (String)
   - **Index name**: `GSI1`
   - **Projected attributes**: All
5. Click **"Create index"**

---

## Option 2: AWS CLI

```bash
# Create the table
aws dynamodb create-table \
  --table-name MavPrepData \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    "[{
      \"IndexName\": \"GSI1\",
      \"KeySchema\": [
        {\"AttributeName\": \"GSI1PK\", \"KeyType\": \"HASH\"},
        {\"AttributeName\": \"GSI1SK\", \"KeyType\": \"RANGE\"}
      ],
      \"Projection\": {\"ProjectionType\": \"ALL\"}
    }]" \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

---

## Option 3: CloudFormation Template

Save this as `dynamodb-template.yaml` and deploy via AWS CloudFormation:

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: DynamoDB table for MavPrep application

Resources:
  MavPrepTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: MavPrepData
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: PK
          AttributeType: S
        - AttributeName: SK
          AttributeType: S
        - AttributeName: GSI1PK
          AttributeType: S
        - AttributeName: GSI1SK
          AttributeType: S
      KeySchema:
        - AttributeName: PK
          KeyType: HASH
        - AttributeName: SK
          KeyType: RANGE
      GlobalSecondaryIndexes:
        - IndexName: GSI1
          KeySchema:
            - AttributeName: GSI1PK
              KeyType: HASH
            - AttributeName: GSI1SK
              KeyType: RANGE
          Projection:
            ProjectionType: ALL
      Tags:
        - Key: Application
          Value: MavPrep
        - Key: Environment
          Value: Production

Outputs:
  TableName:
    Description: DynamoDB Table Name
    Value: !Ref MavPrepTable
  TableArn:
    Description: DynamoDB Table ARN
    Value: !GetAtt MavPrepTable.Arn
```

Deploy with:
```bash
aws cloudformation create-stack \
  --stack-name mavprep-dynamodb \
  --template-body file://dynamodb-template.yaml \
  --region us-east-1
```

---

## IAM Permissions

Create an IAM user or role with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/MavPrepData",
        "arn:aws:dynamodb:us-east-1:YOUR_ACCOUNT_ID:table/MavPrepData/index/*"
      ]
    }
  ]
}
```

---

## Environment Variables

Add these to your `.env.local` file:

```env
# AWS Credentials (for local development)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# DynamoDB
DYNAMODB_TABLE_NAME=MavPrepData
```

**For AWS Amplify deployment:**
Add these environment variables in the Amplify Console under:
`App settings > Environment variables`

---

## Data Model

### Channels
```
PK: CHANNEL#channelId
SK: METADATA
GSI1PK: CHANNELS
GSI1SK: CHANNEL#channelId

Attributes:
- id: string
- name: string
- type: "text" | "voice"
- privacy: "public" | "private"
- password?: string (hashed)
- createdBy: string (userId)
- createdAt: ISO timestamp
```

### Messages
```
PK: CHANNEL#channelId
SK: MSG#timestamp#messageId
GSI1PK: USER#userId
GSI1SK: MSG#timestamp#messageId

Attributes:
- id: string
- channelId: string
- userId: string
- userName: string
- content: string
- timestamp: ISO timestamp
- updatedAt?: ISO timestamp
- reactions?: [{ emoji: string, users: string[] }]
```

### Users
```
PK: USER#userId
SK: PROFILE

Attributes:
- userId: string
- userName: string
- email: string
- avatar?: string (S3 URL)
- createdAt: ISO timestamp
```

---

## Testing the Setup

After setup, test with this curl command:

```bash
# Create a test channel
curl -X POST http://localhost:3000/api/channels \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-channel",
    "name": "Test Channel",
    "type": "text",
    "privacy": "public",
    "createdBy": "user-1"
  }'

# Get all channels
curl http://localhost:3000/api/channels
```

---

## Estimated Costs

DynamoDB On-Demand pricing (us-east-1):
- **Write**: $1.25 per million requests
- **Read**: $0.25 per million requests
- **Storage**: $0.25 per GB/month

For a small study group app:
- ~10,000 messages/month = ~$0.02
- ~100,000 reads/month = ~$0.025
- **Estimated**: < $1/month

