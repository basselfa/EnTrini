{
  "name": "CheckIn",
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
    "gym_id": {
      "type": "string",
      "description": "ID del gimnasio"
    },
    "gym_name": {
      "type": "string",
      "description": "Nombre del gimnasio"
    },
    "check_in_time": {
      "type": "string",
      "format": "date-time",
      "description": "Hora de entrada"
    },
    "membership_status": {
      "type": "string",
      "enum": [
        "active",
        "expired",
        "invalid"
      ],
      "description": "Estado de la membresía en el momento del check-in"
    }
  },
  "required": [
    "user_email",
    "gym_id",
    "check_in_time"
  ]
}