{
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
      "description": "Type de plan: Classic ou Professional"
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
      "description": "Nombre total de visites incluses dans le plan"
    },
    "remaining_visits": {
      "type": "number",
      "description": "Nombre de visites restantes"
    },
    "price": {
      "type": "number",
      "description": "Prix payé en DZD"
    },
    "purchase_date": {
      "type": "string",
      "format": "date",
      "description": "Date d'achat"
    },
    "expiry_date": {
      "type": "string",
      "format": "date",
      "description": "Date d'expiration (90 jours après l'achat)"
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