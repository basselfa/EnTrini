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
      "description": "ID de la salle de sport"
    },
    "gym_name": {
      "type": "string",
      "description": "Nom de la salle"
    },
    "check_in_time": {
      "type": "string",
      "format": "date-time",
      "description": "Heure d'entrée"
    },
    "membership_status": {
      "type": "string",
      "enum": [
        "active",
        "expired",
        "invalid"
      ],
      "description": "Statut de l'abonnement au moment du check-in"
    }
  },
  "required": [
    "user_email",
    "gym_id",
    "check_in_time"
  ]
}