{
  "name": "ChatMessage",
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "ID de la sesión de chat"
    },
    "sender_type": {
      "type": "string",
      "enum": [
        "user",
        "ai",
        "admin"
      ],
      "description": "Tipo de remitente"
    },
    "sender_email": {
      "type": "string",
      "description": "Email del remitente"
    },
    "message": {
      "type": "string",
      "description": "Contenido del mensaje"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Hora del mensaje"
    }
  },
  "required": [
    "session_id",
    "sender_type",
    "message",
    "timestamp"
  ]
}