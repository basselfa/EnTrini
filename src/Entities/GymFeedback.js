{
  "name": "GymFeedback",
  "type": "object",
  "properties": {
    "gym_id": {
      "type": "string",
      "description": "ID de la salle de sport"
    },
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Email de l'utilisateur"
    },
    "user_name": {
      "type": "string",
      "description": "Nom de l'utilisateur"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Note de 1 à 5 étoiles"
    },
    "comment": {
      "type": "string",
      "description": "Commentaire de l'utilisateur"
    }
  },
  "required": [
    "gym_id",
    "user_email",
    "rating"
  ]
}