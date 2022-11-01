export const groupCreateSchema = {
  type: "object",
  required: ["group"],
  errorMessage: {
    required: {
      group: "SIPM_GRP_ERR_001"
    }
  },
  properties: {
    group: {
      type: "object", required: ["name"],
      errorMessage: {
        required: {
          name: "SIPM_GRP_ERR_002",
        }
      },
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPM_GRP_ERR_003"
        }
      }
    }
  }
}

export const groupEditSchema = {
  type: "object",
  required: ["group"],
  errorMessage: {
    required: {
      group: "SIPM_GRP_ERR_001"
    }
  },
  properties: {
    group: {
      type: "object", required: ["id", "name"],
      errorMessage: {
        required: {
          id: "SIPM_GRP_ERR_004",
          name: "SIPM_GRP_ERR_002"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPM_GRP_ERR_005"
        },
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPM_GRP_ERR_003"
        }
      }
    }
  }
}

export const groupDeleteSchema = {
  type: "object",
  required: ["group"],
  errorMessage: {
    required: {
      group: "SIPM_GRP_ERR_001"
    }
  },
  properties: {
    group: {
      type: "object", required: ["id"],
      errorMessage: {
        required: {
          id: "SIPM_GRP_ERR_004"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPM_GRP_ERR_005"
        }
      }
    }
  }
}

export const phaseCreateSchema = {
  type: "object",
  required: ["phase"],
  errorMessage: {
    required: {
      phase: "SIPM_PHS_ERR_001"
    }
  },
  properties: {
    phase: {
      type: "object", required: ["name"],
      errorMessage: {
        required: {
          name: "SIPM_PHS_ERR_002",
        }
      },
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPM_PHS_ERR_003"
        }
      }
    }
  }
}

export const phaseEditSchema = {
  type: "object",
  required: ["phase"],
  errorMessage: {
    required: {
      phase: "SIPM_PHS_ERR_001"
    }
  },
  properties: {
    phase: {
      type: "object", required: ["id", "name"],
      errorMessage: {
        required: {
          id: "SIPM_PHS_ERR_004",
          name: "SIPM_PHS_ERR_002"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPM_PHS_ERR_005"
        },
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPM_PHS_ERR_003"
        }
      }
    }
  }
}

export const phaseDeleteSchema = {
  type: "object",
  required: ["phase"],
  errorMessage: {
    required: {
      phase: "SIPM_PHS_ERR_001"
    }
  },
  properties: {
    phase: {
      type: "object", required: ["id"],
      errorMessage: {
        required: {
          id: "SIPM_PHS_ERR_004"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPM_PHS_ERR_005"
        }
      }
    }
  }
}

export const createOrganizationSchema = {
  type: "object",
  required: ["organization"],
  errorMessage: {
    required: {
      organization: "SIPM_ORG_ERR_001"
    }
  },
  properties: {
    organization: {
      type: "object",
      required: ["organizationName", "users", "description", "coreFour"],
      errorMessage: "SIPM_ORG_ERR_002",
      properties: {
        organizationName: {
          type: "string",
          minLength: 3,
          maxLength: 100,
          errorMessage: "SIPM_ORG_ERR_003",
        },
        users: {
          type: "array",
          errorMessage: "SIPM_ORG_ERR_004",
          items: {
            type: "object",
            required: ["firstName", "lastName", "emailId", "phoneNo"],
            errorMessage: "SIPM_ORG_ERR_005",
            properties: {
              firstName: {
                type: "string",
                maxLength: 30,
                errorMessage: "SIPM_ORG_ERR_005"
              },
              lastName: {
                type: "string",
                maxLength: 30,
                errorMessage: "SIPM_ORG_ERR_005"
              },
              emailId: {
                type: "string",
                pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
                errorMessage: "SIPM_ORG_ERR_010"
              },
              phoneNo: {
                type: "string",
                pattern: "^(?:\+?1[-.●]?)?\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$",
                errorMessage: "SIPM_ORG_ERR_007"
              },
              changeCode: {
                type: "string",
                maxLength: 1,
                errorMessage: "SIPM_ORG_ERR_009"
              },

            }
          }
        },
        description: {
          type: "string",
          minLength: 3,
          maxLength: 100,
          errorMessage: "SIPM_ORG_ERR_006"
        },
        coreFour: {
          type: "object",
          errorMessage: "SIPM_ORG_ERR_008"
        },
      }
    },

  }

}


export const organizationGetByIdSchema = {
  type: "object",
  required: ["queryStringParameters"],
  properties: {
    queryStringParameters: {
      type: "object", required: ["name"],
      errorMessage: "SIPM_ORG_ERR_015",
      properties: {
        name: {
          type: "string",
          errorMessage: "SIPM_ORG_ERR_016"
        }
      }
    }
  }
}

export const deleteOrgSchema = {
  type: "object",
  required: ["organizationName"],
  errorMessage: "SIPM_ORG_ERR_018",
  properties: {
    organizationName: {
      type: "string",
      errorMessage: "SIPM_ORG_ERR_017"
    }
  }
}

