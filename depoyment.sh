secrets=$(aws secretsmanager get-secret-value --secret-id to-do-app-secret --region ap-south-1 --output json)

# Extract the secretString attribute
secretString=$(echo $secrets | jq -r .SecretString)

# Parse the JSON within secretString and set environment variables
export AWS_ACCESS_KEY_ID=$(echo $secretString | jq -r .AWS_ACCESS_KEY_ID)
export AWS_SECRET_ACCESS_KEY=$(echo $secretString | jq -r .AWS_SECRET_ACCESS_KEY)
export AWS_REGION=$(echo $secretString | jq -r .AWS_REGION)
export DATABASE_USER=$(echo $secretString | jq -r .DATABASE_USER)
export DATABASE_PASSWORD=$(echo $secretString | jq -r .DATABASE_PASSWORD)
export JWT_SECRET=$(echo $secretString | jq -r .JWT_SECRET)