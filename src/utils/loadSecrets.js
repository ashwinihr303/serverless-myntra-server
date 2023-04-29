const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const getSecrets = async (secretKey = "secrets_access_key") => {
  // check how to use value passed as parameter
  const secret_name = process.env.secrets_access_key;

  const client = new SecretsManagerClient({
    region: process.env.region,
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    console.log(error, "Error ocurred while fetching the secrets");
    throw error;
  }

  const secretValue = response.SecretString;
  return secretValue;
};

module.exports = {
  getSecrets,
};
