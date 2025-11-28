{
  "name": "ChatSession",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Email del usuario"
    },
    "user_name": {
      "type": "string",
      "description": "Nombre del usuario"
    },
    "status": {
      "type": "string",
      "enum": [
        "active_ai",
        "active_human",
        "closed"
      ],
      "default": "active_ai",
      "description": "Estado: AI, Humano, o Cerrado"
    },
    "assigned_to": {
      "type": "string",
      "description": "Email del admin asignado si escalado"
    },
    "last_message_time": {
      "type": "string",
      "format": "date-time",
      "description": "Última actividad"
    }
  },
  "required": [
    "user_email",
    "user_name"
  ]
}