{
  "name": "ChatMessage",
  "type": "object",
  "properties": {
    "session_id": {
      "type": "string",
      "description": "ID de la session de chat"
    },
    "sender_type": {
      "type": "string",
      "enum": [
        "user",
        "ai",
        "admin"
      ],
      "description": "Type d'expéditeur"
    },
    "sender_email": {
      "type": "string",
      "description": "Email de l'expéditeur"
    },
    "message": {
      "type": "string",
      "description": "Contenu du message"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "Heure du message"
    }
  },
  "required": [
    "session_id",
    "sender_type",
    "message",
    "timestamp"
  ]
}