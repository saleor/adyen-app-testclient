import { graphql } from "gql.tada";
import request from "graphql-request";
import { z } from "zod";

import { envUrlSchema } from "@/lib/env-url";
import { BaseError, UnknownError } from "@/lib/errors";
import { actionClient } from "@/lib/safe-action";

const SignInMutation = graphql(`
  mutation createToken($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      user {
        id
        email
      }
      token
      errors {
        message
        code
        field
      }
    }
  }
`);

export const sigInToSaleor = actionClient
  .schema(
    z.object({
      email: z.string(),
      password: z.string(),
      envUrl: envUrlSchema,
    }),
  )
  .metadata({ actionName: "signInToSaleor" })
  .action(async ({ parsedInput: { email, password, envUrl } }) => {
    const response = await request(envUrl, SignInMutation, {
      email,
      password,
    }).catch((error) => {
      throw BaseError.normalize(error, UnknownError);
    });

    return response;
  });
