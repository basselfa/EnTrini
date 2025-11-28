export default {
  "name": "GymFeedback",
  "type": "object",
  "properties": {
    "gym_id": {
      "type": "string",
      "description": "ID del gimnasio"
    },
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Email del usuario"
    },
    "user_name": {
      "type": "string",
      "description": "Nombre del usuario"
    },
    "rating": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Calificación de 1 a 5 estrellas"
    },
    "comment": {
      "type": "string",
      "description": "Comentario del usuario"
    }
  },
  "required": [
    "gym_id",
    "user_email",
    "rating"
  ]
}