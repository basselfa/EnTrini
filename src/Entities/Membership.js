export default {
  "name": "Membership",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "format": "email",
      "description": "Email del usuario"
    },
    "plan_type": {
      "type": "string",
      "enum": [
        "classic",
        "professional"
      ],
      "default": "classic",
      "description": "Tipo de plan: Classic o Professional"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "expired",
        "cancelled"
      ],
      "default": "active",
      "description": "Estado"
    },
    "total_visits": {
      "type": "number",
      "description": "Número total de visitas incluidas en el plan"
    },
    "remaining_visits": {
      "type": "number",
      "description": "Número de visitas restantes"
    },
    "price": {
      "type": "number",
      "description": "Precio pagado en DZD"
    },
    "purchase_date": {
      "type": "string",
      "format": "date",
      "description": "Fecha de compra"
    },
    "expiry_date": {
      "type": "string",
      "format": "date",
      "description": "Fecha de expiración (90 días después de la compra)"
    }
  },
  "required": [
    "user_email",
    "plan_type",
    "total_visits",
    "remaining_visits",
    "price",
    "purchase_date",
    "expiry_date"
  ]
}