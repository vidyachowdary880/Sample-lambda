export const groupCreateSchema = {
  type: "object",
  required: ["group"],
  errorMessage: {
    required: {
      group: "SIPMB005"
    }
  },
  properties: {
    group: {
      type: "object", required: ["name"],
      errorMessage: {
        required: {
          name: "SIPMB004",
        }
      },
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPMB002"
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
      group: "SIPMB005"
    }
  },
  properties: {
    group: {
      type: "object", required: ["id", "name"],
      errorMessage: {
        required: {
          id: "SIPMB003",
          name: "SIPMB004"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPMB001"
        },
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPMB002"
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
      group: "SIPMB005"
    }
  },
  properties: {
    group: {
      type: "object", required: ["id"],
      errorMessage: {
        required: {
          id: "SIPMB003"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPMB001"
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
      phase: "SIPMB005"
    }
  },
  properties: {
    phase: {
      type: "object", required: ["name"],
      errorMessage: {
        required: {
          name: "SIPMB004",
        }
      },
      properties: {
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPMB002"
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
      phase: "SIPMB005"
    }
  },
  properties: {
    phase: {
      type: "object", required: ["id", "name"],
      errorMessage: {
        required: {
          id: "SIPMB003",
          name: "SIPMB004"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPMB001"
        },
        name: {
          type: "string",
          minLength: 3,
          maxLength: 50,
          errorMessage: "SIPMB002"
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
      phase: "SIPMB005"
    }
  },
  properties: {
    phase: {
      type: "object", required: ["id"],
      errorMessage: {
        required: {
          id: "SIPMB003"
        }
      },
      properties: {
        id: {
          pattern: "^[0-9#A-Z]+$",
          type: "string",
          errorMessage: "SIPMB001"
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
      organization: "SIPMB401"
    }
  },
  properties: {
    organization: {
      type: "object",
      required: ["organizationName", "users", "description", "coreFour"],
      errorMessage: "SIPMB402",
      properties: {
        organizationName: {
          type: "string",
          minLength: 3,
          maxLength: 100,
          errorMessage: "SIPMB403",
        },
        users: {
          type: "array",
          errorMessage: "SIPMB405",
          items: {
            type: "object",
            required: ["firstName", "lastName", "emailId", "phoneNo"],
            errorMessage: "SIPMB405",
            properties: {
              firstName: {
                type: "string",
                maxLength: 30,
                errorMessage: "SIPMB405"
              },
              lastName: {
                type: "string",
                maxLength: 30,
                errorMessage: "SIPMB405"
              },
              emailId: {
                type: "string",
                pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
                errorMessage: "SIPMB410"
              },
              phoneNo: {
                type: "string",
                pattern: "^[0-9\-\+]{10,15}$",
                errorMessage: "SIPMB407"
              },
              changeCode: {
                type: "string",
                maxLength: 1,
                errorMessage: "SIPMB409"
              },

            }
          }
        },
        description: {
          type: "string",
          minLength: 3,
          maxLength: 100,
          errorMessage: "SIPMB406"
        },
        coreFour: {
          type: "object",
          errorMessage: "SIPMB408"
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
      errorMessage: {
        required: {
          id: "SIPMB003",
        }
      },
      properties: {
        id: {
          type: "string",
          errorMessage: "SIPMB001"
        }
      }
    }
  }
}

export const deleteOrgSchema = {
  type: "object",
  required: ["organizationName"],
  properties: {
    organizationName: {
      type: "string",
      errorMessage: "SIPME403"
    }
  }
}


export const editDataSchema = {
  type: "object",
  required: ["id", "name"],
  errorMessage: {
    required: {
      id: "SIPMB003",
      name: "SIPMB004"
    }
  },
  properties: {
    id: {
      pattern: "^[0-9]+$",
      type: "string",
      errorMessage: "SIPMB001"
    },
    name: {
      pattern: "^[0-9A-Za-z]+$",
      type: "string",
      errorMessage: "SIPMB002"
    }
  }

}

export const getDataSchema = {
  type: "object",
  required: ["queryStringParameters"],
  properties: {
    queryStringParameters: {
      type: "object", required: ["id"],
      errorMessage: {
        required: {
          id: "SIPMB003",
        }
      },
      properties: {
        id: {
          pattern: "^[0-9]+$",
          type: "string",
          errorMessage: "SIPMB001"
        }
      }
    }
  }
}
