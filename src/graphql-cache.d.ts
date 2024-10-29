/* eslint-disable */
/* prettier-ignore */
import type { TadaDocumentNode, $tada } from 'gql.tada';

declare module 'gql.tada' {
 interface setupCache {
    "\n  fragment BillingAddress on Address {\n    firstName\n    lastName\n    streetAddress1\n    city\n    postalCode\n    country {\n      code\n    }\n    countryArea\n  }\n":
      TadaDocumentNode<{ firstName: string; lastName: string; streetAddress1: string; city: string; postalCode: string; country: { code: string; }; countryArea: string; }, {}, { fragment: "BillingAddress"; on: "Address"; masked: true; }>;
    "\n  fragment ShippingMethod on ShippingMethod {\n    id\n    name\n    price {\n      amount\n      currency\n    }\n  }\n":
      TadaDocumentNode<{ id: string; name: string; price: { amount: number; currency: string; }; }, {}, { fragment: "ShippingMethod"; on: "ShippingMethod"; masked: true; }>;
    "\n  fragment DeliveryMethod on ShippingMethod {\n    id\n  }\n":
      TadaDocumentNode<{ id: string; }, {}, { fragment: "DeliveryMethod"; on: "ShippingMethod"; masked: true; }>;
    "\n  fragment CollectionPoint on Warehouse {\n    id\n  }\n":
      TadaDocumentNode<{ id: string; }, {}, { fragment: "CollectionPoint"; on: "Warehouse"; masked: true; }>;
    "\n  fragment ShippingAddress on Address {\n    firstName\n    lastName\n    streetAddress1\n    city\n    postalCode\n    country {\n      code\n    }\n    countryArea\n  }\n":
      TadaDocumentNode<{ firstName: string; lastName: string; streetAddress1: string; city: string; postalCode: string; country: { code: string; }; countryArea: string; }, {}, { fragment: "ShippingAddress"; on: "Address"; masked: true; }>;
    "\n    query getCheckout($checkoutId: ID!) {\n      checkout(id: $checkoutId) {\n        billingAddress {\n          ...BillingAddress\n        }\n        shippingAddress {\n          ...ShippingAddress\n        }\n        shippingMethods {\n          ...ShippingMethod\n        }\n        deliveryMethod {\n          ...DeliveryMethod\n          ...CollectionPoint\n        }\n      }\n    }\n  ":
      TadaDocumentNode<{ checkout: { billingAddress: { [$tada.fragmentRefs]: { BillingAddress: "Address"; }; } | null; shippingAddress: { [$tada.fragmentRefs]: { ShippingAddress: "Address"; }; } | null; shippingMethods: { [$tada.fragmentRefs]: { ShippingMethod: "ShippingMethod"; }; }[]; deliveryMethod: { __typename?: "ShippingMethod" | undefined; [$tada.fragmentRefs]: { DeliveryMethod: "ShippingMethod"; }; } | { __typename?: "Warehouse" | undefined; [$tada.fragmentRefs]: { CollectionPoint: "Warehouse"; }; } | null; } | null; }, { checkoutId: string; }, void>;
    "\n  mutation updateBillingAddress($checkoutId: ID!, $input: AddressInput!) {\n    checkoutBillingAddressUpdate(\n      checkoutId: $checkoutId\n      billingAddress: $input\n    ) {\n      errors {\n        field\n        message\n      }\n    }\n  }\n":
      TadaDocumentNode<{ checkoutBillingAddressUpdate: { errors: { field: string | null; message: string | null; }[]; } | null; }, { input: { metadata?: { value: string; key: string; }[] | null | undefined; phone?: string | null | undefined; countryArea?: string | null | undefined; country?: "ID" | "AF" | "AX" | "AL" | "DZ" | "AS" | "AD" | "AO" | "AI" | "AQ" | "AG" | "AR" | "AM" | "AW" | "AU" | "AT" | "AZ" | "BS" | "BH" | "BD" | "BB" | "BY" | "BE" | "BZ" | "BJ" | "BM" | "BT" | "BO" | "BQ" | "BA" | "BW" | "BV" | "BR" | "IO" | "BN" | "BG" | "BF" | "BI" | "CV" | "KH" | "CM" | "CA" | "KY" | "CF" | "TD" | "CL" | "CN" | "CX" | "CC" | "CO" | "KM" | "CG" | "CD" | "CK" | "CR" | "CI" | "HR" | "CU" | "CW" | "CY" | "CZ" | "DK" | "DJ" | "DM" | "DO" | "EC" | "EG" | "SV" | "GQ" | "ER" | "EE" | "SZ" | "ET" | "EU" | "FK" | "FO" | "FJ" | "FI" | "FR" | "GF" | "PF" | "TF" | "GA" | "GM" | "GE" | "DE" | "GH" | "GI" | "GR" | "GL" | "GD" | "GP" | "GU" | "GT" | "GG" | "GN" | "GW" | "GY" | "HT" | "HM" | "VA" | "HN" | "HK" | "HU" | "IS" | "IN" | "IR" | "IQ" | "IE" | "IM" | "IL" | "IT" | "JM" | "JP" | "JE" | "JO" | "KZ" | "KE" | "KI" | "KW" | "KG" | "LA" | "LV" | "LB" | "LS" | "LR" | "LY" | "LI" | "LT" | "LU" | "MO" | "MG" | "MW" | "MY" | "MV" | "ML" | "MT" | "MH" | "MQ" | "MR" | "MU" | "YT" | "MX" | "FM" | "MD" | "MC" | "MN" | "ME" | "MS" | "MA" | "MZ" | "MM" | "NA" | "NR" | "NP" | "NL" | "NC" | "NZ" | "NI" | "NE" | "NG" | "NU" | "NF" | "KP" | "MK" | "MP" | "NO" | "OM" | "PK" | "PW" | "PS" | "PA" | "PG" | "PY" | "PE" | "PH" | "PN" | "PL" | "PT" | "PR" | "QA" | "RE" | "RO" | "RU" | "RW" | "BL" | "SH" | "KN" | "LC" | "MF" | "PM" | "VC" | "WS" | "SM" | "ST" | "SA" | "SN" | "RS" | "SC" | "SL" | "SG" | "SX" | "SK" | "SI" | "SB" | "SO" | "ZA" | "GS" | "KR" | "SS" | "ES" | "LK" | "SD" | "SR" | "SJ" | "SE" | "CH" | "SY" | "TW" | "TJ" | "TZ" | "TH" | "TL" | "TG" | "TK" | "TO" | "TT" | "TN" | "TR" | "TM" | "TC" | "TV" | "UG" | "UA" | "AE" | "GB" | "UM" | "US" | "UY" | "UZ" | "VU" | "VE" | "VN" | "VG" | "VI" | "WF" | "EH" | "YE" | "ZM" | "ZW" | null | undefined; postalCode?: string | null | undefined; cityArea?: string | null | undefined; city?: string | null | undefined; streetAddress2?: string | null | undefined; streetAddress1?: string | null | undefined; companyName?: string | null | undefined; lastName?: string | null | undefined; firstName?: string | null | undefined; }; checkoutId: string; }, void>;
    "\n  mutation updateShippingAddress($checkoutId: ID!, $input: AddressInput!) {\n    checkoutShippingAddressUpdate(\n      checkoutId: $checkoutId\n      shippingAddress: $input\n    ) {\n      errors {\n        field\n        message\n      }\n    }\n  }\n":
      TadaDocumentNode<{ checkoutShippingAddressUpdate: { errors: { field: string | null; message: string | null; }[]; } | null; }, { input: { metadata?: { value: string; key: string; }[] | null | undefined; phone?: string | null | undefined; countryArea?: string | null | undefined; country?: "PL" | "SE" | "US" | "ID" | "AF" | "AX" | "AL" | "DZ" | "AS" | "AD" | "AO" | "AI" | "AQ" | "AG" | "AR" | "AM" | "AW" | "AU" | "AT" | "AZ" | "BS" | "BH" | "BD" | "BB" | "BY" | "BE" | "BZ" | "BJ" | "BM" | "BT" | "BO" | "BQ" | "BA" | "BW" | "BV" | "BR" | "IO" | "BN" | "BG" | "BF" | "BI" | "CV" | "KH" | "CM" | "CA" | "KY" | "CF" | "TD" | "CL" | "CN" | "CX" | "CC" | "CO" | "KM" | "CG" | "CD" | "CK" | "CR" | "CI" | "HR" | "CU" | "CW" | "CY" | "CZ" | "DK" | "DJ" | "DM" | "DO" | "EC" | "EG" | "SV" | "GQ" | "ER" | "EE" | "SZ" | "ET" | "EU" | "FK" | "FO" | "FJ" | "FI" | "FR" | "GF" | "PF" | "TF" | "GA" | "GM" | "GE" | "DE" | "GH" | "GI" | "GR" | "GL" | "GD" | "GP" | "GU" | "GT" | "GG" | "GN" | "GW" | "GY" | "HT" | "HM" | "VA" | "HN" | "HK" | "HU" | "IS" | "IN" | "IR" | "IQ" | "IE" | "IM" | "IL" | "IT" | "JM" | "JP" | "JE" | "JO" | "KZ" | "KE" | "KI" | "KW" | "KG" | "LA" | "LV" | "LB" | "LS" | "LR" | "LY" | "LI" | "LT" | "LU" | "MO" | "MG" | "MW" | "MY" | "MV" | "ML" | "MT" | "MH" | "MQ" | "MR" | "MU" | "YT" | "MX" | "FM" | "MD" | "MC" | "MN" | "ME" | "MS" | "MA" | "MZ" | "MM" | "NA" | "NR" | "NP" | "NL" | "NC" | "NZ" | "NI" | "NE" | "NG" | "NU" | "NF" | "KP" | "MK" | "MP" | "NO" | "OM" | "PK" | "PW" | "PS" | "PA" | "PG" | "PY" | "PE" | "PH" | "PN" | "PT" | "PR" | "QA" | "RE" | "RO" | "RU" | "RW" | "BL" | "SH" | "KN" | "LC" | "MF" | "PM" | "VC" | "WS" | "SM" | "ST" | "SA" | "SN" | "RS" | "SC" | "SL" | "SG" | "SX" | "SK" | "SI" | "SB" | "SO" | "ZA" | "GS" | "KR" | "SS" | "ES" | "LK" | "SD" | "SR" | "SJ" | "CH" | "SY" | "TW" | "TJ" | "TZ" | "TH" | "TL" | "TG" | "TK" | "TO" | "TT" | "TN" | "TR" | "TM" | "TC" | "TV" | "UG" | "UA" | "AE" | "GB" | "UM" | "UY" | "UZ" | "VU" | "VE" | "VN" | "VG" | "VI" | "WF" | "EH" | "YE" | "ZM" | "ZW" | null | undefined; postalCode?: string | null | undefined; cityArea?: string | null | undefined; city?: string | null | undefined; streetAddress2?: string | null | undefined; streetAddress1?: string | null | undefined; companyName?: string | null | undefined; lastName?: string | null | undefined; firstName?: string | null | undefined; }; checkoutId: string; }, void>;
    "\n  fragment TotalPrice on TaxedMoney {\n    gross {\n      amount\n      currency\n    }\n  }\n":
      TadaDocumentNode<{ gross: { amount: number; currency: string; }; }, {}, { fragment: "TotalPrice"; on: "TaxedMoney"; masked: true; }>;
    "\n    query GetCheckoutTotalPrice($checkoutId: ID!) {\n      checkout(id: $checkoutId) {\n        totalPrice {\n          ...TotalPrice\n        }\n      }\n    }\n  ":
      TadaDocumentNode<{ checkout: { totalPrice: { [$tada.fragmentRefs]: { TotalPrice: "TaxedMoney"; }; }; } | null; }, { checkoutId: string; }, void>;
    "\n  mutation initalizePaymentGateway(\n    $checkoutId: ID!\n    $paymentGatewayId: String!\n    $amount: PositiveDecimal\n    $data: JSON\n  ) {\n    paymentGatewayInitialize(\n      id: $checkoutId\n      paymentGateways: [{ id: $paymentGatewayId, data: $data }]\n      amount: $amount\n    ) {\n      gatewayConfigs {\n        id\n        data\n        errors {\n          field\n          message\n          code\n        }\n      }\n      errors {\n        field\n        message\n        code\n      }\n    }\n  }\n":
      TadaDocumentNode<{ paymentGatewayInitialize: { gatewayConfigs: { id: string; data: unknown; errors: { field: string | null; message: string | null; code: "GRAPHQL_ERROR" | "INVALID" | "NOT_FOUND"; }[] | null; }[] | null; errors: { field: string | null; message: string | null; code: "GRAPHQL_ERROR" | "INVALID" | "NOT_FOUND"; }[]; } | null; }, { data?: unknown; amount?: unknown; paymentGatewayId: string; checkoutId: string; }, void>;
    "\n  mutation InitalizeTransaction(\n    $checkoutId: ID!\n    $data: JSON\n    $idempotencyKey: String\n    $paymentGatewayId: String!\n    $amount: PositiveDecimal!\n  ) {\n    transactionInitialize(\n      id: $checkoutId\n      paymentGateway: { id: $paymentGatewayId, data: $data }\n      amount: $amount\n      idempotencyKey: $idempotencyKey\n    ) {\n      transaction {\n        id\n      }\n      data\n      errors {\n        field\n        message\n        code\n      }\n    }\n  }\n":
      TadaDocumentNode<{ transactionInitialize: { transaction: { id: string; } | null; data: unknown; errors: { field: string | null; message: string | null; code: "GRAPHQL_ERROR" | "INVALID" | "NOT_FOUND" | "UNIQUE" | "CHECKOUT_COMPLETION_IN_PROGRESS"; }[]; } | null; }, { amount: unknown; paymentGatewayId: string; idempotencyKey?: string | null | undefined; data?: unknown; checkoutId: string; }, void>;
    "\n  mutation transactionProcess($transactionId: ID!, $data: JSON) {\n    transactionProcess(id: $transactionId, data: $data) {\n      transaction {\n        id\n        actions\n        message\n        pspReference\n        events {\n          type\n          id\n          createdAt\n          message\n          pspReference\n        }\n      }\n      data\n      errors {\n        field\n        message\n        code\n      }\n    }\n  }\n":
      TadaDocumentNode<{ transactionProcess: { transaction: { id: string; actions: ("CHARGE" | "REFUND" | "CANCEL")[]; message: string; pspReference: string; events: { type: "AUTHORIZATION_SUCCESS" | "AUTHORIZATION_FAILURE" | "AUTHORIZATION_ADJUSTMENT" | "AUTHORIZATION_REQUEST" | "AUTHORIZATION_ACTION_REQUIRED" | "CHARGE_ACTION_REQUIRED" | "CHARGE_SUCCESS" | "CHARGE_FAILURE" | "CHARGE_BACK" | "CHARGE_REQUEST" | "REFUND_SUCCESS" | "REFUND_FAILURE" | "REFUND_REVERSE" | "REFUND_REQUEST" | "CANCEL_SUCCESS" | "CANCEL_FAILURE" | "CANCEL_REQUEST" | "INFO" | null; id: string; createdAt: unknown; message: string; pspReference: string; }[]; } | null; data: unknown; errors: { field: string | null; message: string | null; code: "GRAPHQL_ERROR" | "INVALID" | "NOT_FOUND" | "TRANSACTION_ALREADY_PROCESSED" | "MISSING_PAYMENT_APP_RELATION" | "MISSING_PAYMENT_APP" | "CHECKOUT_COMPLETION_IN_PROGRESS"; }[]; } | null; }, { data?: unknown; transactionId: string; }, void>;
    "\n  mutation createCheckout($input: CheckoutCreateInput!) {\n    checkoutCreate(input: $input) {\n      checkout {\n        id\n      }\n      errors {\n        field\n        message\n      }\n    }\n  }\n":
      TadaDocumentNode<{ checkoutCreate: { checkout: { id: string; } | null; errors: { field: string | null; message: string | null; }[]; } | null; }, { input: { validationRules?: { billingAddress?: { enableFieldsNormalization?: boolean | null | undefined; checkFieldsFormat?: boolean | null | undefined; checkRequiredFields?: boolean | null | undefined; } | null | undefined; shippingAddress?: { enableFieldsNormalization?: boolean | null | undefined; checkFieldsFormat?: boolean | null | undefined; checkRequiredFields?: boolean | null | undefined; } | null | undefined; } | null | undefined; languageCode?: "ID" | "AF" | "DZ" | "AS" | "AR" | "AM" | "AZ" | "BS" | "BE" | "BM" | "BO" | "BR" | "BN" | "BG" | "CA" | "KY" | "KM" | "HR" | "CU" | "CY" | "SV" | "EE" | "ET" | "EU" | "FO" | "FI" | "FR" | "GA" | "DE" | "GL" | "GD" | "GU" | "HU" | "IS" | "IT" | "KI" | "KW" | "LV" | "LB" | "LT" | "LU" | "MG" | "MY" | "ML" | "MT" | "MR" | "MN" | "MS" | "NL" | "NE" | "MK" | "OM" | "PS" | "PA" | "PL" | "PT" | "RO" | "RU" | "RW" | "KN" | "SN" | "SL" | "SG" | "SK" | "SI" | "SO" | "ES" | "SD" | "SR" | "SE" | "TH" | "TG" | "TK" | "TO" | "TT" | "TR" | "UG" | "UZ" | "VI" | "AF_NA" | "AF_ZA" | "AGQ" | "AGQ_CM" | "AK" | "AK_GH" | "AM_ET" | "AR_AE" | "AR_BH" | "AR_DJ" | "AR_DZ" | "AR_EG" | "AR_EH" | "AR_ER" | "AR_IL" | "AR_IQ" | "AR_JO" | "AR_KM" | "AR_KW" | "AR_LB" | "AR_LY" | "AR_MA" | "AR_MR" | "AR_OM" | "AR_PS" | "AR_QA" | "AR_SA" | "AR_SD" | "AR_SO" | "AR_SS" | "AR_SY" | "AR_TD" | "AR_TN" | "AR_YE" | "AS_IN" | "ASA" | "ASA_TZ" | "AST" | "AST_ES" | "AZ_CYRL" | "AZ_CYRL_AZ" | "AZ_LATN" | "AZ_LATN_AZ" | "BAS" | "BAS_CM" | "BE_BY" | "BEM" | "BEM_ZM" | "BEZ" | "BEZ_TZ" | "BG_BG" | "BM_ML" | "BN_BD" | "BN_IN" | "BO_CN" | "BO_IN" | "BR_FR" | "BRX" | "BRX_IN" | "BS_CYRL" | "BS_CYRL_BA" | "BS_LATN" | "BS_LATN_BA" | "CA_AD" | "CA_ES" | "CA_ES_VALENCIA" | "CA_FR" | "CA_IT" | "CCP" | "CCP_BD" | "CCP_IN" | "CE" | "CE_RU" | "CEB" | "CEB_PH" | "CGG" | "CGG_UG" | "CHR" | "CHR_US" | "CKB" | "CKB_IQ" | "CKB_IR" | "CS" | "CS_CZ" | "CU_RU" | "CY_GB" | "DA" | "DA_DK" | "DA_GL" | "DAV" | "DAV_KE" | "DE_AT" | "DE_BE" | "DE_CH" | "DE_DE" | "DE_IT" | "DE_LI" | "DE_LU" | "DJE" | "DJE_NE" | "DSB" | "DSB_DE" | "DUA" | "DUA_CM" | "DYO" | "DYO_SN" | "DZ_BT" | "EBU" | "EBU_KE" | "EE_GH" | "EE_TG" | "EL" | "EL_CY" | "EL_GR" | "EN" | "EN_AE" | "EN_AG" | "EN_AI" | "EN_AS" | "EN_AT" | "EN_AU" | "EN_BB" | "EN_BE" | "EN_BI" | "EN_BM" | "EN_BS" | "EN_BW" | "EN_BZ" | "EN_CA" | "EN_CC" | "EN_CH" | "EN_CK" | "EN_CM" | "EN_CX" | "EN_CY" | "EN_DE" | "EN_DG" | "EN_DK" | "EN_DM" | "EN_ER" | "EN_FI" | "EN_FJ" | "EN_FK" | "EN_FM" | "EN_GB" | "EN_GD" | "EN_GG" | "EN_GH" | "EN_GI" | "EN_GM" | "EN_GU" | "EN_GY" | "EN_HK" | "EN_IE" | "EN_IL" | "EN_IM" | "EN_IN" | "EN_IO" | "EN_JE" | "EN_JM" | "EN_KE" | "EN_KI" | "EN_KN" | "EN_KY" | "EN_LC" | "EN_LR" | "EN_LS" | "EN_MG" | "EN_MH" | "EN_MO" | "EN_MP" | "EN_MS" | "EN_MT" | "EN_MU" | "EN_MW" | "EN_MY" | "EN_NA" | "EN_NF" | "EN_NG" | "EN_NL" | "EN_NR" | "EN_NU" | "EN_NZ" | "EN_PG" | "EN_PH" | "EN_PK" | "EN_PN" | "EN_PR" | "EN_PW" | "EN_RW" | "EN_SB" | "EN_SC" | "EN_SD" | "EN_SE" | "EN_SG" | "EN_SH" | "EN_SI" | "EN_SL" | "EN_SS" | "EN_SX" | "EN_SZ" | "EN_TC" | "EN_TK" | "EN_TO" | "EN_TT" | "EN_TV" | "EN_TZ" | "EN_UG" | "EN_UM" | "EN_US" | "EN_VC" | "EN_VG" | "EN_VI" | "EN_VU" | "EN_WS" | "EN_ZA" | "EN_ZM" | "EN_ZW" | "EO" | "ES_AR" | "ES_BO" | "ES_BR" | "ES_BZ" | "ES_CL" | "ES_CO" | "ES_CR" | "ES_CU" | "ES_DO" | "ES_EA" | "ES_EC" | "ES_ES" | "ES_GQ" | "ES_GT" | "ES_HN" | "ES_IC" | "ES_MX" | "ES_NI" | "ES_PA" | "ES_PE" | "ES_PH" | "ES_PR" | "ES_PY" | "ES_SV" | "ES_US" | "ES_UY" | "ES_VE" | "ET_EE" | "EU_ES" | "EWO" | "EWO_CM" | "FA" | "FA_AF" | "FA_IR" | "FF" | "FF_ADLM" | "FF_ADLM_BF" | "FF_ADLM_CM" | "FF_ADLM_GH" | "FF_ADLM_GM" | "FF_ADLM_GN" | "FF_ADLM_GW" | "FF_ADLM_LR" | "FF_ADLM_MR" | "FF_ADLM_NE" | "FF_ADLM_NG" | "FF_ADLM_SL" | "FF_ADLM_SN" | "FF_LATN" | "FF_LATN_BF" | "FF_LATN_CM" | "FF_LATN_GH" | "FF_LATN_GM" | "FF_LATN_GN" | "FF_LATN_GW" | "FF_LATN_LR" | "FF_LATN_MR" | "FF_LATN_NE" | "FF_LATN_NG" | "FF_LATN_SL" | "FF_LATN_SN" | "FI_FI" | "FIL" | "FIL_PH" | "FO_DK" | "FO_FO" | "FR_BE" | "FR_BF" | "FR_BI" | "FR_BJ" | "FR_BL" | "FR_CA" | "FR_CD" | "FR_CF" | "FR_CG" | "FR_CH" | "FR_CI" | "FR_CM" | "FR_DJ" | "FR_DZ" | "FR_FR" | "FR_GA" | "FR_GF" | "FR_GN" | "FR_GP" | "FR_GQ" | "FR_HT" | "FR_KM" | "FR_LU" | "FR_MA" | "FR_MC" | "FR_MF" | "FR_MG" | "FR_ML" | "FR_MQ" | "FR_MR" | "FR_MU" | "FR_NC" | "FR_NE" | "FR_PF" | "FR_PM" | "FR_RE" | "FR_RW" | "FR_SC" | "FR_SN" | "FR_SY" | "FR_TD" | "FR_TG" | "FR_TN" | "FR_VU" | "FR_WF" | "FR_YT" | "FUR" | "FUR_IT" | "FY" | "FY_NL" | "GA_GB" | "GA_IE" | "GD_GB" | "GL_ES" | "GSW" | "GSW_CH" | "GSW_FR" | "GSW_LI" | "GU_IN" | "GUZ" | "GUZ_KE" | "GV" | "GV_IM" | "HA" | "HA_GH" | "HA_NE" | "HA_NG" | "HAW" | "HAW_US" | "HE" | "HE_IL" | "HI" | "HI_IN" | "HR_BA" | "HR_HR" | "HSB" | "HSB_DE" | "HU_HU" | "HY" | "HY_AM" | "IA" | "ID_ID" | "IG" | "IG_NG" | "II" | "II_CN" | "IS_IS" | "IT_CH" | "IT_IT" | "IT_SM" | "IT_VA" | "JA" | "JA_JP" | "JGO" | "JGO_CM" | "JMC" | "JMC_TZ" | "JV" | "JV_ID" | "KA" | "KA_GE" | "KAB" | "KAB_DZ" | "KAM" | "KAM_KE" | "KDE" | "KDE_TZ" | "KEA" | "KEA_CV" | "KHQ" | "KHQ_ML" | "KI_KE" | "KK" | "KK_KZ" | "KKJ" | "KKJ_CM" | "KL" | "KL_GL" | "KLN" | "KLN_KE" | "KM_KH" | "KN_IN" | "KO" | "KO_KP" | "KO_KR" | "KOK" | "KOK_IN" | "KS" | "KS_ARAB" | "KS_ARAB_IN" | "KSB" | "KSB_TZ" | "KSF" | "KSF_CM" | "KSH" | "KSH_DE" | "KU" | "KU_TR" | "KW_GB" | "KY_KG" | "LAG" | "LAG_TZ" | "LB_LU" | "LG" | "LG_UG" | "LKT" | "LKT_US" | "LN" | "LN_AO" | "LN_CD" | "LN_CF" | "LN_CG" | "LO" | "LO_LA" | "LRC" | "LRC_IQ" | "LRC_IR" | "LT_LT" | "LU_CD" | "LUO" | "LUO_KE" | "LUY" | "LUY_KE" | "LV_LV" | "MAI" | "MAI_IN" | "MAS" | "MAS_KE" | "MAS_TZ" | "MER" | "MER_KE" | "MFE" | "MFE_MU" | "MG_MG" | "MGH" | "MGH_MZ" | "MGO" | "MGO_CM" | "MI" | "MI_NZ" | "MK_MK" | "ML_IN" | "MN_MN" | "MNI" | "MNI_BENG" | "MNI_BENG_IN" | "MR_IN" | "MS_BN" | "MS_ID" | "MS_MY" | "MS_SG" | "MT_MT" | "MUA" | "MUA_CM" | "MY_MM" | "MZN" | "MZN_IR" | "NAQ" | "NAQ_NA" | "NB" | "NB_NO" | "NB_SJ" | "ND" | "ND_ZW" | "NDS" | "NDS_DE" | "NDS_NL" | "NE_IN" | "NE_NP" | "NL_AW" | "NL_BE" | "NL_BQ" | "NL_CW" | "NL_NL" | "NL_SR" | "NL_SX" | "NMG" | "NMG_CM" | "NN" | "NN_NO" | "NNH" | "NNH_CM" | "NUS" | "NUS_SS" | "NYN" | "NYN_UG" | "OM_ET" | "OM_KE" | "OR" | "OR_IN" | "OS" | "OS_GE" | "OS_RU" | "PA_ARAB" | "PA_ARAB_PK" | "PA_GURU" | "PA_GURU_IN" | "PCM" | "PCM_NG" | "PL_PL" | "PRG" | "PS_AF" | "PS_PK" | "PT_AO" | "PT_BR" | "PT_CH" | "PT_CV" | "PT_GQ" | "PT_GW" | "PT_LU" | "PT_MO" | "PT_MZ" | "PT_PT" | "PT_ST" | "PT_TL" | "QU" | "QU_BO" | "QU_EC" | "QU_PE" | "RM" | "RM_CH" | "RN" | "RN_BI" | "RO_MD" | "RO_RO" | "ROF" | "ROF_TZ" | "RU_BY" | "RU_KG" | "RU_KZ" | "RU_MD" | "RU_RU" | "RU_UA" | "RW_RW" | "RWK" | "RWK_TZ" | "SAH" | "SAH_RU" | "SAQ" | "SAQ_KE" | "SAT" | "SAT_OLCK" | "SAT_OLCK_IN" | "SBP" | "SBP_TZ" | "SD_ARAB" | "SD_ARAB_PK" | "SD_DEVA" | "SD_DEVA_IN" | "SE_FI" | "SE_NO" | "SE_SE" | "SEH" | "SEH_MZ" | "SES" | "SES_ML" | "SG_CF" | "SHI" | "SHI_LATN" | "SHI_LATN_MA" | "SHI_TFNG" | "SHI_TFNG_MA" | "SI_LK" | "SK_SK" | "SL_SI" | "SMN" | "SMN_FI" | "SN_ZW" | "SO_DJ" | "SO_ET" | "SO_KE" | "SO_SO" | "SQ" | "SQ_AL" | "SQ_MK" | "SQ_XK" | "SR_CYRL" | "SR_CYRL_BA" | "SR_CYRL_ME" | "SR_CYRL_RS" | "SR_CYRL_XK" | "SR_LATN" | "SR_LATN_BA" | "SR_LATN_ME" | "SR_LATN_RS" | "SR_LATN_XK" | "SU" | "SU_LATN" | "SU_LATN_ID" | "SV_AX" | "SV_FI" | "SV_SE" | "SW" | "SW_CD" | "SW_KE" | "SW_TZ" | "SW_UG" | "TA" | "TA_IN" | "TA_LK" | "TA_MY" | "TA_SG" | "TE" | "TE_IN" | "TEO" | "TEO_KE" | "TEO_UG" | "TG_TJ" | "TH_TH" | "TI" | "TI_ER" | "TI_ET" | "TK_TM" | "TO_TO" | "TR_CY" | "TR_TR" | "TT_RU" | "TWQ" | "TWQ_NE" | "TZM" | "TZM_MA" | "UG_CN" | "UK" | "UK_UA" | "UR" | "UR_IN" | "UR_PK" | "UZ_ARAB" | "UZ_ARAB_AF" | "UZ_CYRL" | "UZ_CYRL_UZ" | "UZ_LATN" | "UZ_LATN_UZ" | "VAI" | "VAI_LATN" | "VAI_LATN_LR" | "VAI_VAII" | "VAI_VAII_LR" | "VI_VN" | "VO" | "VUN" | "VUN_TZ" | "WAE" | "WAE_CH" | "WO" | "WO_SN" | "XH" | "XH_ZA" | "XOG" | "XOG_UG" | "YAV" | "YAV_CM" | "YI" | "YO" | "YO_BJ" | "YO_NG" | "YUE" | "YUE_HANS" | "YUE_HANS_CN" | "YUE_HANT" | "YUE_HANT_HK" | "ZGH" | "ZGH_MA" | "ZH" | "ZH_HANS" | "ZH_HANS_CN" | "ZH_HANS_HK" | "ZH_HANS_MO" | "ZH_HANS_SG" | "ZH_HANT" | "ZH_HANT_HK" | "ZH_HANT_MO" | "ZH_HANT_TW" | "ZU" | "ZU_ZA" | null | undefined; billingAddress?: { metadata?: { value: string; key: string; }[] | null | undefined; phone?: string | null | undefined; countryArea?: string | null | undefined; country?: "ID" | "AF" | "AX" | "AL" | "DZ" | "AS" | "AD" | "AO" | "AI" | "AQ" | "AG" | "AR" | "AM" | "AW" | "AU" | "AT" | "AZ" | "BS" | "BH" | "BD" | "BB" | "BY" | "BE" | "BZ" | "BJ" | "BM" | "BT" | "BO" | "BQ" | "BA" | "BW" | "BV" | "BR" | "IO" | "BN" | "BG" | "BF" | "BI" | "CV" | "KH" | "CM" | "CA" | "KY" | "CF" | "TD" | "CL" | "CN" | "CX" | "CC" | "CO" | "KM" | "CG" | "CD" | "CK" | "CR" | "CI" | "HR" | "CU" | "CW" | "CY" | "CZ" | "DK" | "DJ" | "DM" | "DO" | "EC" | "EG" | "SV" | "GQ" | "ER" | "EE" | "SZ" | "ET" | "EU" | "FK" | "FO" | "FJ" | "FI" | "FR" | "GF" | "PF" | "TF" | "GA" | "GM" | "GE" | "DE" | "GH" | "GI" | "GR" | "GL" | "GD" | "GP" | "GU" | "GT" | "GG" | "GN" | "GW" | "GY" | "HT" | "HM" | "VA" | "HN" | "HK" | "HU" | "IS" | "IN" | "IR" | "IQ" | "IE" | "IM" | "IL" | "IT" | "JM" | "JP" | "JE" | "JO" | "KZ" | "KE" | "KI" | "KW" | "KG" | "LA" | "LV" | "LB" | "LS" | "LR" | "LY" | "LI" | "LT" | "LU" | "MO" | "MG" | "MW" | "MY" | "MV" | "ML" | "MT" | "MH" | "MQ" | "MR" | "MU" | "YT" | "MX" | "FM" | "MD" | "MC" | "MN" | "ME" | "MS" | "MA" | "MZ" | "MM" | "NA" | "NR" | "NP" | "NL" | "NC" | "NZ" | "NI" | "NE" | "NG" | "NU" | "NF" | "KP" | "MK" | "MP" | "NO" | "OM" | "PK" | "PW" | "PS" | "PA" | "PG" | "PY" | "PE" | "PH" | "PN" | "PL" | "PT" | "PR" | "QA" | "RE" | "RO" | "RU" | "RW" | "BL" | "SH" | "KN" | "LC" | "MF" | "PM" | "VC" | "WS" | "SM" | "ST" | "SA" | "SN" | "RS" | "SC" | "SL" | "SG" | "SX" | "SK" | "SI" | "SB" | "SO" | "ZA" | "GS" | "KR" | "SS" | "ES" | "LK" | "SD" | "SR" | "SJ" | "SE" | "CH" | "SY" | "TW" | "TJ" | "TZ" | "TH" | "TL" | "TG" | "TK" | "TO" | "TT" | "TN" | "TR" | "TM" | "TC" | "TV" | "UG" | "UA" | "AE" | "GB" | "UM" | "US" | "UY" | "UZ" | "VU" | "VE" | "VN" | "VG" | "VI" | "WF" | "EH" | "YE" | "ZM" | "ZW" | null | undefined; postalCode?: string | null | undefined; cityArea?: string | null | undefined; city?: string | null | undefined; streetAddress2?: string | null | undefined; streetAddress1?: string | null | undefined; companyName?: string | null | undefined; lastName?: string | null | undefined; firstName?: string | null | undefined; } | null | undefined; shippingAddress?: { metadata?: { value: string; key: string; }[] | null | undefined; phone?: string | null | undefined; countryArea?: string | null | undefined; country?: "ID" | "AF" | "AX" | "AL" | "DZ" | "AS" | "AD" | "AO" | "AI" | "AQ" | "AG" | "AR" | "AM" | "AW" | "AU" | "AT" | "AZ" | "BS" | "BH" | "BD" | "BB" | "BY" | "BE" | "BZ" | "BJ" | "BM" | "BT" | "BO" | "BQ" | "BA" | "BW" | "BV" | "BR" | "IO" | "BN" | "BG" | "BF" | "BI" | "CV" | "KH" | "CM" | "CA" | "KY" | "CF" | "TD" | "CL" | "CN" | "CX" | "CC" | "CO" | "KM" | "CG" | "CD" | "CK" | "CR" | "CI" | "HR" | "CU" | "CW" | "CY" | "CZ" | "DK" | "DJ" | "DM" | "DO" | "EC" | "EG" | "SV" | "GQ" | "ER" | "EE" | "SZ" | "ET" | "EU" | "FK" | "FO" | "FJ" | "FI" | "FR" | "GF" | "PF" | "TF" | "GA" | "GM" | "GE" | "DE" | "GH" | "GI" | "GR" | "GL" | "GD" | "GP" | "GU" | "GT" | "GG" | "GN" | "GW" | "GY" | "HT" | "HM" | "VA" | "HN" | "HK" | "HU" | "IS" | "IN" | "IR" | "IQ" | "IE" | "IM" | "IL" | "IT" | "JM" | "JP" | "JE" | "JO" | "KZ" | "KE" | "KI" | "KW" | "KG" | "LA" | "LV" | "LB" | "LS" | "LR" | "LY" | "LI" | "LT" | "LU" | "MO" | "MG" | "MW" | "MY" | "MV" | "ML" | "MT" | "MH" | "MQ" | "MR" | "MU" | "YT" | "MX" | "FM" | "MD" | "MC" | "MN" | "ME" | "MS" | "MA" | "MZ" | "MM" | "NA" | "NR" | "NP" | "NL" | "NC" | "NZ" | "NI" | "NE" | "NG" | "NU" | "NF" | "KP" | "MK" | "MP" | "NO" | "OM" | "PK" | "PW" | "PS" | "PA" | "PG" | "PY" | "PE" | "PH" | "PN" | "PL" | "PT" | "PR" | "QA" | "RE" | "RO" | "RU" | "RW" | "BL" | "SH" | "KN" | "LC" | "MF" | "PM" | "VC" | "WS" | "SM" | "ST" | "SA" | "SN" | "RS" | "SC" | "SL" | "SG" | "SX" | "SK" | "SI" | "SB" | "SO" | "ZA" | "GS" | "KR" | "SS" | "ES" | "LK" | "SD" | "SR" | "SJ" | "SE" | "CH" | "SY" | "TW" | "TJ" | "TZ" | "TH" | "TL" | "TG" | "TK" | "TO" | "TT" | "TN" | "TR" | "TM" | "TC" | "TV" | "UG" | "UA" | "AE" | "GB" | "UM" | "US" | "UY" | "UZ" | "VU" | "VE" | "VN" | "VG" | "VI" | "WF" | "EH" | "YE" | "ZM" | "ZW" | null | undefined; postalCode?: string | null | undefined; cityArea?: string | null | undefined; city?: string | null | undefined; streetAddress2?: string | null | undefined; streetAddress1?: string | null | undefined; companyName?: string | null | undefined; lastName?: string | null | undefined; firstName?: string | null | undefined; } | null | undefined; email?: string | null | undefined; lines: { metadata?: { value: string; key: string; }[] | null | undefined; forceNewLine?: boolean | null | undefined; price?: unknown; variantId: string; quantity: number; }[]; channel?: string | null | undefined; }; }, void>;
    "\n  fragment Product on Product {\n    id\n    name\n    thumbnail(size: 2048) {\n      url\n    }\n    category {\n      name\n    }\n    defaultVariant {\n      id\n      pricing {\n        price {\n          gross {\n            amount\n            currency\n          }\n        }\n      }\n    }\n  }\n":
      TadaDocumentNode<{ id: string; name: string; thumbnail: { url: string; } | null; category: { name: string; } | null; defaultVariant: { id: string; pricing: { price: { gross: { amount: number; currency: string; }; } | null; } | null; } | null; }, {}, { fragment: "Product"; on: "Product"; masked: true; }>;
    "\n    query FetchProduct($channelSlug: String!) {\n      products(\n        first: 1\n        channel: $channelSlug\n        filter: {\n          isPublished: true\n          stockAvailability: IN_STOCK\n          giftCard: false\n        }\n        sortBy: { field: PRICE, direction: DESC }\n      ) {\n        edges {\n          node {\n            ...Product\n          }\n        }\n      }\n    }\n  ":
      TadaDocumentNode<{ products: { edges: { node: { [$tada.fragmentRefs]: { Product: "Product"; }; }; }[]; } | null; }, { channelSlug: string; }, void>;
    "\n  fragment TotalPrice on TaxedMoney {\n    gross {\n      amount\n    }\n  }\n":
      TadaDocumentNode<{ gross: { amount: number; }; }, {}, { fragment: "TotalPrice"; on: "TaxedMoney"; masked: true; }>;
    "\n  fragment PaymentGateway on PaymentGateway {\n    id\n    name\n  }\n":
      TadaDocumentNode<{ id: string; name: string; }, {}, { fragment: "PaymentGateway"; on: "PaymentGateway"; masked: true; }>;
    "\n    query GetPaymentGateways($checkoutId: ID!) {\n      checkout(id: $checkoutId) {\n        totalPrice {\n          ...TotalPrice\n        }\n        availablePaymentGateways {\n          ...PaymentGateway\n        }\n      }\n    }\n  ":
      TadaDocumentNode<{ checkout: { totalPrice: { [$tada.fragmentRefs]: { TotalPrice: "TaxedMoney"; }; }; availablePaymentGateways: { [$tada.fragmentRefs]: { PaymentGateway: "PaymentGateway"; }; }[]; } | null; }, { checkoutId: string; }, void>;
    "\n  fragment Checkout on Checkout {\n    id\n    created\n    billingAddress {\n      firstName\n      lastName\n      streetAddress1\n      city\n      postalCode\n      country {\n        code\n        country\n      }\n      countryArea\n      phone\n    }\n    shippingAddress {\n      firstName\n      lastName\n      streetAddress1\n      city\n      postalCode\n      countryArea\n      country {\n        code\n        country\n      }\n      phone\n    }\n    email\n    totalPrice {\n      gross {\n        amount\n      }\n      currency\n    }\n    subtotalPrice {\n      gross {\n        amount\n      }\n      currency\n    }\n    shippingPrice {\n      gross {\n        amount\n      }\n      currency\n    }\n    lines {\n      id\n      variant {\n        product {\n          name\n        }\n      }\n      quantity\n      totalPrice {\n        gross {\n          amount\n        }\n        currency\n      }\n    }\n  }\n":
      TadaDocumentNode<{ id: string; created: unknown; billingAddress: { firstName: string; lastName: string; streetAddress1: string; city: string; postalCode: string; country: { code: string; country: string; }; countryArea: string; phone: string | null; } | null; shippingAddress: { firstName: string; lastName: string; streetAddress1: string; city: string; postalCode: string; countryArea: string; country: { code: string; country: string; }; phone: string | null; } | null; email: string | null; totalPrice: { gross: { amount: number; }; currency: string; }; subtotalPrice: { gross: { amount: number; }; currency: string; }; shippingPrice: { gross: { amount: number; }; currency: string; }; lines: { id: string; variant: { product: { name: string; }; }; quantity: number; totalPrice: { gross: { amount: number; }; currency: string; }; }[]; }, {}, { fragment: "Checkout"; on: "Checkout"; masked: true; }>;
    "\n  mutation CompleteCheckout($checkoutId: ID!) {\n    checkoutComplete(id: $checkoutId) {\n      order {\n        id\n      }\n      errors {\n        field\n        message\n        code\n      }\n    }\n  }\n":
      TadaDocumentNode<{ checkoutComplete: { order: { id: string; } | null; errors: { field: string | null; message: string | null; code: "GRAPHQL_ERROR" | "INVALID" | "NOT_FOUND" | "UNIQUE" | "BILLING_ADDRESS_NOT_SET" | "CHECKOUT_NOT_FULLY_PAID" | "PRODUCT_NOT_PUBLISHED" | "PRODUCT_UNAVAILABLE_FOR_PURCHASE" | "INSUFFICIENT_STOCK" | "INVALID_SHIPPING_METHOD" | "PAYMENT_ERROR" | "QUANTITY_GREATER_THAN_LIMIT" | "REQUIRED" | "SHIPPING_ADDRESS_NOT_SET" | "SHIPPING_METHOD_NOT_APPLICABLE" | "DELIVERY_METHOD_NOT_APPLICABLE" | "SHIPPING_METHOD_NOT_SET" | "SHIPPING_NOT_REQUIRED" | "TAX_ERROR" | "VOUCHER_NOT_APPLICABLE" | "GIFT_CARD_NOT_APPLICABLE" | "ZERO_QUANTITY" | "MISSING_CHANNEL_SLUG" | "CHANNEL_INACTIVE" | "UNAVAILABLE_VARIANT_IN_CHANNEL" | "EMAIL_NOT_SET" | "NO_LINES" | "INACTIVE_PAYMENT" | "SHIPPING_CHANGE_FORBIDDEN"; }[]; } | null; }, { checkoutId: string; }, void>;
    "\n    query getCheckoutSummary($checkoutId: ID!) {\n      checkout(id: $checkoutId) {\n        ...Checkout\n      }\n    }\n  ":
      TadaDocumentNode<{ checkout: { [$tada.fragmentRefs]: { Checkout: "Checkout"; }; } | null; }, { checkoutId: string; }, void>;
    "\n  mutation checkoutDeliveryMethodUpdate($checkoutId: ID!, $input: ID!) {\n    checkoutDeliveryMethodUpdate(id: $checkoutId, deliveryMethodId: $input) {\n      errors {\n        field\n        message\n      }\n    }\n  }\n":
      TadaDocumentNode<{ checkoutDeliveryMethodUpdate: { errors: { field: string | null; message: string | null; }[]; } | null; }, { input: string; checkoutId: string; }, void>;
  }
}
