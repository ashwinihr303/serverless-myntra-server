var AWS = require("aws-sdk");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const getSecrets = async (secretKey = "secrets_access_key") => {
  // AWS.config.update({
  //   region: process.env.region,
  //   accessKeyId: 'AKIARTLU35K4HAILCVVB',
  //   secretAccessKey: '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',
  // });

  // AWS.config.update({
  //   region: 'us-east-1',
  //   credentials: {
  //     accessKeyId: "AKIARTLU35K4HAILCVVB",
  //     secretAccessKey: "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",
  //   },
  // });

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
    console.log(error.message, "Error ocurred while fetching the secrets");
    throw error;
  }

  const secretValue = response.SecretString;
  return secretValue;
};

module.exports = {
  getSecrets,
};
